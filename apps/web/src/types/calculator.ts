export interface BankComparison {
  bankName: string;
  offeredRate: number;
  estimatedEmi: number;
  monthlySaving: number;
  totalSaving: number;
}

export interface SavingsResult {
  monthlySaving: number;
  totalInterestSaving: number;
  topUpEligible: boolean;
  topUpAmount: number | null;
  recommendedBank: { name: string; offeredRate: number; estimatedEmi: number };
  bankComparisons: BankComparison[];
  isRateCompetitive: boolean;
  competitiveMessage: string | null;
}

export interface PreApprovalBank {
  bankName: string;
  offeredRate: number;
  historicalApprovalRate: number;
}

export interface PreApprovalResult {
  approvalProbability: number;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'SUBJECT_TO_VERIFICATION';
  confidenceMessage: string;
  topUpEligibility: number | null;
  recommendedBanks: PreApprovalBank[];
  disclaimer: string;
}

export interface LeadCaptureResult {
  leadId: string;
  existingLead: boolean;
  status: string;
  opportunityCategory: string;
  score: number;
  assignedTo: string | null;
  message: string;
}
