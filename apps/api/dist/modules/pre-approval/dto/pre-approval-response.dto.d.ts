export declare class PreApprovalBankDto {
    bankName: string;
    offeredRate: number;
    historicalApprovalRate: number;
}
export declare class PreApprovalDataDto {
    approvalProbability: number;
    confidenceLevel: string;
    confidenceMessage: string;
    topUpEligibility: number | null;
    recommendedBanks: PreApprovalBankDto[];
    disclaimer: string;
}
export declare class PreApprovalMetaDto {
    preApprovalId: string;
    sourceSessionId: string;
    responseTimeMs: number;
    timestamp: string;
}
export declare class PreApprovalResponseDto {
    success: boolean;
    data: PreApprovalDataDto;
    meta: PreApprovalMetaDto;
}
//# sourceMappingURL=pre-approval-response.dto.d.ts.map