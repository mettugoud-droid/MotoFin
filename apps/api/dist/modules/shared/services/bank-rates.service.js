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
var BankRatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
let BankRatesService = BankRatesService_1 = class BankRatesService {
    prisma;
    logger = new common_1.Logger(BankRatesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveRefinanceRates(loanAmount) {
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
        const results = [];
        for (const rule of rules) {
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
        results.sort((a, b) => {
            if (a.interestRateMin !== b.interestRateMin) {
                return a.interestRateMin - b.interestRateMin;
            }
            return a.bankName.localeCompare(b.bankName);
        });
        return results;
    }
};
exports.BankRatesService = BankRatesService;
exports.BankRatesService = BankRatesService = BankRatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BankRatesService);
//# sourceMappingURL=bank-rates.service.js.map