import { Injectable, Logger, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Decimal from 'decimal.js';

import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { BankRatesService, BankRateInfo } from '../shared/services/bank-rates.service';
import { VehicleValuationService } from '../shared/services/vehicle-valuation.service';
import { ForeclosureCalculationRepository } from './repositories/foreclosure-calculation.repository';
import { CalculateForeclosureDto } from './dto/calculate-foreclosure.dto';
import { ForeclosureDataDto } from './dto/foreclosure-response.dto';

/**
 * Bank pre-closure charge configuration.
 * Floating rate loans with tenure > 12 months: 0% (per RBI guidelines)
 * Fixed rate: bank-specific percentage of outstanding principal
 */
const BANK_PRECLOSURE_CHARGES: Record<string, { fixedRateCharge: number; isTypicallyFloating: boolean }> = {
  'HDFC Bank': { fixedRateCharge: 0.04, isTypicallyFloating: true },
  'ICICI Bank': { fixedRateCharge: 0.04, isTypicallyFloating: true },
  'Axis Bank': { fixedRateCharge: 0.05, isTypicallyFloating: true },
  'Kotak Mahindra Bank': { fixedRateCharge: 0.03, isTypicallyFloating: true },
  'IndusInd Bank': { fixedRateCharge: 0.05, isTypicallyFloating: false },
  'AU Small Finance Bank': { fixedRateCharge: 0.05, isTypicallyFloating: false },
  'Shriram Finance': { fixedRateCharge: 0.05, isTypicallyFloating: false },
  'Cholamandalam Finance': { fixedRateCharge: 0.04, isTypicallyFloating: false },
  'Mahindra Finance': { fixedRateCharge: 0.04, isTypicallyFloating: false },
};

const MIN_MONTHLY_SAVINGS_FOR_TAKEOVER = 500;
const MIN_LOAN_AGE_MONTHS = 12;
const MIN_REMAINING_TENURE_MONTHS = 12;
const VEHICLE_COVERAGE_RATIO = 1.20; // Vehicle value must be 120% of foreclosure amount

export interface ForeclosureCalculationResult {
  data: ForeclosureDataDto;
  calculationId: string;
  responseTimeMs: number;
}

@Injectable()
export class ForeclosureCalculatorService {
  private readonly logger = new Logger(ForeclosureCalculatorService.name);

  constructor(
    private readonly emiCalculator: EmiCalculatorService,
    private readonly bankRatesService: BankRatesService,
    private readonly vehicleValuation: VehicleValuationService,
    private readonly repository: ForeclosureCalculationRepository,
  ) {}

  async calculateForeclosure(dto: CalculateForeclosureDto): Promise<ForeclosureCalculationResult> {
    const startTime = Date.now();
    const sessionId = randomUUID();

    // 1. Validate loan start date
    const loanStartDate = new Date(dto.loanStartDate);
    const now = new Date();
    if (loanStartDate >= now) {
      throw new BadRequestException('loanStartDate must be in the past');
    }
    const maxPastDate = new Date();
    maxPastDate.setFullYear(maxPastDate.getFullYear() - 30);
    if (loanStartDate < maxPastDate) {
      throw new BadRequestException('loanStartDate must not be more than 30 years ago');
    }

    // 2. Calculate elapsed and remaining tenure
    const elapsedMonths = this.monthsBetween(loanStartDate, now);
    // Estimate original tenure from EMI and outstanding
    const estimatedOriginalTenure = Math.max(elapsedMonths + 12, Math.round(elapsedMonths * 1.5));
    const remainingTenure = Math.max(1, estimatedOriginalTenure - elapsedMonths);

    // 3. Determine if floating rate
    const bankConfig = BANK_PRECLOSURE_CHARGES[dto.currentBank];
    const isFloatingRate = bankConfig?.isTypicallyFloating ?? false;

    // 4. Calculate pre-closure charges
    let preclosureCharges = 0;
    if (!isFloatingRate || elapsedMonths <= 12) {
      // Fixed rate or short tenure: apply bank charge
      const chargeRate = bankConfig?.fixedRateCharge ?? 0.04;
      preclosureCharges = Math.round(dto.outstandingAmount * chargeRate);
    }
    // Floating rate with tenure > 12 months: 0% per RBI guidelines

    // 5. Calculate foreclosure amount
    // Foreclosure = Outstanding + Accrued interest (prorated current month) + Pre-closure charges
    const monthlyRate = dto.currentRate / 12 / 100;
    const accruedInterest = Math.round(dto.outstandingAmount * monthlyRate * 0.5); // Half-month average
    const foreclosureAmount = dto.outstandingAmount + accruedInterest + preclosureCharges;

    // 6. Get best refinance rate
    const bankRates = await this.bankRatesService.getActiveRefinanceRates(dto.outstandingAmount);
    if (bankRates.length === 0) {
      throw new ServiceUnavailableException('No refinance rates available currently');
    }

    const bestBank = bankRates[0];

    // 7. Calculate new EMI at best rate
    const newEmi = this.emiCalculator.calculateEmi(dto.outstandingAmount, bestBank.interestRateMin, remainingTenure);
    const newEmiNumber = newEmi.toNumber();

    // 8. Calculate savings
    const currentTotalInterest = this.emiCalculator.calculateTotalInterest(
      new Decimal(dto.currentEmi), remainingTenure, dto.outstandingAmount,
    );
    const newTotalInterest = this.emiCalculator.calculateTotalInterest(
      newEmi, remainingTenure, dto.outstandingAmount,
    );
    const totalInterestSaved = currentTotalInterest.minus(newTotalInterest).toNumber();
    const netSavingsAfterForeclosure = Math.round(totalInterestSaved - preclosureCharges);
    const monthlySavings = Math.max(0, Math.round(dto.currentEmi - newEmiNumber));

    // 9. Determine takeover eligibility (Requirement 20.4)
    const { takeoverEligible, reason } = this.checkTakeoverEligibility(
      elapsedMonths,
      remainingTenure,
      dto.outstandingAmount,
      estimatedOriginalTenure,
      foreclosureAmount,
      monthlySavings,
    );

    // 10. Build response
    const data: ForeclosureDataDto = {
      foreclosureAmount: Math.round(foreclosureAmount),
      preclosureCharges,
      netSavingsAfterForeclosure,
      takeoverEligible,
      takeoverIneligibilityReason: takeoverEligible ? undefined : reason,
      bestRefinanceBank: bestBank.bankName,
      monthlySavings,
      isFloatingRate,
      currentLoanTerms: {
        bankName: dto.currentBank,
        interestRate: dto.currentRate,
        monthlyEmi: dto.currentEmi,
        remainingTenureMonths: remainingTenure,
        totalRemainingInterest: Math.round(currentTotalInterest.toNumber()),
      },
      proposedRefinanceTerms: {
        bankName: bestBank.bankName,
        interestRate: bestBank.interestRateMin,
        monthlyEmi: Math.round(newEmiNumber),
        remainingTenureMonths: remainingTenure,
        totalRemainingInterest: Math.round(newTotalInterest.toNumber()),
      },
    };

    const responseTimeMs = Date.now() - startTime;

    // 11. Persist calculation
    const saved = await this.repository.create({
      sessionId,
      currentBank: dto.currentBank,
      currentEmi: dto.currentEmi,
      loanStartDate,
      outstandingAmount: dto.outstandingAmount,
      currentRate: dto.currentRate,
      foreclosureAmount: Math.round(foreclosureAmount),
      preclosureCharges,
      netSavings: netSavingsAfterForeclosure,
      takeoverEligible,
      bestRefinanceBank: bestBank.bankName,
      responseTimeMs,
    });

    this.logger.log(
      `Foreclosure calculated: bank=${dto.currentBank}, foreclosure=₹${Math.round(foreclosureAmount)}, savings=₹${monthlySavings}/mo, takeover=${takeoverEligible} [${responseTimeMs}ms]`,
    );

    return { data, calculationId: saved.id, responseTimeMs };
  }

  private checkTakeoverEligibility(
    elapsedMonths: number,
    remainingTenure: number,
    outstandingAmount: number,
    originalTenure: number,
    foreclosureAmount: number,
    monthlySavings: number,
  ): { takeoverEligible: boolean; reason?: string } {
    // Condition 1: Loan age > 12 months
    if (elapsedMonths < MIN_LOAN_AGE_MONTHS) {
      return { takeoverEligible: false, reason: 'Loan age must be greater than 12 months for balance transfer' };
    }

    // Condition 2: Remaining tenure >= 12 months
    if (remainingTenure < MIN_REMAINING_TENURE_MONTHS) {
      return { takeoverEligible: false, reason: 'Remaining tenure must be at least 12 months' };
    }

    // Condition 3: Vehicle value >= 120% of foreclosure amount
    const vehicleValue = this.vehicleValuation.estimateCurrentVehicleValue(
      outstandingAmount, originalTenure, remainingTenure,
    );
    const requiredVehicleValue = new Decimal(foreclosureAmount).mul(VEHICLE_COVERAGE_RATIO);
    if (vehicleValue.lt(requiredVehicleValue)) {
      return { takeoverEligible: false, reason: 'Vehicle value does not sufficiently cover the foreclosure amount' };
    }

    // Condition 4: Net monthly savings >= ₹500
    if (monthlySavings < MIN_MONTHLY_SAVINGS_FOR_TAKEOVER) {
      return { takeoverEligible: false, reason: 'Monthly savings must be at least ₹500 to justify the transfer process' };
    }

    return { takeoverEligible: true };
  }

  private monthsBetween(start: Date, end: Date): number {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    return Math.max(0, years * 12 + months);
  }
}
