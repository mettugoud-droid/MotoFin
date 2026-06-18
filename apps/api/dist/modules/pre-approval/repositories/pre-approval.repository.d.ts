import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface CreatePreApprovalData {
    sourceType: string;
    sourceCalculationId: string;
    approvalProbability: number;
    confidenceLevel: string;
    topUpAmount: number | null;
    recommendedBanks: Prisma.InputJsonValue;
}
export declare class PreApprovalRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePreApprovalData): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        topUpAmount: Prisma.Decimal | null;
        sourceType: string;
        sourceCalculationId: string;
        approvalProbability: Prisma.Decimal;
        confidenceLevel: import(".prisma/client").$Enums.ConfidenceLevel;
        recommendedBanks: Prisma.JsonValue;
    }>;
    findBySourceCalculation(sourceCalculationId: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        topUpAmount: Prisma.Decimal | null;
        sourceType: string;
        sourceCalculationId: string;
        approvalProbability: Prisma.Decimal;
        confidenceLevel: import(".prisma/client").$Enums.ConfidenceLevel;
        recommendedBanks: Prisma.JsonValue;
    } | null>;
}
//# sourceMappingURL=pre-approval.repository.d.ts.map