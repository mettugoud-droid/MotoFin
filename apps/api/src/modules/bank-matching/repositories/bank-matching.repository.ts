import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface BankRuleRecord {
  bankId: string;
  bankName: string;
  bankCode: string;
  minCreditScore: number | null;
  maxVehicleAgeMonths: number | null;
  minMonthlyIncome: number | null;
  acceptedEmploymentTypes: string[];
  serviceableCities: string[];
  minLoanAmount: number | null;
  maxLoanAmount: number | null;
  interestRateMin: number | null;
  interestRateMax: number | null;
  historicalApprovalRate: number;
}

@Injectable()
export class BankMatchingRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active bank rules for a given loan product.
   */
  async getActiveBankRules(loanProductCode: string): Promise<BankRuleRecord[]> {
    const rules = await this.prisma.bankRule.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        loanProductCode,
        isActive: true,
        deletedAt: null,
        bank: { isActive: true, deletedAt: null },
      },
      include: { bank: true },
      orderBy: { interestRateMin: 'asc' },
    });

    return rules.map((rule) => ({
      bankId: rule.bankId,
      bankName: rule.bank.name,
      bankCode: rule.bank.code,
      minCreditScore: rule.minCreditScore,
      maxVehicleAgeMonths: rule.maxVehicleAgeMonths,
      minMonthlyIncome: rule.minMonthlyIncome ? Number(rule.minMonthlyIncome) : null,
      acceptedEmploymentTypes: rule.acceptedEmploymentTypes,
      serviceableCities: rule.serviceableCities,
      minLoanAmount: rule.minLoanAmount ? Number(rule.minLoanAmount) : null,
      maxLoanAmount: rule.maxLoanAmount ? Number(rule.maxLoanAmount) : null,
      interestRateMin: rule.interestRateMin ? Number(rule.interestRateMin) : null,
      interestRateMax: rule.interestRateMax ? Number(rule.interestRateMax) : null,
      historicalApprovalRate: Number(rule.historicalApprovalRate),
    }));
  }

  /**
   * Flag lead for manual review.
   */
  async flagLeadForManualReview(leadId: string, reason: string): Promise<void> {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return;

    const signals = (lead.matchedSignals as any[]) || [];
    signals.push({ type: 'manual_review_flag', reason, timestamp: new Date().toISOString() });

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { matchedSignals: signals as any },
    });
  }
}
