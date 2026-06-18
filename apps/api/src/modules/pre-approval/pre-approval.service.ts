import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { Prisma } from '@prisma/client';

import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';
import { BankRatesService, BankRateInfo } from '../shared/services/bank-rates.service';
import { VehicleValuationService } from '../shared/services/vehicle-valuation.service';
import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { PreApprovalRepository } from './repositories/pre-approval.repository';
import { CalculatePreApprovalDto } from './dto/calculate-pre-approval.dto';
import { PreApprovalDataDto, PreApprovalBankDto } from './dto/pre-approval-response.dto';

const DISCLAIMER = 'This is an indicative estimate based on the information provided. Final approval is subject to document verification and bank assessment.';

export interface PreApprovalResult {
  data: PreApprovalDataDto;
  preApprovalId: string;
  responseTimeMs: number;
}

@Injectable()
export class PreApprovalService {
  private readonly logger = new Logger(PreApprovalService.name);

  constructor(
    private readonly savingsCalcRepository: SavingsCalculationRepository,
    private readonly bankRatesService: BankRatesService,
    private readonly vehicleValuation: VehicleValuationService,
    private readonly emiCalculator: EmiCalculatorService,
    private readonly preApprovalRepository: PreApprovalRepository,
  ) {}

  async calculatePreApproval(dto: CalculatePreApprovalDto): Promise<PreApprovalResult> {
    const startTime = Date.now();

    // 1. Get source calculation data
    const savingsData = await this.savingsCalcRepository.findBySessionId(dto.sessionId);

    if (!savingsData) {
      throw new NotFoundException('Calculation not found for the provided session ID');
    }

    // 2. Get bank rates
    const bankRates = await this.bankRatesService.getActiveRefinanceRates(
      Number(savingsData.outstandingAmount),
    );

    // 3. Calculate approval probability
    const approvalProbability = this.calculateApprovalProbability(
      savingsData,
      bankRates,
    );

    // 4. Determine confidence level
    const confidenceLevel = this.getConfidenceLevel(approvalProbability);
    const confidenceMessage = this.getConfidenceMessage(confidenceLevel);

    // 5. Get recommended banks (top 3)
    const recommendedBanks = this.getRecommendedBanks(bankRates, confidenceLevel);

    // 6. Calculate top-up eligibility
    const topUpEligibility = this.calculateTopUpAmount(
      Number(savingsData.outstandingAmount),
      savingsData.originalTenure,
      savingsData.remainingTenure,
    );

    // 7. Build response
    const data: PreApprovalDataDto = {
      approvalProbability: Math.round(approvalProbability * 10) / 10,
      confidenceLevel,
      confidenceMessage,
      topUpEligibility,
      recommendedBanks,
      disclaimer: DISCLAIMER,
    };

    const responseTimeMs = Date.now() - startTime;

    // 8. Persist result
    const saved = await this.preApprovalRepository.create({
      sourceType: 'savings_calculator',
      sourceCalculationId: savingsData.id,
      approvalProbability: data.approvalProbability,
      confidenceLevel: confidenceLevel.toLowerCase(),
      topUpAmount: topUpEligibility,
      recommendedBanks: recommendedBanks as unknown as Prisma.InputJsonValue,
    });

    this.logger.log(
      `Pre-approval calculated: probability=${data.approvalProbability}%, confidence=${confidenceLevel}, banks=${recommendedBanks.length} [${responseTimeMs}ms]`,
    );

    return {
      data,
      preApprovalId: saved.id,
      responseTimeMs,
    };
  }

  private calculateApprovalProbability(
    savingsData: { currentEmi: unknown; outstandingAmount: unknown; currentRate: unknown; remainingTenure: number; originalTenure: number; monthlySaving: unknown },
    bankRates: BankRateInfo[],
  ): number {
    // Factor 1: Repayment Profile (40%)
    // Good repayment = outstanding is consistent with expected amortization
    const elapsedMonths = savingsData.originalTenure - savingsData.remainingTenure;
    const repaymentFactor = this.calculateRepaymentFactor(elapsedMonths, savingsData.originalTenure);

    // Factor 2: Outstanding Loan Ratio / LTV (25%)
    const outstandingAmount = Number(savingsData.outstandingAmount);
    const vehicleValue = this.vehicleValuation.estimateCurrentVehicleValue(
      outstandingAmount,
      savingsData.originalTenure,
      savingsData.remainingTenure,
    );
    const ltv = this.vehicleValuation.calculateLtv(outstandingAmount, vehicleValue);
    const ltvFactor = new Decimal(1).minus(ltv).mul(100).toNumber();
    const normalizedLtvFactor = Math.max(0, Math.min(100, ltvFactor));

    // Factor 3: Income Adequacy (20%)
    // Customer is paying current EMI -> can afford lower/equal EMI at new rate
    const currentEmi = Number(savingsData.currentEmi);
    const bestRate = bankRates.length > 0 ? bankRates[0].interestRateMin : Number(savingsData.currentRate);
    const newEmi = this.emiCalculator.calculateEmi(
      outstandingAmount,
      bestRate,
      savingsData.remainingTenure,
    );
    const incomeFactor = Math.min(100, new Decimal(currentEmi).div(newEmi).mul(50).toNumber());

    // Factor 4: Historical Bank Approval Rate (15%)
    const historyFactor = bankRates.length > 0
      ? bankRates.slice(0, 3).reduce((sum, b) => sum + b.historicalApprovalRate, 0) / Math.min(3, bankRates.length)
      : 50;

    // Weighted formula
    const probability =
      repaymentFactor * 0.40 +
      normalizedLtvFactor * 0.25 +
      incomeFactor * 0.20 +
      historyFactor * 0.15;

    return Math.max(0, Math.min(100, probability));
  }

  private calculateRepaymentFactor(elapsedMonths: number, originalTenure: number): number {
    // If loan has been running for a significant time with consistent payments,
    // repayment profile is strong
    if (elapsedMonths <= 0) return 30; // New loan, minimal history

    const tenureCompletionRatio = elapsedMonths / originalTenure;

    if (tenureCompletionRatio >= 0.5) return 95; // 50%+ tenure completed - excellent
    if (tenureCompletionRatio >= 0.3) return 80; // 30-50% - good
    if (tenureCompletionRatio >= 0.2) return 65; // 20-30% - fair
    return 50; // Less than 20% - limited history
  }

  private getConfidenceLevel(probability: number): string {
    if (probability >= 70) return 'HIGH';
    if (probability >= 40) return 'MODERATE';
    return 'SUBJECT_TO_VERIFICATION';
  }

  private getConfidenceMessage(level: string): string {
    switch (level) {
      case 'HIGH':
        return 'High Chance of Approval — Based on your loan profile, you have a strong probability of approval.';
      case 'MODERATE':
        return 'Moderate Chance of Approval — Submitting documents will improve the accuracy of this estimate.';
      case 'SUBJECT_TO_VERIFICATION':
        return 'Subject to Document Verification — We recommend submitting your details for a personalized assessment.';
      default:
        return 'Assessment pending further information.';
    }
  }

  private getRecommendedBanks(bankRates: BankRateInfo[], confidenceLevel: string): PreApprovalBankDto[] {
    // Only show bank recommendations for HIGH and MODERATE confidence
    if (confidenceLevel === 'SUBJECT_TO_VERIFICATION') {
      return [];
    }

    return bankRates.slice(0, 3).map((bank) => ({
      bankName: bank.bankName,
      offeredRate: bank.interestRateMin,
      historicalApprovalRate: bank.historicalApprovalRate,
    }));
  }

  private calculateTopUpAmount(
    outstandingAmount: number,
    originalTenure: number,
    remainingTenure: number,
  ): number | null {
    const result = this.vehicleValuation.checkTopUpEligibility(
      outstandingAmount,
      originalTenure,
      remainingTenure,
    );

    return result.eligible ? result.amount : null;
  }
}
