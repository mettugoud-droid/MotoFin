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
exports.SavingsCalculationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
let SavingsCalculationRepository = class SavingsCalculationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async findById(id) {
        return this.prisma.savingsCalculation.findUnique({
            where: { id },
        });
    }
    async findBySessionId(sessionId) {
        return this.prisma.savingsCalculation.findFirst({
            where: {
                sessionId,
                tenantId: DEFAULT_TENANT_ID,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markLeadCaptured(id, leadId) {
        return this.prisma.savingsCalculation.update({
            where: { id },
            data: { leadCaptured: true, leadId },
        });
    }
};
exports.SavingsCalculationRepository = SavingsCalculationRepository;
exports.SavingsCalculationRepository = SavingsCalculationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavingsCalculationRepository);
//# sourceMappingURL=savings-calculation.repository.js.map