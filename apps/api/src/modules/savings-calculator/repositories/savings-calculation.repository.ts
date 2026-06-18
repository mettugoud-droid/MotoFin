import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface CreateSavingsCalculationData {
  sessionId: string;
  currentEmi: number;
  outstandingAmount: number;
  currentRate: number;
  remainingTenure: number;
  originalTenure: number;
  monthlySaving: number | null;
  totalInterestSaving: number | null;
  topUpEligible: boolean | null;
  topUpAmount: number | null;
  recommendedBank: string | null;
  bankComparisons: Prisma.InputJsonValue;
  responseTimeMs: number;
}

@Injectable()
export class SavingsCalculationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSavingsCalculationData) {
    return this.prisma.savingsCalculation.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        sessionId: data.sessionId,
        currentEmi: data.currentEmi,
        outstandingAmount: data.outstandingAmount,
        currentRate: data.currentRate,
        remainingTenure: data.remainingTenure,
        originalTenure: data.originalTenure,
        monthlySaving: data.monthlySaving,
        totalInterestSaving: data.totalInterestSaving,
        topUpEligible: data.topUpEligible,
        topUpAmount: data.topUpAmount,
        recommendedBank: data.recommendedBank,
        bankComparisons: data.bankComparisons,
        responseTimeMs: data.responseTimeMs,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.savingsCalculation.findUnique({
      where: { id },
    });
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.savingsCalculation.findFirst({
      where: {
        sessionId,
        tenantId: DEFAULT_TENANT_ID,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markLeadCaptured(id: string, leadId: string) {
    return this.prisma.savingsCalculation.update({
      where: { id },
      data: { leadCaptured: true, leadId },
    });
  }
}
