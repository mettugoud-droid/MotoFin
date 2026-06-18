import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';

import { SavingsCalculatorService } from '../savings-calculator.service';
import { EmiCalculatorService } from '../../shared/services/emi-calculator.service';
import { BankRatesService } from '../../shared/services/bank-rates.service';
import { VehicleValuationService } from '../../shared/services/vehicle-valuation.service';
import { SavingsCalculationRepository } from '../repositories/savings-calculation.repository';
import { CalculateSavingsDto } from '../dto/calculate-savings.dto';

describe('SavingsCalculatorService', () => {
  let service: SavingsCalculatorService;
  let bankRatesService: jest.Mocked<BankRatesService>;
  let repository: jest.Mocked<SavingsCalculationRepository>;

  const mockBankRates = [
    { bankId: '3', bankName: 'Kotak Mahindra Bank', bankCode: 'kotak', interestRateMin: 8.25, interestRateMax: 10.5, minLoanAmount: 400000, maxLoanAmount: 5000000, historicalApprovalRate: 78.0 },
    { bankId: '1', bankName: 'HDFC Bank', bankCode: 'hdfc', interestRateMin: 8.5, interestRateMax: 11.5, minLoanAmount: 300000, maxLoanAmount: 5000000, historicalApprovalRate: 72.5 },
    { bankId: '2', bankName: 'ICICI Bank', bankCode: 'icici', interestRateMin: 8.75, interestRateMax: 12.0, minLoanAmount: 200000, maxLoanAmount: 5000000, historicalApprovalRate: 68.0 },
  ];

  const validDto: CalculateSavingsDto = {
    currentEmi: 28000,
    outstandingAmount: 800000,
    currentRate: 12.5,
    remainingTenure: 36,
    originalTenure: 60,
  };

  beforeEach(async () => {
    const mockBankRatesService = {
      getActiveRefinanceRates: jest.fn().mockResolvedValue(mockBankRates),
    };

    const mockRepository = {
      create: jest.fn().mockResolvedValue({ id: 'calc-uuid-123', sessionId: 'session-123' }),
      findById: jest.fn(),
      markLeadCaptured: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavingsCalculatorService,
        EmiCalculatorService,
        VehicleValuationService,
        { provide: BankRatesService, useValue: mockBankRatesService },
        { provide: SavingsCalculationRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<SavingsCalculatorService>(SavingsCalculatorService);
    bankRatesService = module.get(BankRatesService);
    repository = module.get(SavingsCalculationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateSavings', () => {
    it('should return valid savings calculation for standard input', async () => {
      const result = await service.calculateSavings(validDto);

      expect(result.data.monthlySaving).toBeGreaterThan(0);
      expect(result.data.totalInterestSaving).toBeGreaterThan(0);
      expect(result.data.bankComparisons).toHaveLength(3);
      expect(result.data.recommendedBank).toBeDefined();
      expect(result.data.isRateCompetitive).toBe(false);
      expect(result.calculationId).toBe('calc-uuid-123');
      expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return zero savings when current rate is competitive', async () => {
      const competitiveDto = { ...validDto, currentRate: 7.5 };
      const result = await service.calculateSavings(competitiveDto);

      expect(result.data.monthlySaving).toBe(0);
      expect(result.data.totalInterestSaving).toBe(0);
      expect(result.data.isRateCompetitive).toBe(true);
      expect(result.data.competitiveMessage).toContain('competitive');
    });

    it('should rank banks by lowest rate', async () => {
      const result = await service.calculateSavings(validDto);

      const rates = result.data.bankComparisons.map((b) => b.offeredRate);
      for (let i = 0; i < rates.length - 1; i++) {
        expect(rates[i]).toBeLessThanOrEqual(rates[i + 1]);
      }
    });

    it('should throw ServiceUnavailableException when no bank rates', async () => {
      bankRatesService.getActiveRefinanceRates.mockResolvedValue([]);

      await expect(service.calculateSavings(validDto)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should persist calculation to repository', async () => {
      await service.calculateSavings(validDto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          currentEmi: 28000,
          outstandingAmount: 800000,
          currentRate: 12.5,
        }),
      );
    });

    it('should calculate top-up eligibility', async () => {
      const result = await service.calculateSavings(validDto);

      expect(typeof result.data.topUpEligible).toBe('boolean');
    });

    it('should return calculation response time in meta', async () => {
      const result = await service.calculateSavings(validDto);

      expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.responseTimeMs).toBeLessThan(5000);
    });

    it('should handle single bank rate result', async () => {
      bankRatesService.getActiveRefinanceRates.mockResolvedValue([mockBankRates[0]]);

      const result = await service.calculateSavings(validDto);

      expect(result.data.bankComparisons).toHaveLength(1);
      expect(result.data.recommendedBank.name).toBe('Kotak Mahindra Bank');
    });
  });
});
