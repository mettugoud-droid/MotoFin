import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface CreateForeclosureCalculationData {
  sessionId: string;
  currentBank: string;
  currentEmi: number;
  loanStartDate: Date;
  outstandingAmount: number;
  currentRate: number;
  foreclosureAmount: number | null;
  preclosureCharges: number | null;
  netSavings: number | null;
  takeoverEligible: boolean | null;
  bestRefinanceBank: string | null;
  responseTimeMs: number;
}

@Injectable()
export class ForeclosureCalculationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateForeclosureCalculationData) {
    return this.prisma.foreclosureCalculation.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        sessionId: data.sessionId,
        currentBank: data.currentBank,
        currentEmi: data.currentEmi,
        loanStartDate: data.loanStartDate,
        outstandingAmount: data.outstandingAmount,
        currentRate: data.currentRate,
        foreclosureAmount: data.foreclosureAmount,
        preclosureCharges: data.preclosureCharges,
        netSavings: data.netSavings,
        takeoverEligible: data.takeoverEligible,
        bestRefinanceBank: data.bestRefinanceBank,
        responseTimeMs: data.responseTimeMs,
      },
    });
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.foreclosureCalculation.findFirst({
      where: {
        sessionId,
        tenantId: DEFAULT_TENANT_ID,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markLeadCaptured(id: string, leadId: string) {
    return this.prisma.foreclosureCalculation.update({
      where: { id },
      data: { leadCaptured: true, leadId },
    });
  }
}
