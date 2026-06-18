import Decimal from 'decimal.js';
export declare class EmiCalculatorService {
    calculateEmi(principal: number, annualRate: number, tenureMonths: number): Decimal;
    calculateTotalInterest(emi: Decimal, tenureMonths: number, principal: number): Decimal;
    calculateMonthlySaving(currentEmi: number, newEmi: Decimal): Decimal;
    calculateTotalInterestSaving(currentTotalInterest: Decimal, newTotalInterest: Decimal): Decimal;
}
//# sourceMappingURL=emi-calculator.service.d.ts.map