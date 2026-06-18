/**
 * Shared type definitions used across API and Web applications.
 */

/** Standard API success response wrapper */
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

/** Standard API error response wrapper */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
  meta: ApiMeta;
}

/** Response metadata */
export interface ApiMeta {
  timestamp: string;
  path?: string;
  requestId?: string;
  responseTimeMs?: number;
}

/** Field-level validation error */
export interface ValidationError {
  field: string;
  constraint: string;
  message: string;
  received?: unknown;
}

/** Savings calculator input */
export interface CalculateSavingsInput {
  currentEmi: number;
  outstandingAmount: number;
  currentRate: number;
  remainingTenure: number;
  originalTenure: number;
}

/** Bank comparison entry in calculator response */
export interface BankComparison {
  bankName: string;
  offeredRate: number;
  estimatedEmi: number;
  monthlySaving: number;
  totalSaving: number;
}

/** Savings calculation result */
export interface SavingsCalculationResult {
  monthlySaving: number;
  totalInterestSaving: number;
  topUpEligible: boolean;
  topUpAmount: number | null;
  recommendedBank: {
    name: string;
    offeredRate: number;
    estimatedEmi: number;
  };
  bankComparisons: BankComparison[];
  isRateCompetitive: boolean;
  competitiveMessage: string | null;
}
