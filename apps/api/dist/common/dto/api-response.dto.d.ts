export declare class ApiMetaDto {
    timestamp: string;
    path?: string;
    method?: string;
    responseTimeMs?: number;
    requestId?: string;
}
export declare class ApiSuccessResponseDto<T> {
    success: true;
    data: T;
    meta: ApiMetaDto;
}
export declare class ApiErrorDetailDto {
    field: string;
    constraint: string;
    message: string;
}
export declare class ApiErrorBodyDto {
    code: string;
    message: string;
    details?: ApiErrorDetailDto[];
}
export declare class ApiErrorResponseDto {
    success: false;
    error: ApiErrorBodyDto;
    meta: ApiMetaDto;
}
//# sourceMappingURL=api-response.dto.d.ts.map