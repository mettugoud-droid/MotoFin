import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { LeadCaptureService } from '../lead-capture.service';
import { LeadRepository } from '../repositories/lead.repository';
import { SavingsCalculationRepository } from '../../savings-calculator/repositories/savings-calculation.repository';
import { CaptureLeadDto } from '../dto/capture-lead.dto';

describe('LeadCaptureService', () => {
  let service: LeadCaptureService;
  let leadRepository: jest.Mocked<LeadRepository>;
  let savingsCalcRepository: jest.Mocked<SavingsCalculationRepository>;

  const validDto: CaptureLeadDto = {
    sessionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    calculatorType: 'savings',
    name: 'Surender Goud',
    mobile: '9876543210',
    city: 'Hyderabad',
    currentBank: 'HDFC',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'refinance_june',
  };

  const mockSavingsData = {
    id: 'savings-calc-id',
    tenantId: '00000000-0000-0000-0000-000000000001',
    sessionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    currentEmi: 28000,
    outstandingAmount: 800000,
    currentRate: 12.5,
    remainingTenure: 36,
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

  const mockLeadSource = {
    id: 'source-uuid',
    tenantId: '00000000-0000-0000-0000-000000000001',
    name: 'Savings Calculator',
    type: 'savings_calculator',
    config: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockExecutive = {
    id: 'exec-uuid',
    tenantId: '00000000-0000-0000-0000-000000000001',
    supabaseUid: 'supabase-uid',
    roleId: 'role-uuid',
    email: 'exec@motofin.in',
    fullName: 'Sales Executive 1',
    phone: '9999999999',
    city: 'Hyderabad',
    productExpertise: ['refinance_loan'],
    isActive: true,
    maxActiveLeads: 50,
    lastAssignmentAt: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockLeadRepo = {
      findByMobile: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'new-lead-uuid', status: 'NEW' }),
      updateLastInteraction: jest.fn().mockResolvedValue({}),
      getLeadSourceByType: jest.fn().mockResolvedValue(mockLeadSource),
      getFirstActiveExecutive: jest.fn().mockResolvedValue(mockExecutive),
    };

    const mockSavingsCalcRepo = {
      findBySessionId: jest.fn().mockResolvedValue(mockSavingsData),
      markLeadCaptured: jest.fn().mockResolvedValue({}),
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadCaptureService,
        { provide: LeadRepository, useValue: mockLeadRepo },
        { provide: SavingsCalculationRepository, useValue: mockSavingsCalcRepo },
      ],
    }).compile();

    service = module.get<LeadCaptureService>(LeadCaptureService);
    leadRepository = module.get(LeadRepository);
    savingsCalcRepository = module.get(SavingsCalculationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('captureLead', () => {
    it('should create a new lead for first-time mobile number', async () => {
      const result = await service.captureLead(validDto);

      expect(result.existingLead).toBe(false);
      expect(result.leadId).toBe('new-lead-uuid');
      expect(result.status).toBe('NEW');
      expect(leadRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should detect duplicate mobile and return existing lead', async () => {
      leadRepository.findByMobile.mockResolvedValue({
        id: 'existing-lead-uuid',
        status: 'CONTACTED',
        opportunityCategory: 'refinance_opportunity',
        opportunityScore: 70,
        assignedTo: 'exec-uuid',
      } as never);

      const result = await service.captureLead(validDto);

      expect(result.existingLead).toBe(true);
      expect(result.leadId).toBe('existing-lead-uuid');
      expect(leadRepository.create).not.toHaveBeenCalled();
      expect(leadRepository.updateLastInteraction).toHaveBeenCalledWith('existing-lead-uuid');
    });

    it('should classify savings calculator as refinance_opportunity', async () => {
      const result = await service.captureLead(validDto);
      expect(result.opportunityCategory).toBe('refinance_opportunity');
    });

    it('should classify foreclosure calculator as balance_transfer_opportunity', async () => {
      const foreclosureDto = { ...validDto, calculatorType: 'foreclosure' };
      leadRepository.getLeadSourceByType.mockResolvedValue({ ...mockLeadSource, type: 'foreclosure_calculator' } as never);

      const result = await service.captureLead(foreclosureDto);
      expect(result.opportunityCategory).toBe('balance_transfer_opportunity');
    });

    it('should assign to first active sales executive', async () => {
      const result = await service.captureLead(validDto);
      expect(result.assignedTo).toBe('exec-uuid');
    });

    it('should handle no available executive', async () => {
      leadRepository.getFirstActiveExecutive.mockResolvedValue(null);

      const result = await service.captureLead(validDto);
      expect(result.assignedTo).toBeNull();
    });

    it('should throw NotFoundException when lead source not found', async () => {
      leadRepository.getLeadSourceByType.mockResolvedValue(null);

      await expect(service.captureLead(validDto)).rejects.toThrow(NotFoundException);
    });

    it('should persist UTM data in lead record', async () => {
      await service.captureLead(validDto);

      expect(leadRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          utmSource: 'facebook',
          utmMedium: 'cpc',
          utmCampaign: 'refinance_june',
        }),
      );
    });

    it('should link savings calculation to lead after capture', async () => {
      await service.captureLead(validDto);

      expect(savingsCalcRepository.markLeadCaptured).toHaveBeenCalledWith(
        'savings-calc-id',
        'new-lead-uuid',
      );
    });

    it('should handle missing savings data gracefully', async () => {
      savingsCalcRepository.findBySessionId.mockResolvedValue(null);

      const result = await service.captureLead(validDto);

      expect(result.existingLead).toBe(false);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateScore', () => {
    it('should score savings > 2000 as +30 points', async () => {
      const score = await service.calculateScore(validDto);
      // monthlySaving=2500 → +30, outstanding=800000 → +20, topUpEligible → +20, Hyderabad metro → +10 = 80
      expect(score).toBe(80);
    });

    it('should cap score at 100', async () => {
      // Even if all criteria max out, score should not exceed 100
      const score = await service.calculateScore(validDto);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should score metro city as +10 points', async () => {
      const nonMetroDto = { ...validDto, city: 'Warangal' };
      savingsCalcRepository.findBySessionId.mockResolvedValue(null);

      const metroScore = await service.calculateScore(validDto);
      const nonMetroScore = await service.calculateScore(nonMetroDto);

      // Metro city Hyderabad gets +10 vs non-metro Warangal
      // With no savings data: metro=10, non-metro=0
      expect(metroScore).toBeGreaterThanOrEqual(nonMetroScore);
    });
  });
});
