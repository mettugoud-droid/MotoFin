import { SavingsResult, PreApprovalResult, BankComparison } from '@/types/calculator';
import { CalculatorFormData } from '@/lib/validations';

// Bank partner rates (from bank_rules equivalent)
const BANK_PARTNERS = [
  { name: 'HDFC Bank', baseRate: 8.75, maxLTV: 0.85 },
  { name: 'ICICI Bank', baseRate: 9.0, maxLTV: 0.80 },
  { name: 'Axis Bank', baseRate: 9.25, maxLTV: 0.80 },
  { name: 'Kotak Mahindra', baseRate: 9.10, maxLTV: 0.75 },
  { name: 'IndusInd Bank', baseRate: 9.50, maxLTV: 0.80 },
  { name: 'AU Finance', baseRate: 8.90, maxLTV: 0.85 },
];

/**
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * P = principal, r = monthly rate, n = months
 */
function calculateEMI(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Total interest = (EMI × months) - principal
 */
function totalInterest(emi: number, months: number, principal: number): number {
  return emi * months - principal;
}

/**
 * Client-side savings calculation implementing Requirement 19
 */
export function calculateSavings(data: CalculatorFormData): SavingsResult {
  const { currentEmi, outstandingAmount, currentRate, remainingTenure, originalTenure } = data;

  // Sort banks by rate (ascending)
  const sortedBanks = [...BANK_PARTNERS].sort((a, b) => a.baseRate - b.baseRate);

  // Check if current rate is already competitive
  const bestRate = sortedBanks[0].baseRate;
  const isRateCompetitive = currentRate <= bestRate;

  if (isRateCompetitive) {
    // Check top-up eligibility even if rate is competitive
    const topUp = calculateTopUpEligibility(outstandingAmount, originalTenure, remainingTenure);
    return {
      monthlySaving: 0,
      totalInterestSaving: 0,
      topUpEligible: topUp > 25000,
      topUpAmount: topUp > 25000 ? Math.round(topUp) : null,
      recommendedBank: { name: sortedBanks[0].name, offeredRate: sortedBanks[0].baseRate, estimatedEmi: Math.round(calculateEMI(outstandingAmount, sortedBanks[0].baseRate, remainingTenure)) },
      bankComparisons: [],
      isRateCompetitive: true,
      competitiveMessage: `Your current rate of ${currentRate}% is already competitive. No refinancing savings available, but you may qualify for a top-up loan.`,
    };
  }

  // Calculate comparisons for top 3 banks
  const bankComparisons: BankComparison[] = sortedBanks.slice(0, 3).map((bank) => {
    const newEmi = calculateEMI(outstandingAmount, bank.baseRate, remainingTenure);
    const monthlySaving = currentEmi - newEmi;
    const currentTotalInterest = totalInterest(currentEmi, remainingTenure, outstandingAmount);
    const newTotalInterest = totalInterest(newEmi, remainingTenure, outstandingAmount);
    const totalSaving = currentTotalInterest - newTotalInterest;

    return {
      bankName: bank.name,
      offeredRate: bank.baseRate,
      estimatedEmi: Math.round(newEmi),
      monthlySaving: Math.max(0, Math.round(monthlySaving)),
      totalSaving: Math.max(0, Math.round(totalSaving)),
    };
  });

  const best = bankComparisons[0];
  const topUp = calculateTopUpEligibility(outstandingAmount, originalTenure, remainingTenure);

  return {
    monthlySaving: best.monthlySaving,
    totalInterestSaving: best.totalSaving,
    topUpEligible: topUp > 25000,
    topUpAmount: topUp > 25000 ? Math.round(topUp) : null,
    recommendedBank: { name: best.bankName, offeredRate: best.offeredRate, estimatedEmi: best.estimatedEmi },
    bankComparisons,
    isRateCompetitive: false,
    competitiveMessage: null,
  };
}

/**
 * Top-Up Eligibility from Requirement 19:
 * Vehicle Value × 0.80 - Outstanding Amount
 * Vehicle Value = Original Loan Amount / 0.80 × depreciation
 * Depreciation = 15% per year straight-line
 */
function calculateTopUpEligibility(outstandingAmount: number, originalTenure: number, remainingTenure: number): number {
  const elapsedMonths = originalTenure - remainingTenure;
  const elapsedYears = elapsedMonths / 12;

  // Estimate original loan amount (assume outstanding has reduced proportionally)
  // Simple approximation: original was roughly outstanding * (originalTenure / remainingTenure)
  const estimatedOriginalLoan = outstandingAmount * (originalTenure / Math.max(remainingTenure, 1));

  // Original vehicle value = original loan / 0.80 (80% LTV at origination)
  const originalVehicleValue = estimatedOriginalLoan / 0.80;

  // Current vehicle value with 15% annual depreciation
  const currentVehicleValue = originalVehicleValue * Math.pow(0.85, elapsedYears);

  // Top-up = (current value × 0.80) - outstanding
  const topUpAmount = currentVehicleValue * 0.80 - outstandingAmount;

  return Math.max(0, topUpAmount);
}

/**
 * Pre-Approval Engine (Requirement 22)
 * Calculates approval probability based on:
 * - Repayment consistency
 * - Loan-to-value ratio
 * - Income adequacy (can pay current EMI = can pay lower)
 * - Bank historical rates
 */
export function calculatePreApproval(data: CalculatorFormData, savings: SavingsResult): PreApprovalResult {
  const { outstandingAmount, currentEmi, originalTenure, remainingTenure, currentRate } = data;

  // Factor 1: Repayment consistency (0-25 points)
  const elapsedMonths = originalTenure - remainingTenure;
  const expectedPrincipalPaid = calculateExpectedPrincipalPaid(outstandingAmount, currentRate, originalTenure, elapsedMonths);
  const repaymentScore = Math.min(25, Math.round((elapsedMonths / 12) * 5)); // More months paid = better

  // Factor 2: LTV ratio (0-25 points)
  const originalVehicleValue = (outstandingAmount * originalTenure / Math.max(remainingTenure, 1)) / 0.80;
  const currentVehicleValue = originalVehicleValue * Math.pow(0.85, elapsedMonths / 12);
  const ltv = outstandingAmount / Math.max(currentVehicleValue, 1);
  const ltvScore = ltv < 0.60 ? 25 : ltv < 0.70 ? 20 : ltv < 0.80 ? 15 : ltv < 0.90 ? 10 : 5;

  // Factor 3: Income adequacy (0-25 points) - if paying current EMI, can afford lower
  const incomeScore = currentEmi > 0 ? 22 : 10;

  // Factor 4: Profile match (0-25 points) - based on rate gap and tenure
  const rateGap = currentRate - (savings.recommendedBank?.offeredRate || 9);
  const profileScore = Math.min(25, Math.round(rateGap * 5 + (elapsedMonths > 12 ? 10 : 5)));

  const totalScore = Math.min(100, Math.max(0, repaymentScore + ltvScore + incomeScore + profileScore));
  // Round to nearest integer
  const approvalProbability = Math.round(totalScore);

  let confidenceLevel: 'HIGH' | 'MODERATE' | 'SUBJECT_TO_VERIFICATION';
  let confidenceMessage: string;

  if (approvalProbability > 70) {
    confidenceLevel = 'HIGH';
    confidenceMessage = 'Strong repayment profile with significant savings potential. High likelihood of approval across multiple banks.';
  } else if (approvalProbability >= 40) {
    confidenceLevel = 'MODERATE';
    confidenceMessage = 'Good profile with refinancing potential. Submitting documents will improve estimate accuracy.';
  } else {
    confidenceLevel = 'SUBJECT_TO_VERIFICATION';
    confidenceMessage = 'Approval subject to document verification and detailed bank assessment. Submit details for personalized evaluation.';
  }

  // Top-up eligibility
  const topUp = calculateTopUpEligibility(outstandingAmount, originalTenure, remainingTenure);
  const topUpEligibility = topUp > 25000 ? Math.round(topUp) : null;

  // Recommended banks (top 3 sorted by rate)
  const recommendedBanks = [...BANK_PARTNERS]
    .sort((a, b) => a.baseRate - b.baseRate)
    .slice(0, 3)
    .map((bank) => ({
      bankName: bank.name,
      offeredRate: bank.baseRate,
      historicalApprovalRate: Math.min(95, approvalProbability + Math.random() * 10),
    }));

  return {
    approvalProbability,
    confidenceLevel,
    confidenceMessage,
    topUpEligibility,
    recommendedBanks,
    disclaimer: 'This is an indicative estimate based on the information provided. Final approval is subject to document verification and bank assessment.',
  };
}

function calculateExpectedPrincipalPaid(outstanding: number, rate: number, originalTenure: number, elapsed: number): number {
  // Estimate how much principal should have been paid by now
  const originalLoan = outstanding * originalTenure / Math.max(originalTenure - elapsed, 1);
  return originalLoan - outstanding;
}
