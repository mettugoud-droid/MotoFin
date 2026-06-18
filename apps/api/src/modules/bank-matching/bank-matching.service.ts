import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

import { BankMatchingRepository, BankRuleRecord } from './repositories/bank-matching.repository';
import { EmiCalculatorService } from '../shared/services/emi-calculator.service';
import { CustomerProfileDto, BankEligibilityResult, BankRecommendation, BankMatchingResult } from './dto/bank-matching.dto';

/**
 * Bank Matching Engine (Requirement 7)
 *
 * Evaluates customer profiles against all configured bank eligibility rules
 * and ranks eligible banks by estimated approval probability.
 *
 * Algorithm:
 * 1. Eligibility Check: ALL mandatory criteria must be satisfied (Req 7.2)
 * 2. Approval Probability: Weighted scoring of credit, income, history, docs (Req 7.3)
 * 3. Ranking: Descending approval probability; ties broken alphabetically (Req 7.7)
 * 4. Return top 3 (or fewer) recommendations (Req 7.3)
 */
@Injectable()
export class BankMatchingService {
  private readonly logger = new Logger(BankMatchingService.name);

  constructor(
    private readonly repository: BankMatchingRepository,
    private readonly emiCalculator: EmiCalculatorService,
  ) {}

  /**
   * Evaluate customer profile against all banks (Req 7.1 — within 10 seconds)
   */
  async matchBanks(profile: CustomerProfileDto): Promise<BankMatchingResult> {
    const startTime = Date.now();
    const loanProductCode = profile.loanProductCode || 'refinance_loan';

    // 1. Get all active bank rules
    const bankRules = await this.repository.getActiveBankRules(loanProductCode);

    if (bankRules.length === 0) {
      // Req 7.5: No banks configured
      await this.repository.flagLeadForManualReview(profile.leadId, 'No bank rules configured for product');
      return {
        leadId: profile.leadId,
        totalBanksEvaluated: 0,
        eligibleBanks: 0,
        recommendations: [],
        ineligibleBanks: [],
        requiresManualReview: true,
        evaluationTimeMs: Date.now() - startTime,
      };
    }

    // 2. Evaluate eligibility for each bank (Req 7.2)
    const results: BankEligibilityResult[] = [];

    for (const rule of bankRules) {
      const eligibility = this.checkEligibility(profile, rule);
      results.push(eligibility);
    }

    // 3. Get eligible banks
    const eligibleBanks = results.filter((r) => r.isEligible);

    // 4. If no bank matches → flag for manual review (Req 7.5)
    if (eligibleBanks.length === 0) {
      await this.repository.flagLeadForManualReview(
        profile.leadId,
        `No bank eligible. Failed criteria: ${results.map((r) => `${r.bankName}(${r.failedCriteria.join(',')})`).join('; ')}`,
      );

      return {
        leadId: profile.leadId,
        totalBanksEvaluated: bankRules.length,
        eligibleBanks: 0,
        recommendations: [],
        ineligibleBanks: results.map((r) => ({ bankName: r.bankName, failedCriteria: r.failedCriteria })),
        requiresManualReview: true,
        evaluationTimeMs: Date.now() - startTime,
      };
    }

    // 5. Calculate approval probability for eligible banks
    for (const bank of eligibleBanks) {
      bank.approvalProbability = this.calculateApprovalProbability(profile, bankRules.find((r) => r.bankId === bank.bankId)!);
    }

    // 6. Rank by approval probability descending; ties alphabetically (Req 7.7)
    eligibleBanks.sort((a, b) => {
      const probDiff = (b.approvalProbability || 0) - (a.approvalProbability || 0);
      if (Math.abs(probDiff) > 0.01) return probDiff;
      return a.bankName.localeCompare(b.bankName);
    });

    // 7. Return top 3 (Req 7.3)
    const top3 = eligibleBanks.slice(0, 3);
    const recommendations: BankRecommendation[] = top3.map((bank) => {
      const rule = bankRules.find((r) => r.bankId === bank.bankId)!;
      const emi = this.emiCalculator.calculateEmi(profile.loanAmount, rule.interestRateMin || 9, 36);

      return {
        bankName: bank.bankName,
        bankCode: bank.bankCode,
        approvalProbability: Math.round((bank.approvalProbability || 0) * 100) / 100,
        offeredRate: rule.interestRateMin || 0,
        maxLoanAmount: rule.maxLoanAmount || 0,
        estimatedEmi: Math.round(emi.toNumber()),
      };
    });

    const ineligibleBanks = results
      .filter((r) => !r.isEligible)
      .map((r) => ({ bankName: r.bankName, failedCriteria: r.failedCriteria }));

    this.logger.log(
      `Bank matching: lead=${profile.leadId} evaluated=${bankRules.length} eligible=${eligibleBanks.length} top=${recommendations[0]?.bankName || 'none'} [${Date.now() - startTime}ms]`,
    );

    return {
      leadId: profile.leadId,
      totalBanksEvaluated: bankRules.length,
      eligibleBanks: eligibleBanks.length,
      recommendations,
      ineligibleBanks,
      requiresManualReview: false,
      evaluationTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Check ALL mandatory criteria for a bank (Req 7.2)
   * Bank is eligible ONLY if all criteria are satisfied.
   */
  private checkEligibility(profile: CustomerProfileDto, rule: BankRuleRecord): BankEligibilityResult {
    const failedCriteria: string[] = [];

    // Credit Score >= bank minimum
    if (rule.minCreditScore !== null && profile.creditScore < rule.minCreditScore) {
      failedCriteria.push(`credit_score: need ${rule.minCreditScore}, have ${profile.creditScore}`);
    }

    // Vehicle Age <= bank maximum
    if (rule.maxVehicleAgeMonths !== null && profile.vehicleAgeMonths > rule.maxVehicleAgeMonths) {
      failedCriteria.push(`vehicle_age: max ${rule.maxVehicleAgeMonths}mo, have ${profile.vehicleAgeMonths}mo`);
    }

    // Monthly Income >= bank minimum
    if (rule.minMonthlyIncome !== null && profile.monthlyIncome < rule.minMonthlyIncome) {
      failedCriteria.push(`income: need ${rule.minMonthlyIncome}, have ${profile.monthlyIncome}`);
    }

    // Employment Type ∈ bank accepted types
    if (rule.acceptedEmploymentTypes.length > 0 && !rule.acceptedEmploymentTypes.includes(profile.employmentType)) {
      failedCriteria.push(`employment: need ${rule.acceptedEmploymentTypes.join('/')}, have ${profile.employmentType}`);
    }

    // City ∈ bank serviceable cities
    if (rule.serviceableCities.length > 0) {
      const cityMatch = rule.serviceableCities.some(
        (c) => c.toLowerCase() === profile.city.toLowerCase(),
      );
      if (!cityMatch) {
        failedCriteria.push(`city: ${profile.city} not in serviceable cities`);
      }
    }

    // Loan Amount within bank min/max range
    if (rule.minLoanAmount !== null && profile.loanAmount < rule.minLoanAmount) {
      failedCriteria.push(`loan_amount: min ${rule.minLoanAmount}, have ${profile.loanAmount}`);
    }
    if (rule.maxLoanAmount !== null && profile.loanAmount > rule.maxLoanAmount) {
      failedCriteria.push(`loan_amount: max ${rule.maxLoanAmount}, have ${profile.loanAmount}`);
    }

    return {
      bankId: rule.bankId,
      bankName: rule.bankName,
      bankCode: rule.bankCode,
      isEligible: failedCriteria.length === 0,
      failedCriteria,
      approvalProbability: null,
      offeredRate: rule.interestRateMin,
    };
  }

  /**
   * Calculate approval probability for an eligible bank.
   * Weighted formula (from Technical Design):
   * probability = 0.35*credit + 0.25*income + 0.25*history + 0.15*docs
   */
  private calculateApprovalProbability(profile: CustomerProfileDto, rule: BankRuleRecord): number {
    // Credit factor: how far above minimum (0=at min, 100=150+ points above)
    const creditMin = rule.minCreditScore || 600;
    const creditDelta = profile.creditScore - creditMin;
    const creditFactor = Math.min(100, Math.max(0, (creditDelta / 150) * 100));

    // Income factor: ratio of income to minimum (capped at 100)
    const incomeMin = rule.minMonthlyIncome || 15000;
    const incomeFactor = Math.min(100, (profile.monthlyIncome / incomeMin) * 50);

    // History factor: bank's historical approval rate
    const historyFactor = rule.historicalApprovalRate;

    // Document completeness: assume 70% for now (docs not fully checked at matching time)
    const docFactor = 70;

    const probability =
      0.35 * creditFactor +
      0.25 * incomeFactor +
      0.25 * historyFactor +
      0.15 * docFactor;

    return Math.max(0, Math.min(100, probability));
  }
}
