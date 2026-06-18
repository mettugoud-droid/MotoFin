import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface CreatePreApprovalData {
  sourceType: string;
  sourceCalculationId: string;
  approvalProbability: number;
  confidenceLevel: string;
  topUpAmount: number | null;
  recommendedBanks: Prisma.InputJsonValue;
}

@Injectable()
export class PreApprovalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePreApprovalData) {
    return this.prisma.preApprovalResult.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        sourceType: data.sourceType,
        sourceCalculationId: data.sourceCalculationId,
        approvalProbability: data.approvalProbability,
        confidenceLevel: data.confidenceLevel as 'high' | 'moderate' | 'subject_to_verification',
        topUpAmount: data.topUpAmount,
        recommendedBanks: data.recommendedBanks,
      },
    });
  }

  async findBySourceCalculation(sourceCalculationId: string) {
    return this.prisma.preApprovalResult.findFirst({
      where: {
        sourceCalculationId,
        tenantId: DEFAULT_TENANT_ID,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
