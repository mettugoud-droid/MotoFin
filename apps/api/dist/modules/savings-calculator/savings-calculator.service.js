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
var SavingsCalculatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const decimal_js_1 = __importDefault(require("decimal.js"));
const emi_calculator_service_1 = require("../shared/services/emi-calculator.service");
const bank_rates_service_1 = require("../shared/services/bank-rates.service");
const vehicle_valuation_service_1 = require("../shared/services/vehicle-valuation.service");
const savings_calculation_repository_1 = require("./repositories/savings-calculation.repository");
let SavingsCalculatorService = SavingsCalculatorService_1 = class SavingsCalculatorService {
    emiCalculator;
    bankRatesService;
    vehicleValuation;
    repository;
    logger = new common_1.Logger(SavingsCalculatorService_1.name);
    constructor(emiCalculator, bankRatesService, vehicleValuation, repository) {
        this.emiCalculator = emiCalculator;
        this.bankRatesService = bankRatesService;
        this.vehicleValuation = vehicleValuation;
        this.repository = repository;
    }
    async calculateSavings(dto) {
        const startTime = Date.now();
        const sessionId = (0, crypto_1.randomUUID)();
        const bankRates = await this.bankRatesService.getActiveRefinanceRates(dto.outstandingAmount);
        if (bankRates.length === 0) {
            throw new common_1.ServiceUnavailableException('Savings calculation is temporarily unavailable. No bank rates configured.');
        }
        const bestRate = bankRates[0].interestRateMin;
        const isRateCompetitive = dto.currentRate <= bestRate;
        const bankComparisons = [];
        const top3Banks = bankRates.slice(0, 3);
        const currentTotalInterest = this.emiCalculator.calculateTotalInterest(new decimal_js_1.default(dto.currentEmi), dto.remainingTenure, dto.outstandingAmount);
        for (const bank of top3Banks) {
            const newEmi = this.emiCalculator.calculateEmi(dto.outstandingAmount, bank.interestRateMin, dto.remainingTenure);
            const monthlySaving = this.emiCalculator.calculateMonthlySaving(dto.currentEmi, newEmi);
            const newTotalInterest = this.emiCalculator.calculateTotalInterest(newEmi, dto.remainingTenure, dto.outstandingAmount);
            const totalSaving = this.emiCalculator.calculateTotalInterestSaving(currentTotalInterest, newTotalInterest);
            bankComparisons.push({
                bankName: bank.bankName,
                offeredRate: bank.interestRateMin,
                estimatedEmi: newEmi.toNumber(),
                monthlySaving: Math.max(0, monthlySaving.toNumber()),
                totalSaving: Math.max(0, totalSaving.toNumber()),
            });
        }
        const bestBank = bankComparisons[0];
        const monthlySaving = isRateCompetitive ? 0 : bestBank.monthlySaving;
        const totalInterestSaving = isRateCompetitive ? 0 : bestBank.totalSaving;
        const topUpResult = this.vehicleValuation.checkTopUpEligibility(dto.outstandingAmount, dto.originalTenure, dto.remainingTenure);
        const data = {
            monthlySaving,
            totalInterestSaving,
            topUpEligible: topUpResult.eligible,
            topUpAmount: topUpResult.amount,
            recommendedBank: {
                name: bestBank.bankName,
                offeredRate: bestBank.offeredRate,
                estimatedEmi: bestBank.estimatedEmi,
            },
            bankComparisons,
            isRateCompetitive,
            competitiveMessage: isRateCompetitive
                ? 'Your current interest rate is already competitive. Consider a top-up loan instead.'
                : null,
        };
        const responseTimeMs = Date.now() - startTime;
        const savedCalculation = await this.repository.create({
            sessionId,
            currentEmi: dto.currentEmi,
            outstandingAmount: dto.outstandingAmount,
            currentRate: dto.currentRate,
            remainingTenure: dto.remainingTenure,
            originalTenure: dto.originalTenure,
            monthlySaving,
            totalInterestSaving,
            topUpEligible: topUpResult.eligible,
            topUpAmount: topUpResult.amount,
            recommendedBank: bestBank.bankName,
            bankComparisons: bankComparisons,
            responseTimeMs,
        });
        this.logger.log(`Savings calculated: ₹${monthlySaving}/mo saving, best rate ${bestBank.offeredRate}% (${bestBank.bankName}) [${responseTimeMs}ms]`);
        return {
            data,
            calculationId: savedCalculation.id,
            responseTimeMs,
        };
    }
};
exports.SavingsCalculatorService = SavingsCalculatorService;
exports.SavingsCalculatorService = SavingsCalculatorService = SavingsCalculatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [emi_calculator_service_1.EmiCalculatorService,
        bank_rates_service_1.BankRatesService,
        vehicle_valuation_service_1.VehicleValuationService,
        savings_calculation_repository_1.SavingsCalculationRepository])
], SavingsCalculatorService);
//# sourceMappingURL=savings-calculator.service.js.map