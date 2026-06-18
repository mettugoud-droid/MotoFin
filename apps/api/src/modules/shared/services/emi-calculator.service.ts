import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

/**
 * EMI Calculator Service using decimal.js for exact financial arithmetic.
 * NEVER uses JavaScript floating-point math.
 *
 * EMI Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * Where:
 *   P = Principal (outstanding amount)
 *   r = Monthly interest rate (annual rate / 12 / 100)
 *   n = Number of months (remaining tenure)
 */
@Injectable()
export class EmiCalculatorService {
  /**
   * Calculate monthly EMI using reducing balance formula.
   * @param principal - Outstanding loan amount in INR
   * @param annualRate - Annual interest rate in percentage (e.g., 12.5 for 12.5%)
   * @param tenureMonths - Remaining tenure in months
   * @returns Monthly EMI rounded to 2 decimal places
   */
  calculateEmi(principal: number, annualRate: number, tenureMonths: number): Decimal {
    const P = new Decimal(principal);
    const annualRateDecimal = new Decimal(annualRate);
    const n = new Decimal(tenureMonths);

    // Monthly rate: annual rate / 12 / 100
    const r = annualRateDecimal.div(12).div(100);

    // If rate is 0, EMI is simply principal / tenure
    if (r.isZero()) {
      return P.div(n).toDecimalPlaces(2);
    }

    // (1 + r)^n
    const onePlusR = r.plus(1);
    const onePlusRPowN = onePlusR.pow(n);

    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const numerator = P.mul(r).mul(onePlusRPowN);
    const denominator = onePlusRPowN.minus(1);

    return numerator.div(denominator).toDecimalPlaces(2);
  }

  /**
   * Calculate total interest payable over the remaining tenure.
   * Total Interest = (EMI × tenure) - Principal
   */
  calculateTotalInterest(emi: Decimal, tenureMonths: number, principal: number): Decimal {
    const totalPayment = emi.mul(tenureMonths);
    const P = new Decimal(principal);
    return totalPayment.minus(P).toDecimalPlaces(2);
  }

  /**
   * Calculate monthly saving between current EMI and new EMI.
   */
  calculateMonthlySaving(currentEmi: number, newEmi: Decimal): Decimal {
    return new Decimal(currentEmi).minus(newEmi).toDecimalPlaces(2);
  }

  /**
   * Calculate total interest saving over remaining tenure.
   */
  calculateTotalInterestSaving(
    currentTotalInterest: Decimal,
    newTotalInterest: Decimal,
  ): Decimal {
    return currentTotalInterest.minus(newTotalInterest).toDecimalPlaces(2);
  }
}
