import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface BankRateInfo {
  bankId: string;
  bankName: string;
  bankCode: string;
  interestRateMin: number;
  interestRateMax: number;
  minLoanAmount: number | null;
  maxLoanAmount: number | null;
  historicalApprovalRate: number;
}

@Injectable()
export class BankRatesService {
  private readonly logger = new Logger(BankRatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get active refinance rates from all bank partners.
   * Returns banks sorted by interest_rate_min ascending.
   * Filters by loan amount eligibility if provided.
   */
  async getActiveRefinanceRates(loanAmount?: number): Promise<BankRateInfo[]> {
    const rules = await this.prisma.bankRule.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        loanProductCode: 'refinance_loan',
        isActive: true,
        deletedAt: null,
        bank: {
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        bank: true,
      },
      orderBy: {
        interestRateMin: 'asc',
      },
    });

    const results: BankRateInfo[] = [];

    for (const rule of rules) {
      // Filter by loan amount if provided
      if (loanAmount) {
        const minLoan = rule.minLoanAmount ? Number(rule.minLoanAmount) : 0;
        const maxLoan = rule.maxLoanAmount ? Number(rule.maxLoanAmount) : Infinity;
        if (loanAmount < minLoan || loanAmount > maxLoan) {
          continue;
        }
      }

      results.push({
        bankId: rule.bankId,
        bankName: rule.bank.name,
        bankCode: rule.bank.code,
        interestRateMin: rule.interestRateMin ? Number(rule.interestRateMin) : 0,
        interestRateMax: rule.interestRateMax ? Number(rule.interestRateMax) : 0,
        minLoanAmount: rule.minLoanAmount ? Number(rule.minLoanAmount) : null,
        maxLoanAmount: rule.maxLoanAmount ? Number(rule.maxLoanAmount) : null,
        historicalApprovalRate: Number(rule.historicalApprovalRate),
      });
    }

    // Sort by rate ascending, ties broken alphabetically
    results.sort((a, b) => {
      if (a.interestRateMin !== b.interestRateMin) {
        return a.interestRateMin - b.interestRateMin;
      }
      return a.bankName.localeCompare(b.bankName);
    });

    return results;
  }
}
