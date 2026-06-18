import { OpportunityCategory } from '@prisma/client';

/**
 * Signals that can be present on a lead for opportunity categorization
 */
export interface LeadSignals {
  // Used Car Buyer signals
  searchingForUsedCars?: boolean;
  dealerInquiry?: boolean;
  marketplaceInquiry?: boolean;

  // Refinance Opportunity signals
  existingLoanOlderThan12Months?: boolean;
  emiToIncomeRatioExceeds50?: boolean;
  rateExceedsMarketBy200bps?: boolean;

  // Balance Transfer signals
  hasActiveLoan?: boolean;
  availableRateLower100bps?: boolean;

  // Top-Up Opportunity signals
  noMissedPaymentsLast12Months?: boolean;

  // Loan Against Vehicle signals
  vehicleRegisteredInName?: boolean;
  fundingRequirement?: boolean;
}

export interface OpportunityDetectionResult {
  primaryCategory: OpportunityCategory;
  matchedSignals: string[];
  allMatchedCategories: OpportunityCategory[];
}

export interface OpportunityScoringResult {
  score: number;
  category: 'Hot' | 'Warm' | 'Cold';
  isPartial: boolean;
  factors: {
    signalStrength: number | null;
    leadCompleteness: number | null;
    recency: number | null;
    historicalPatterns: number | null;
  };
}

export interface ScoreHistoryEntry {
  previousCategory: string;
  newCategory: string;
  previousScore: number;
  newScore: number;
  timestamp: string;
}
