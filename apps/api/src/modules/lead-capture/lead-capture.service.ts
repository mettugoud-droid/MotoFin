import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpportunityCategory, LeadStatus } from '@prisma/client';

import { LeadRepository } from './repositories/lead.repository';
import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';
import { NotificationService } from '../notifications/notification.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';

const METRO_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

export interface LeadCaptureResult {
  leadId: string;
  existingLead: boolean;
  status: string;
  opportunityCategory: string;
  score: number;
  assignedTo: string | null;
}

@Injectable()
export class LeadCaptureService {
  private readonly logger = new Logger(LeadCaptureService.name);

  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly savingsCalcRepository: SavingsCalculationRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async captureLead(dto: CaptureLeadDto): Promise<LeadCaptureResult> {
    // 1. Check for duplicate mobile
    const existingLead = await this.leadRepository.findByMobile(dto.mobile);

    if (existingLead) {
      // Update last interaction timestamp
      await this.leadRepository.updateLastInteraction(existingLead.id);

      this.logger.log(`Duplicate lead detected: ${dto.mobile} → existing lead ${existingLead.id}`);

      return {
        leadId: existingLead.id,
        existingLead: true,
        status: existingLead.status,
        opportunityCategory: existingLead.opportunityCategory || 'refinance_opportunity',
        score: existingLead.opportunityScore || 0,
        assignedTo: existingLead.assignedTo,
      };
    }

    // 2. Classify opportunity
    const opportunityCategory = this.classifyOpportunity(dto.calculatorType);

    // 3. Calculate lead score
    const score = await this.calculateScore(dto);

    // 4. Get lead source
    const sourceType = dto.calculatorType === 'savings' ? 'savings_calculator' : 'foreclosure_calculator';
    const leadSource = await this.leadRepository.getLeadSourceByType(sourceType);

    if (!leadSource) {
      throw new NotFoundException(`Lead source not found for type: ${sourceType}`);
    }

    // 5. Assign to sales executive (MVP: first available)
    const executive = await this.leadRepository.getFirstActiveExecutive();
    const assignedTo = executive ? executive.id : null;

    // 6. Get savings data for loan details
    const savingsData = await this.getSavingsData(dto.sessionId);

    // 7. Create lead
    const lead = await this.leadRepository.create({
      customerName: dto.name,
      customerMobile: dto.mobile,
      customerCity: dto.city,
      leadSourceId: leadSource.id,
      assignedTo,
      status: LeadStatus.NEW,
      opportunityCategory,
      opportunityScore: score,
      existingLoanDetails: savingsData ? {
        currentEmi: Number(savingsData.currentEmi),
        outstandingAmount: Number(savingsData.outstandingAmount),
        currentRate: Number(savingsData.currentRate),
        remainingTenure: savingsData.remainingTenure,
        originalTenure: savingsData.originalTenure,
        currentBank: dto.currentBank || null,
        sessionId: dto.sessionId,
      } : null,
      requestedLoanAmount: savingsData ? Number(savingsData.outstandingAmount) : null,
      utmSource: dto.utmSource || null,
      utmMedium: dto.utmMedium || null,
      utmCampaign: dto.utmCampaign || null,
      utmContent: dto.utmContent || null,
      utmTerm: dto.utmTerm || null,
    });

    // 8. Link savings calculation to lead
    if (savingsData) {
      await this.savingsCalcRepository.markLeadCaptured(savingsData.id, lead.id);
    }

    // 9. Send notification (async, non-blocking)
    this.triggerLeadNotification(dto.name, dto.mobile, lead.id, savingsData).catch((err) => {
      this.logger.error(`Failed to send lead notification: ${err instanceof Error ? err.message : 'Unknown error'}`);
    });

    this.logger.log(
      `Lead captured: ${dto.name} (${dto.mobile}) → ${opportunityCategory}, score=${score}, assigned=${assignedTo ? 'yes' : 'no'}`,
    );

    return {
      leadId: lead.id,
      existingLead: false,
      status: LeadStatus.NEW,
      opportunityCategory,
      score,
      assignedTo,
    };
  }

  private async triggerLeadNotification(
    name: string,
    mobile: string,
    leadId: string,
    savingsData: { monthlySaving: unknown; recommendedBank: string | null } | null,
  ): Promise<void> {
    const monthlySaving = savingsData?.monthlySaving ? Number(savingsData.monthlySaving) : undefined;
    const recommendedBank = savingsData?.recommendedBank || undefined;

    await this.notificationService.sendLeadWelcomeNotification({
      name,
      mobile,
      leadId,
      monthlySaving,
      recommendedBank,
    });
  }

  private classifyOpportunity(calculatorType: string): OpportunityCategory {
    switch (calculatorType) {
      case 'savings':
        return OpportunityCategory.refinance_opportunity;
      case 'foreclosure':
        return OpportunityCategory.balance_transfer_opportunity;
      default:
        return OpportunityCategory.refinance_opportunity;
    }
  }

  async calculateScore(dto: CaptureLeadDto): Promise<number> {
    let score = 0;

    // Get savings data from session
    const savingsData = await this.getSavingsData(dto.sessionId);

    if (savingsData) {
      const monthlySaving = savingsData.monthlySaving ? Number(savingsData.monthlySaving) : 0;
      const outstandingAmount = Number(savingsData.outstandingAmount);
      const topUpEligible = savingsData.topUpEligible;

      // Savings scoring
      if (monthlySaving > 2000) {
        score += 30;
      } else if (monthlySaving > 1000) {
        score += 20;
      }

      // Outstanding amount scoring
      if (outstandingAmount > 500000) {
        score += 20;
      }

      // Top-up eligibility
      if (topUpEligible) {
        score += 20;
      }
    }

    // Metro city scoring
    const isMetroCity = METRO_CITIES.some(
      (city) => city.toLowerCase() === dto.city.toLowerCase(),
    );
    if (isMetroCity) {
      score += 10;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  private async getSavingsData(sessionId: string) {
    try {
      return await this.savingsCalcRepository.findBySessionId(sessionId);
    } catch {
      return null;
    }
  }
}
