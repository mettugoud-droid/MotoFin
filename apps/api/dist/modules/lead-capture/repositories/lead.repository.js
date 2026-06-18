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
var LeadRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
let LeadRepository = LeadRepository_1 = class LeadRepository {
    prisma;
    logger = new common_1.Logger(LeadRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByMobile(mobile) {
        return this.prisma.lead.findFirst({
            where: {
                tenantId: DEFAULT_TENANT_ID,
                customerMobile: mobile,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        return this.prisma.lead.create({
            data: {
                tenantId: DEFAULT_TENANT_ID,
                customerName: data.customerName,
                customerMobile: data.customerMobile,
                customerCity: data.customerCity,
                leadSourceId: data.leadSourceId,
                assignedTo: data.assignedTo,
                status: data.status,
                opportunityCategory: data.opportunityCategory,
                opportunityScore: data.opportunityScore,
                existingLoanDetails: data.existingLoanDetails,
                requestedLoanAmount: data.requestedLoanAmount,
                sourceTimestamp: new Date(),
                assignedAt: data.assignedTo ? new Date() : null,
                utmSource: data.utmSource,
                utmMedium: data.utmMedium,
                utmCampaign: data.utmCampaign,
                utmContent: data.utmContent,
                utmTerm: data.utmTerm,
            },
        });
    }
    async updateLastInteraction(id) {
        return this.prisma.lead.update({
            where: { id },
            data: { lastInteractionAt: new Date() },
        });
    }
    async getLeadSourceByType(type) {
        return this.prisma.leadSource.findFirst({
            where: {
                tenantId: DEFAULT_TENANT_ID,
                type: type,
                isActive: true,
                deletedAt: null,
            },
        });
    }
    async getFirstActiveExecutive() {
        return this.prisma.user.findFirst({
            where: {
                tenantId: DEFAULT_TENANT_ID,
                isActive: true,
                deletedAt: null,
                role: {
                    name: 'Sales Executive',
                    deletedAt: null,
                },
            },
            orderBy: { lastAssignmentAt: 'asc' },
        });
    }
};
exports.LeadRepository = LeadRepository;
exports.LeadRepository = LeadRepository = LeadRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadRepository);
//# sourceMappingURL=lead.repository.js.map