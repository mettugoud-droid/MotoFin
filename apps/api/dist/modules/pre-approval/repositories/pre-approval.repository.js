"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreApprovalRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
let PreApprovalRepository = class PreApprovalRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.preApprovalResult.create({
            data: {
                tenantId: DEFAULT_TENANT_ID,
                sourceType: data.sourceType,
                sourceCalculationId: data.sourceCalculationId,
                approvalProbability: data.approvalProbability,
                confidenceLevel: data.confidenceLevel,
                topUpAmount: data.topUpAmount,
                recommendedBanks: data.recommendedBanks,
            },
        });
    }
    async findBySourceCalculation(sourceCalculationId) {
        return this.prisma.preApprovalResult.findFirst({
            where: {
                sourceCalculationId,
                tenantId: DEFAULT_TENANT_ID,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.PreApprovalRepository = PreApprovalRepository;
exports.PreApprovalRepository = PreApprovalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PreApprovalRepository);
//# sourceMappingURL=pre-approval.repository.js.map