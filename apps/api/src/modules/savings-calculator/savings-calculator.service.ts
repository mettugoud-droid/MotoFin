import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Decimal from 'decimal.js';
import { Prisma } from '@prisma/client';

import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { BankRatesService } from '../shared/services/bank-rates.service';
import { VehicleValuationService } from '../shared/services/vehicle-valuation.service';
import { SavingsCalculationRepository } from './repositories/savings-calculation.repository';
import { CalculateSavingsDto } from './dto/calculate-savings.dto';
import { SavingsCalculationDataDto, BankComparisonDto } from './dto/savings-response.dto';

export interface SavingsCalculationResult {
  data: SavingsCalculationDataDto;
  calculationId: string;
  responseTimeMs: number;
}

@Injectable()
export class SavingsCalculatorService {
  private readonly logger = new Logger(SavingsCalculatorService.name);

  constructor(
    private readonly emiCalculator: EmiCalculatorService,
    private readonly bankRatesService: BankRatesService,
    private readonly vehicleValuation: VehicleValuationService,
    private readonly repository: SavingsCalculationRepository,
  ) {}

  async calculateSavings(dto: CalculateSavingsDto): Promise<SavingsCalculationResult> {
    const startTime = Date.now();
    const sessionId = randomUUID();

    // 1. Fetch bank rates
    const bankRates = await this.bankRatesService.getActiveRefinanceRates(dto.outstandingAmount);

    if (bankRates.length === 0) {
      throw new ServiceUnavailableException(
        'Savings calculation is temporarily unavailable. No bank rates configured.',
      );
    }

    // 2. Check if current rate is already competitive
    const bestRate = bankRates[0].interestRateMin;
    const isRateCompetitive = dto.currentRate <= bestRate;

    // 3. Calculate EMI for each bank
    const bankComparisons: BankComparisonDto[] = [];
    const top3Banks = bankRates.slice(0, 3);

    const currentTotalInterest = this.emiCalculator.calculateTotalInterest(
      new Decimal(dto.currentEmi),
      dto.remainingTenure,
      dto.outstandingAmount,
    );

    for (const bank of top3Banks) {
      const newEmi = this.emiCalculator.calculateEmi(
        dto.outstandingAmount,
        bank.interestRateMin,
        dto.remainingTenure,
      );

      const monthlySaving = this.emiCalculator.calculateMonthlySaving(dto.currentEmi, newEmi);
      const newTotalInterest = this.emiCalculator.calculateTotalInterest(
        newEmi,
        dto.remainingTenure,
        dto.outstandingAmount,
      );
      const totalSaving = this.emiCalculator.calculateTotalInterestSaving(
        currentTotalInterest,
        newTotalInterest,
      );

      bankComparisons.push({
        bankName: bank.bankName,
        offeredRate: bank.interestRateMin,
        estimatedEmi: newEmi.toNumber(),
        monthlySaving: Math.max(0, monthlySaving.toNumber()),
        totalSaving: Math.max(0, totalSaving.toNumber()),
      });
    }

    // 4. Best bank recommendation
    const bestBank = bankComparisons[0];
    const monthlySaving = isRateCompetitive ? 0 : bestBank.monthlySaving;
    const totalInterestSaving = isRateCompetitive ? 0 : bestBank.totalSaving;

    // 5. Top-up eligibility
    const topUpResult = this.vehicleValuation.checkTopUpEligibility(
      dto.outstandingAmount,
      dto.originalTenure,
      dto.remainingTenure,
    );

    // 6. Build response
    const data: SavingsCalculationDataDto = {
      monthlySaving,
      totalInterestSaving,
      topUpEligible: topUpResult.eligible,
      topUpAmount: topUpResult.amount,
      recommendedBank: {
        name: bestBank.bankName,
        offeredRate: bestBank.offeredRate,
        estimatedEmi: bestBank.estimatedEmi,
      },
      bankComparisons,
      isRateCompetitive,
      competitiveMessage: isRateCompetitive
        ? 'Your current interest rate is already competitive. Consider a top-up loan instead.'
        : null,
    };

    const responseTimeMs = Date.now() - startTime;

    // 7. Persist calculation
    const savedCalculation = await this.repository.create({
      sessionId,
      currentEmi: dto.currentEmi,
      outstandingAmount: dto.outstandingAmount,
      currentRate: dto.currentRate,
      remainingTenure: dto.remainingTenure,
      originalTenure: dto.originalTenure,
      monthlySaving,
      totalInterestSaving,
      topUpEligible: topUpResult.eligible,
      topUpAmount: topUpResult.amount,
      recommendedBank: bestBank.bankName,
      bankComparisons: bankComparisons as unknown as Prisma.InputJsonValue,
      responseTimeMs,
    });

    this.logger.log(
      `Savings calculated: ₹${monthlySaving}/mo saving, best rate ${bestBank.offeredRate}% (${bestBank.bankName}) [${responseTimeMs}ms]`,
    );

    return {
      data,
      calculationId: savedCalculation.id,
      responseTimeMs,
    };
  }
}
