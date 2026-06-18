import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { LeadStatus, OpportunityCategory, LeadSourceType } from '@prisma/client';

import { LeadAcquisitionRepository } from './repositories/lead-acquisition.repository';
import { NotificationService } from '../notifications/notification.service';
import { CreateLeadDto, LoanRequirement, LeadSourceChannel } from './dto/create-lead.dto';

export interface LeadAcquisitionResult {
  leadId: string;
  isExisting: boolean;
  status: string;
  opportunityCategory?: string;
  opportunityScore?: number;
  assignedTo?: string;
  source: string;
  sourceTimestamp: string;
}

const SOURCE_CHANNEL_TO_TYPE: Record<LeadSourceChannel, LeadSourceType> = {
  [LeadSourceChannel.META_LEAD_ADS]: 'meta_lead_ads',
  [LeadSourceChannel.GOOGLE_LEAD_FORMS]: 'google_lead_forms',
  [LeadSourceChannel.LANDING_PAGE]: 'landing_page',
  [LeadSourceChannel.WHATSAPP_CAMPAIGN]: 'whatsapp_campaign',
  [LeadSourceChannel.REFERRAL_PARTNER]: 'referral_partner',
  [LeadSourceChannel.DEALER_NETWORK]: 'dealer_network',
};

const LOAN_REQUIREMENT_TO_CATEGORY: Record<string, OpportunityCategory> = {
  [LoanRequirement.USED_CAR_LOAN]: OpportunityCategory.used_car_buyer,
  [LoanRequirement.REFINANCE_LOAN]: OpportunityCategory.refinance_opportunity,
  [LoanRequirement.VEHICLE_LOAN_BALANCE_TRANSFER]: OpportunityCategory.balance_transfer_opportunity,
  [LoanRequirement.TOP_UP_VEHICLE_LOAN]: OpportunityCategory.top_up_opportunity,
  [LoanRequirement.LOAN_AGAINST_CAR]: OpportunityCategory.loan_against_vehicle,
  [LoanRequirement.COMMERCIAL_VEHICLE_REFINANCE]: OpportunityCategory.refinance_opportunity,
};

@Injectable()
export class LeadAcquisitionService {
  private readonly logger = new Logger(LeadAcquisitionService.name);

  constructor(
    private readonly repository: LeadAcquisitionRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async captureLead(dto: CreateLeadDto): Promise<LeadAcquisitionResult> {
    const sourceTimestamp = new Date().toISOString();

    // 1. Check for duplicate mobile — link to existing if found (Req 1.6)
    const existingLead = await this.repository.findByMobile(dto.mobile);

    if (existingLead) {
      // Append new source, timestamp, and updated optional fields
      await this.repository.appendSourceToExistingLead(existingLead.id, dto.source, {
        city: dto.city,
        email: dto.email,
        vehicleType: dto.vehicleType,
        loanRequirement: dto.loanRequirement,
        timestamp: sourceTimestamp,
      });

      this.logger.log(`Duplicate mobile ${dto.mobile} → linked to existing lead ${existingLead.id}`);

      return {
        leadId: existingLead.id,
        isExisting: true,
        status: existingLead.status,
        opportunityCategory: existingLead.opportunityCategory || undefined,
        opportunityScore: existingLead.opportunityScore || undefined,
        assignedTo: existingLead.assignedTo || undefined,
        source: dto.source,
        sourceTimestamp,
      };
    }

    // 2. Resolve lead source from DB
    const sourceType = SOURCE_CHANNEL_TO_TYPE[dto.source];
    const leadSource = await this.repository.getLeadSourceByType(sourceType);
    if (!leadSource) {
      throw new BadRequestException(`Lead source not configured for channel: ${dto.source}`);
    }

    // 3. Classify opportunity category from loan requirement (Req 1.8)
    const opportunityCategory = dto.loanRequirement
      ? LOAN_REQUIREMENT_TO_CATEGORY[dto.loanRequirement] || OpportunityCategory.uncategorized
      : OpportunityCategory.uncategorized;

    // 4. Calculate initial score
    const score = this.calculateInitialScore(dto);

    // 5. Assign to first available executive (MVP)
    const executive = await this.repository.getFirstActiveExecutive();
    const assignedTo = executive?.id;

    // 6. Create lead (Req 1.2 — stored within 5 seconds)
    const lead = await this.repository.create({
      customerName: dto.name,
      customerMobile: dto.mobile,
      customerEmail: dto.email,
      customerCity: dto.city,
      leadSourceId: leadSource.id,
      assignedTo,
      status: LeadStatus.NEW,
      opportunityCategory,
      opportunityScore: score,
      existingLoanDetails: dto.existingLoanStatus ? { hasExistingLoan: true, vehicleType: dto.vehicleType, vehicleAge: dto.vehicleAge } : undefined,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      matchedSignals: [{ source: dto.source, timestamp: sourceTimestamp, loanRequirement: dto.loanRequirement }],
    });

    // 7. Send welcome notification (async, non-blocking)
    this.sendWelcomeNotification(dto.name, dto.mobile, lead.id).catch((err) => {
      this.logger.error(`Welcome notification failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    });

    this.logger.log(
      `Lead captured: ${dto.name} (${dto.mobile}) source=${dto.source} category=${opportunityCategory} score=${score}`,
    );

    return {
      leadId: lead.id,
      isExisting: false,
      status: LeadStatus.NEW,
      opportunityCategory,
      opportunityScore: score,
      assignedTo,
      source: dto.source,
      sourceTimestamp,
    };
  }

  /**
   * Capture lead from Meta webhook data (after Graph API fetch)
   */
  async captureFromMeta(data: { name: string; mobile: string; email?: string; city?: string; loanRequirement?: string }): Promise<LeadAcquisitionResult> {
    return this.captureLead({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      loanRequirement: data.loanRequirement as LoanRequirement | undefined,
      source: LeadSourceChannel.META_LEAD_ADS,
    });
  }

  /**
   * Capture lead from Google Lead Form webhook
   */
  async captureFromGoogle(data: { name: string; mobile: string; email?: string; city?: string; loanRequirement?: string; campaignId?: string }): Promise<LeadAcquisitionResult> {
    return this.captureLead({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      loanRequirement: data.loanRequirement as LoanRequirement | undefined,
      source: LeadSourceChannel.GOOGLE_LEAD_FORMS,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: data.campaignId,
    });
  }

  private calculateInitialScore(dto: CreateLeadDto): number {
    let score = 20; // Base score for any lead

    // Loan requirement specified = higher intent
    if (dto.loanRequirement) score += 15;

    // Existing loan = higher opportunity
    if (dto.existingLoanStatus) score += 20;

    // City provided = better profile completeness
    if (dto.city) score += 5;

    // Email provided = better profile completeness
    if (dto.email) score += 5;

    // Vehicle info provided
    if (dto.vehicleType) score += 5;
    if (dto.vehicleAge) score += 5;

    // Source-based scoring
    if (dto.source === LeadSourceChannel.REFERRAL_PARTNER) score += 15;
    if (dto.source === LeadSourceChannel.DEALER_NETWORK) score += 10;

    return Math.min(100, score);
  }

  private async sendWelcomeNotification(name: string, mobile: string, leadId: string): Promise<void> {
    await this.notificationService.sendLeadWelcomeNotification({
      name,
      mobile,
      leadId,
    });
  }
}
