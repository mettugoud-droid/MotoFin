import { Injectable, Logger } from '@nestjs/common';
import { OpportunityCategory } from '@prisma/client';

import { LeadSignals, OpportunityDetectionResult } from './dto/opportunity.dto';
import { OpportunityDetectionRepository } from './repositories/opportunity-detection.repository';

/**
 * Priority order for multi-category matches (highest to lowest):
 * Refinance > Balance Transfer > Top-Up > Loan Against Vehicle > Used Car Buyer
 * (Requirement 2.7)
 */
const CATEGORY_PRIORITY: OpportunityCategory[] = [
  OpportunityCategory.refinance_opportunity,
  OpportunityCategory.balance_transfer_opportunity,
  OpportunityCategory.top_up_opportunity,
  OpportunityCategory.loan_against_vehicle,
  OpportunityCategory.used_car_buyer,
];

@Injectable()
export class OpportunityDetectionService {
  private readonly logger = new Logger(OpportunityDetectionService.name);

  constructor(private readonly repository: OpportunityDetectionRepository) {}

  /**
   * Evaluate a lead's signals and assign primary opportunity category.
   * Implements Requirements 2.1 through 2.9.
   */
  detectOpportunity(signals: LeadSignals): OpportunityDetectionResult {
    const allMatchedCategories: OpportunityCategory[] = [];
    const matchedSignals: string[] = [];

    // Req 2.2: Used Car Buyer
    if (signals.searchingForUsedCars || signals.dealerInquiry || signals.marketplaceInquiry) {
      allMatchedCategories.push(OpportunityCategory.used_car_buyer);
      if (signals.searchingForUsedCars) matchedSignals.push('searching_for_used_cars');
      if (signals.dealerInquiry) matchedSignals.push('dealer_inquiry');
      if (signals.marketplaceInquiry) matchedSignals.push('marketplace_inquiry');
    }

    // Req 2.3: Refinance Opportunity
    if (signals.existingLoanOlderThan12Months || signals.emiToIncomeRatioExceeds50 || signals.rateExceedsMarketBy200bps) {
      allMatchedCategories.push(OpportunityCategory.refinance_opportunity);
      if (signals.existingLoanOlderThan12Months) matchedSignals.push('existing_loan_older_than_12_months');
      if (signals.emiToIncomeRatioExceeds50) matchedSignals.push('emi_income_ratio_exceeds_50');
      if (signals.rateExceedsMarketBy200bps) matchedSignals.push('rate_exceeds_market_200bps');
    }

    // Req 2.4: Balance Transfer Opportunity
    if (signals.hasActiveLoan && signals.availableRateLower100bps) {
      allMatchedCategories.push(OpportunityCategory.balance_transfer_opportunity);
      matchedSignals.push('active_loan_with_lower_rate_available');
    }

    // Req 2.5: Top-Up Opportunity
    if (signals.hasActiveLoan && signals.noMissedPaymentsLast12Months) {
      allMatchedCategories.push(OpportunityCategory.top_up_opportunity);
      matchedSignals.push('active_loan_no_missed_payments_12mo');
    }

    // Req 2.6: Loan Against Vehicle
    if (signals.vehicleRegisteredInName && signals.fundingRequirement) {
      allMatchedCategories.push(OpportunityCategory.loan_against_vehicle);
      matchedSignals.push('vehicle_registered_with_funding_requirement');
    }

    // Req 2.7: Assign primary by priority order
    let primaryCategory: OpportunityCategory = OpportunityCategory.uncategorized;
    for (const category of CATEGORY_PRIORITY) {
      if (allMatchedCategories.includes(category)) {
        primaryCategory = category;
        break;
      }
    }

    // Req 2.8: If no match, mark as "uncategorized"
    // (already default)

    this.logger.debug(
      `Opportunity detected: primary=${primaryCategory}, matched=${allMatchedCategories.length} categories, signals=${matchedSignals.length}`,
    );

    return {
      primaryCategory,
      matchedSignals,
      allMatchedCategories,
    };
  }

  /**
   * Derive signals from lead data for detection.
   * Called when a lead is captured or updated (Req 2.1 — within 5 seconds).
   */
  deriveSignalsFromLeadData(leadData: {
    existingLoanDetails?: Record<string, unknown> | null;
    loanRequirement?: string | null;
    currentRate?: number | null;
    vehicleType?: string | null;
    existingLoanStatus?: boolean;
    source?: string;
  }): LeadSignals {
    const signals: LeadSignals = {};
    const loanDetails = leadData.existingLoanDetails as Record<string, unknown> | null;

    // Derive Used Car Buyer signals
    if (leadData.loanRequirement === 'Used Car Loan') {
      signals.searchingForUsedCars = true;
    }
    if (leadData.source === 'dealer_network') {
      signals.dealerInquiry = true;
    }

    // Derive Refinance signals from existing loan data
    if (loanDetails) {
      const remainingTenure = loanDetails.remainingTenure as number;
      const originalTenure = loanDetails.originalTenure as number;
      const currentRate = loanDetails.currentRate as number || leadData.currentRate;

      if (originalTenure && remainingTenure) {
        const elapsedMonths = originalTenure - remainingTenure;
        if (elapsedMonths > 12) {
          signals.existingLoanOlderThan12Months = true;
        }
      }

      // Rate exceeds market by 200bps (best market rate ~8.5%)
      if (currentRate && currentRate > 10.5) {
        signals.rateExceedsMarketBy200bps = true;
      }

      // Has active loan
      signals.hasActiveLoan = true;

      // If rate > best available + 1% → balance transfer opportunity
      if (currentRate && currentRate > 9.5) {
        signals.availableRateLower100bps = true;
      }

      // Assume no missed payments if loan details are consistent
      if (signals.existingLoanOlderThan12Months) {
        signals.noMissedPaymentsLast12Months = true;
      }
    }

    if (leadData.existingLoanStatus) {
      signals.hasActiveLoan = true;
    }

    // Vehicle registered + funding = Loan Against Vehicle
    if (leadData.loanRequirement === 'Loan Against Car') {
      signals.vehicleRegisteredInName = true;
      signals.fundingRequirement = true;
    }

    // Top-Up from requirement
    if (leadData.loanRequirement === 'Top-Up Vehicle Loan') {
      signals.hasActiveLoan = true;
      signals.noMissedPaymentsLast12Months = true;
    }

    // Balance Transfer from requirement
    if (leadData.loanRequirement === 'Vehicle Loan Balance Transfer') {
      signals.hasActiveLoan = true;
      signals.availableRateLower100bps = true;
    }

    return signals;
  }

  /**
   * Full detection flow: derive signals → detect → persist category + signals on lead.
   */
  async evaluateAndUpdateLead(leadId: string, leadData: Record<string, unknown>): Promise<OpportunityDetectionResult> {
    const signals = this.deriveSignalsFromLeadData(leadData);
    const result = this.detectOpportunity(signals);

    // Req 2.9: Record matched signals and assigned category
    await this.repository.updateLeadOpportunity(leadId, {
      opportunityCategory: result.primaryCategory,
      matchedSignals: result.matchedSignals,
    });

    return result;
  }
}
