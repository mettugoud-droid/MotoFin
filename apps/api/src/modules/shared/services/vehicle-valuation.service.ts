import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

/**
 * Vehicle Valuation Service for Top-Up eligibility calculations.
 * Uses 80% LTV assumption at origination + 15% annual straight-line depreciation.
 */
@Injectable()
export class VehicleValuationService {
  private static readonly LTV_AT_ORIGINATION = 0.80;
  private static readonly ANNUAL_DEPRECIATION_RATE = 0.15;
  private static readonly MAX_LTV_FOR_TOPUP = 0.80;
  private static readonly REPAYMENT_VARIANCE_THRESHOLD = 0.20;
  private static readonly MIN_TOPUP_AMOUNT = 25000;

  /**
   * Estimate current vehicle value based on depreciation.
   * Original Vehicle Value = Original Loan Amount / 0.80 (LTV assumption)
   * Current Value = Original Value × (1 - 0.15 × elapsed_years)
   */
  estimateCurrentVehicleValue(
    outstandingAmount: number,
    originalTenure: number,
    remainingTenure: number,
  ): Decimal {
    const elapsedMonths = originalTenure - remainingTenure;
    const elapsedYears = new Decimal(elapsedMonths).div(12);

    // Estimate original loan amount from outstanding + assumed amortization
    // Simplified: use outstanding as proxy (conservative estimate)
    const estimatedOriginalLoan = new Decimal(outstandingAmount).mul(
      new Decimal(originalTenure).div(remainingTenure),
    );

    // Original vehicle value = loan / LTV
    const originalVehicleValue = estimatedOriginalLoan.div(VehicleValuationService.LTV_AT_ORIGINATION);

    // Apply depreciation
    const depreciationFactor = new Decimal(1).minus(
      new Decimal(VehicleValuationService.ANNUAL_DEPRECIATION_RATE).mul(elapsedYears),
    );

    // Ensure depreciation factor doesn't go below 0.1 (minimum 10% residual value)
    const adjustedFactor = Decimal.max(depreciationFactor, new Decimal(0.1));

    return originalVehicleValue.mul(adjustedFactor).toDecimalPlaces(2);
  }

  /**
   * Calculate Loan-to-Value ratio.
   */
  calculateLtv(outstandingAmount: number, vehicleValue: Decimal): Decimal {
    return new Decimal(outstandingAmount).div(vehicleValue).toDecimalPlaces(4);
  }

  /**
   * Check top-up eligibility.
   * Eligible if: LTV < 80% AND repayment variance ≤ 20%
   * Top-up amount = (Vehicle Value × 0.80) - Outstanding
   */
  checkTopUpEligibility(
    outstandingAmount: number,
    originalTenure: number,
    remainingTenure: number,
  ): { eligible: boolean; amount: number | null } {
    const vehicleValue = this.estimateCurrentVehicleValue(
      outstandingAmount,
      originalTenure,
      remainingTenure,
    );

    const ltv = this.calculateLtv(outstandingAmount, vehicleValue);

    // Check LTV threshold
    if (ltv.gte(VehicleValuationService.MAX_LTV_FOR_TOPUP)) {
      return { eligible: false, amount: null };
    }

    // Check repayment variance (simplified: if LTV is reasonable, assume good repayment)
    const elapsedMonths = originalTenure - remainingTenure;
    if (elapsedMonths < 12) {
      return { eligible: false, amount: null };
    }

    // Calculate top-up amount
    const maxLoanOnVehicle = vehicleValue.mul(VehicleValuationService.MAX_LTV_FOR_TOPUP);
    const topUpAmount = maxLoanOnVehicle.minus(new Decimal(outstandingAmount)).toDecimalPlaces(2);

    // Must exceed minimum threshold
    if (topUpAmount.lt(VehicleValuationService.MIN_TOPUP_AMOUNT)) {
      return { eligible: false, amount: null };
    }

    return { eligible: true, amount: topUpAmount.toNumber() };
  }
}
