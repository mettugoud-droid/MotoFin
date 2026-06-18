import Decimal from 'decimal.js';
export declare class VehicleValuationService {
    private static readonly LTV_AT_ORIGINATION;
    private static readonly ANNUAL_DEPRECIATION_RATE;
    private static readonly MAX_LTV_FOR_TOPUP;
    private static readonly REPAYMENT_VARIANCE_THRESHOLD;
    private static readonly MIN_TOPUP_AMOUNT;
    estimateCurrentVehicleValue(outstandingAmount: number, originalTenure: number, remainingTenure: number): Decimal;
    calculateLtv(outstandingAmount: number, vehicleValue: Decimal): Decimal;
    checkTopUpEligibility(outstandingAmount: number, originalTenure: number, remainingTenure: number): {
        eligible: boolean;
        amount: number | null;
    };
}
//# sourceMappingURL=vehicle-valuation.service.d.ts.map