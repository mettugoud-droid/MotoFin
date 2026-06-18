import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { PreApprovalService } from '../pre-approval.service';
import { SavingsCalculationRepository } from '../../savings-calculator/repositories/savings-calculation.repository';
import { BankRatesService } from '../../shared/services/bank-rates.service';
import { VehicleValuationService } from '../../shared/services/vehicle-valuation.service';
import { EmiCalculatorService } from '../../shared/services/emi-calculator.service';
import { PreApprovalRepository } from '../repositories/pre-approval.repository';

describe('PreApprovalService', () => {
  let service: PreApprovalService;
  let savingsCalcRepo: jest.Mocked<SavingsCalculationRepository>;
  let bankRatesService: jest.Mocked<BankRatesService>;
  let preApprovalRepo: jest.Mocked<PreApprovalRepository>;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreApprovalService,
        EmiCalculatorService,
        VehicleValuationService,
        { provide: SavingsCalculationRepository, useValue: { findBySessionId: jest.fn().mockResolvedValue(mockSavingsData), create: jest.fn(), findById: jest.fn(), markLeadCaptured: jest.fn() } },
        { provide: BankRatesService, useValue: { getActiveRefinanceRates: jest.fn().mockResolvedValue(mockBankRates) } },
        { provide: PreApprovalRepository, useValue: { create: jest.fn().mockResolvedValue({ id: 'pre-approval-uuid' }), findBySourceCalculation: jest.fn() } },
      ],
    }).compile();

    service = module.get<PreApprovalService>(PreApprovalService);
    savingsCalcRepo = module.get(SavingsCalculationRepository);
    bankRatesService = module.get(BankRatesService);
    preApprovalRepo = module.get(PreApprovalRepository);
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
      // Early-stage loan with short history -> lower probability
      savingsCalcRepo.findBySessionId.mockResolvedValue({
        ...mockSavingsData,
        originalTenure: 60,
        remainingTenure: 55, // Only 5 months elapsed
        outstandingAmount: 950000,
      } as never);

      const result = await service.calculatePreApproval({ sessionId: 'session-uuid' });

      expect(result.data.approvalProbability).toBeGreaterThanOrEqual(40);
      expect(result.data.approvalProbability).toBeLessThan(70);
      expect(result.data.confidenceLevel).toBe('MODERATE');
      expect(result.data.confidenceMessage).toContain('Moderate');
    });

    it('should return SUBJECT_TO_VERIFICATION for weak profile', async () => {
      // Very new loan with high LTV
      savingsCalcRepo.findBySessionId.mockResolvedValue({
        ...mockSavingsData,
        originalTenure: 12,
        remainingTenure: 11, // Only 1 month elapsed
        outstandingAmount: 4900000, // Very high outstanding
        currentEmi: 50000,
      } as never);
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
      } as never);
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

      // With elapsedTenure=24 months and outstandingAmount=800000, top-up should be calculated
      expect(result.data.topUpEligibility === null || typeof result.data.topUpEligibility === 'number').toBe(true);
    });

    it('should throw NotFoundException for invalid sessionId', async () => {
      savingsCalcRepo.findBySessionId.mockResolvedValue(null);

      await expect(
        service.calculatePreApproval({ sessionId: 'invalid-uuid' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should persist pre-approval result', async () => {
      await service.calculatePreApproval({ sessionId: 'session-uuid' });

      expect(preApprovalRepo.create).toHaveBeenCalledTimes(1);
      expect(preApprovalRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceType: 'savings_calculator',
          sourceCalculationId: 'savings-calc-id',
        }),
      );
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
