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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PreApprovalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreApprovalService = void 0;
const common_1 = require("@nestjs/common");
const decimal_js_1 = __importDefault(require("decimal.js"));
const savings_calculation_repository_1 = require("../savings-calculator/repositories/savings-calculation.repository");
const bank_rates_service_1 = require("../shared/services/bank-rates.service");
const vehicle_valuation_service_1 = require("../shared/services/vehicle-valuation.service");
const emi_calculator_service_1 = require("../shared/services/emi-calculator.service");
const pre_approval_repository_1 = require("./repositories/pre-approval.repository");
const DISCLAIMER = 'This is an indicative estimate based on the information provided. Final approval is subject to document verification and bank assessment.';
let PreApprovalService = PreApprovalService_1 = class PreApprovalService {
    savingsCalcRepository;
    bankRatesService;
    vehicleValuation;
    emiCalculator;
    preApprovalRepository;
    logger = new common_1.Logger(PreApprovalService_1.name);
    constructor(savingsCalcRepository, bankRatesService, vehicleValuation, emiCalculator, preApprovalRepository) {
        this.savingsCalcRepository = savingsCalcRepository;
        this.bankRatesService = bankRatesService;
        this.vehicleValuation = vehicleValuation;
        this.emiCalculator = emiCalculator;
        this.preApprovalRepository = preApprovalRepository;
    }
    async calculatePreApproval(dto) {
        const startTime = Date.now();
        const savingsData = await this.savingsCalcRepository.findBySessionId(dto.sessionId);
        if (!savingsData) {
            throw new common_1.NotFoundException('Calculation not found for the provided session ID');
        }
        const bankRates = await this.bankRatesService.getActiveRefinanceRates(Number(savingsData.outstandingAmount));
        const approvalProbability = this.calculateApprovalProbability(savingsData, bankRates);
        const confidenceLevel = this.getConfidenceLevel(approvalProbability);
        const confidenceMessage = this.getConfidenceMessage(confidenceLevel);
        const recommendedBanks = this.getRecommendedBanks(bankRates, confidenceLevel);
        const topUpEligibility = this.calculateTopUpAmount(Number(savingsData.outstandingAmount), savingsData.originalTenure, savingsData.remainingTenure);
        const data = {
            approvalProbability: Math.round(approvalProbability * 10) / 10,
            confidenceLevel,
            confidenceMessage,
            topUpEligibility,
            recommendedBanks,
            disclaimer: DISCLAIMER,
        };
        const responseTimeMs = Date.now() - startTime;
        const saved = await this.preApprovalRepository.create({
            sourceType: 'savings_calculator',
            sourceCalculationId: savingsData.id,
            approvalProbability: data.approvalProbability,
            confidenceLevel: confidenceLevel.toLowerCase(),
            topUpAmount: topUpEligibility,
            recommendedBanks: recommendedBanks,
        });
        this.logger.log(`Pre-approval calculated: probability=${data.approvalProbability}%, confidence=${confidenceLevel}, banks=${recommendedBanks.length} [${responseTimeMs}ms]`);
        return {
            data,
            preApprovalId: saved.id,
            responseTimeMs,
        };
    }
    calculateApprovalProbability(savingsData, bankRates) {
        const elapsedMonths = savingsData.originalTenure - savingsData.remainingTenure;
        const repaymentFactor = this.calculateRepaymentFactor(elapsedMonths, savingsData.originalTenure);
        const outstandingAmount = Number(savingsData.outstandingAmount);
        const vehicleValue = this.vehicleValuation.estimateCurrentVehicleValue(outstandingAmount, savingsData.originalTenure, savingsData.remainingTenure);
        const ltv = this.vehicleValuation.calculateLtv(outstandingAmount, vehicleValue);
        const ltvFactor = new decimal_js_1.default(1).minus(ltv).mul(100).toNumber();
        const normalizedLtvFactor = Math.max(0, Math.min(100, ltvFactor));
        const currentEmi = Number(savingsData.currentEmi);
        const bestRate = bankRates.length > 0 ? bankRates[0].interestRateMin : Number(savingsData.currentRate);
        const newEmi = this.emiCalculator.calculateEmi(outstandingAmount, bestRate, savingsData.remainingTenure);
        const incomeFactor = Math.min(100, new decimal_js_1.default(currentEmi).div(newEmi).mul(50).toNumber());
        const historyFactor = bankRates.length > 0
            ? bankRates.slice(0, 3).reduce((sum, b) => sum + b.historicalApprovalRate, 0) / Math.min(3, bankRates.length)
            : 50;
        const probability = repaymentFactor * 0.40 +
            normalizedLtvFactor * 0.25 +
            incomeFactor * 0.20 +
            historyFactor * 0.15;
        return Math.max(0, Math.min(100, probability));
    }
    calculateRepaymentFactor(elapsedMonths, originalTenure) {
        if (elapsedMonths <= 0)
            return 30;
        const tenureCompletionRatio = elapsedMonths / originalTenure;
        if (tenureCompletionRatio >= 0.5)
            return 95;
        if (tenureCompletionRatio >= 0.3)
            return 80;
        if (tenureCompletionRatio >= 0.2)
            return 65;
        return 50;
    }
    getConfidenceLevel(probability) {
        if (probability >= 70)
            return 'HIGH';
        if (probability >= 40)
            return 'MODERATE';
        return 'SUBJECT_TO_VERIFICATION';
    }
    getConfidenceMessage(level) {
        switch (level) {
            case 'HIGH':
                return 'High Chance of Approval — Based on your loan profile, you have a strong probability of approval.';
            case 'MODERATE':
                return 'Moderate Chance of Approval — Submitting documents will improve the accuracy of this estimate.';
            case 'SUBJECT_TO_VERIFICATION':
                return 'Subject to Document Verification — We recommend submitting your details for a personalized assessment.';
            default:
                return 'Assessment pending further information.';
        }
    }
    getRecommendedBanks(bankRates, confidenceLevel) {
        if (confidenceLevel === 'SUBJECT_TO_VERIFICATION') {
            return [];
        }
        return bankRates.slice(0, 3).map((bank) => ({
            bankName: bank.bankName,
            offeredRate: bank.interestRateMin,
            historicalApprovalRate: bank.historicalApprovalRate,
        }));
    }
    calculateTopUpAmount(outstandingAmount, originalTenure, remainingTenure) {
        const result = this.vehicleValuation.checkTopUpEligibility(outstandingAmount, originalTenure, remainingTenure);
        return result.eligible ? result.amount : null;
    }
};
exports.PreApprovalService = PreApprovalService;
exports.PreApprovalService = PreApprovalService = PreApprovalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [savings_calculation_repository_1.SavingsCalculationRepository,
        bank_rates_service_1.BankRatesService,
        vehicle_valuation_service_1.VehicleValuationService,
        emi_calculator_service_1.EmiCalculatorService,
        pre_approval_repository_1.PreApprovalRepository])
], PreApprovalService);
//# sourceMappingURL=pre-approval.service.js.map