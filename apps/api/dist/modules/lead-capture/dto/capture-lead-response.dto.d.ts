export declare class CaptureLeadDataDto {
    leadId: string;
    existingLead: boolean;
    status: string;
    opportunityCategory: string;
    score: number;
    assignedTo: string | null;
    message: string;
}
export declare class CaptureLeadMetaDto {
    timestamp: string;
    source: string;
}
export declare class CaptureLeadResponseDto {
    success: boolean;
    data: CaptureLeadDataDto;
    meta: CaptureLeadMetaDto;
}
//# sourceMappingURL=capture-lead-response.dto.d.ts.map