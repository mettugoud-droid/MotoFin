export declare class BankComparisonDto {
    bankName: string;
    offeredRate: number;
    estimatedEmi: number;
    monthlySaving: number;
    totalSaving: number;
}
export declare class RecommendedBankDto {
    name: string;
    offeredRate: number;
    estimatedEmi: number;
}
export declare class SavingsCalculationDataDto {
    monthlySaving: number;
    totalInterestSaving: number;
    topUpEligible: boolean;
    topUpAmount: number | null;
    recommendedBank: RecommendedBankDto;
    bankComparisons: BankComparisonDto[];
    isRateCompetitive: boolean;
    competitiveMessage: string | null;
}
export declare class SavingsMetaDto {
    calculationId: string;
    responseTimeMs: number;
    timestamp: string;
}
export declare class SavingsCalculationResponseDto {
    success: boolean;
    data: SavingsCalculationDataDto;
    meta: SavingsMetaDto;
}
//# sourceMappingURL=savings-response.dto.d.ts.map