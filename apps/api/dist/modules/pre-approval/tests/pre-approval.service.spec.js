"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const pre_approval_service_1 = require("../pre-approval.service");
const savings_calculation_repository_1 = require("../../savings-calculator/repositories/savings-calculation.repository");
const bank_rates_service_1 = require("../../shared/services/bank-rates.service");
const vehicle_valuation_service_1 = require("../../shared/services/vehicle-valuation.service");
const emi_calculator_service_1 = require("../../shared/services/emi-calculator.service");
const pre_approval_repository_1 = require("../repositories/pre-approval.repository");
describe('PreApprovalService', () => {
    let service;
    let savingsCalcRepo;
    let bankRatesService;
    let preApprovalRepo;
    const mockSavingsData = {
        id: 'savings-calc-id',
        tenantId: '00000000-0000-0000-0000-000000000001',
        sessionId: 'session-uuid',
        currentEmi: 28000,
        outstandingAmount: 500000,
        currentRate: 12.5,
        remainingTenure: 24,
        originalTenure: 60,
        monthlySaving: 2500,
        totalInterestSaving: 90000,
        topUpEligible: true,
        topUpAmount: 175000,
        recommendedBank: 'HDFC Bank',
        bankComparisons: [],
        responseTimeMs: 45,
        leadCaptured: false,
        leadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    const mockBankRates = [
        { bankId: '1', bankName: 'Kotak Mahindra Bank', bankCode: 'kotak', interestRateMin: 8.25, interestRateMax: 10.5, minLoanAmount: 400000, maxLoanAmount: 5000000, historicalApprovalRate: 78.0 },
        { bankId: '2', bankName: 'HDFC Bank', bankCode: 'hdfc', interestRateMin: 8.5, interestRateMax: 11.5, minLoanAmount: 300000, maxLoanAmount: 5000000, historicalApprovalRate: 72.5 },
        { bankId: '3', bankName: 'Axis Bank', bankCode: 'axis', interestRateMin: 8.65, interestRateMax: 11.75, minLoanAmount: 250000, maxLoanAmount: 4000000, historicalApprovalRate: 65.0 },
    ];
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                pre_approval_service_1.PreApprovalService,
                emi_calculator_service_1.EmiCalculatorService,
                vehicle_valuation_service_1.VehicleValuationService,
                { provide: savings_calculation_repository_1.SavingsCalculationRepository, useValue: { findBySessionId: jest.fn().mockResolvedValue(mockSavingsData), create: jest.fn(), findById: jest.fn(), markLeadCaptured: jest.fn() } },
                { provide: bank_rates_service_1.BankRatesService, useValue: { getActiveRefinanceRates: jest.fn().mockResolvedValue(mockBankRates) } },
                { provide: pre_approval_repository_1.PreApprovalRepository, useValue: { create: jest.fn().mockResolvedValue({ id: 'pre-approval-uuid' }), findBySourceCalculation: jest.fn() } },
            ],
        }).compile();
        service = module.get(pre_approval_service_1.PreApprovalService);
        savingsCalcRepo = module.get(savings_calculation_repository_1.SavingsCalculationRepository);
        bankRatesService = module.get(bank_rates_service_1.BankRatesService);
        preApprovalRepo = module.get(pre_approval_repository_1.PreApprovalRepository);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('calculatePreApproval', () => {
        it('should return HIGH confidence for strong loan profile', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.approvalProbability).toBeGreaterThanOrEqual(70);
            expect(result.data.confidenceLevel).toBe('HIGH');
            expect(result.data.confidenceMessage).toContain('High Chance');
        });
        it('should return MODERATE confidence for mid-range profile', async () => {
            savingsCalcRepo.findBySessionId.mockResolvedValue({
                ...mockSavingsData,
                originalTenure: 60,
                remainingTenure: 55,
                outstandingAmount: 950000,
            });
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.approvalProbability).toBeGreaterThanOrEqual(40);
            expect(result.data.approvalProbability).toBeLessThan(70);
            expect(result.data.confidenceLevel).toBe('MODERATE');
            expect(result.data.confidenceMessage).toContain('Moderate');
        });
        it('should return SUBJECT_TO_VERIFICATION for weak profile', async () => {
            savingsCalcRepo.findBySessionId.mockResolvedValue({
                ...mockSavingsData,
                originalTenure: 12,
                remainingTenure: 11,
                outstandingAmount: 4900000,
                currentEmi: 50000,
            });
            bankRatesService.getActiveRefinanceRates.mockResolvedValue([]);
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.approvalProbability).toBeLessThan(40);
            expect(result.data.confidenceLevel).toBe('SUBJECT_TO_VERIFICATION');
        });
        it('should return empty banks for SUBJECT_TO_VERIFICATION', async () => {
            savingsCalcRepo.findBySessionId.mockResolvedValue({
                ...mockSavingsData,
                originalTenure: 12,
                remainingTenure: 11,
                outstandingAmount: 4900000,
                currentEmi: 50000,
            });
            bankRatesService.getActiveRefinanceRates.mockResolvedValue([]);
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.recommendedBanks).toHaveLength(0);
        });
        it('should return top 3 recommended banks for HIGH confidence', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.recommendedBanks.length).toBeLessThanOrEqual(3);
            expect(result.data.recommendedBanks.length).toBeGreaterThan(0);
            expect(result.data.recommendedBanks[0].bankName).toBeDefined();
            expect(result.data.recommendedBanks[0].offeredRate).toBeDefined();
        });
        it('should rank banks by interest rate ascending', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            const rates = result.data.recommendedBanks.map((b) => b.offeredRate);
            for (let i = 0; i < rates.length - 1; i++) {
                expect(rates[i]).toBeLessThanOrEqual(rates[i + 1]);
            }
        });
        it('should calculate top-up eligibility', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.topUpEligibility === null || typeof result.data.topUpEligibility === 'number').toBe(true);
        });
        it('should throw NotFoundException for invalid sessionId', async () => {
            savingsCalcRepo.findBySessionId.mockResolvedValue(null);
            await expect(service.calculatePreApproval({ sessionId: 'invalid-uuid' })).rejects.toThrow(common_1.NotFoundException);
        });
        it('should persist pre-approval result', async () => {
            await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(preApprovalRepo.create).toHaveBeenCalledTimes(1);
            expect(preApprovalRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                sourceType: 'savings_calculator',
                sourceCalculationId: 'savings-calc-id',
            }));
        });
        it('should always include disclaimer in response', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.disclaimer).toContain('indicative estimate');
            expect(result.data.disclaimer).toContain('document verification');
        });
        it('should return probability between 0 and 100', async () => {
            const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });
            expect(result.data.approvalProbability).toBeGreaterThanOrEqual(0);
            expect(result.data.approvalProbability).toBeLessThanOrEqual(100);
        });
    });
});
//# sourceMappingURL=pre-approval.service.spec.js.map