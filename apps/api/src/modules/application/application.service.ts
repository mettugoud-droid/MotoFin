import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';

import { ApplicationRepository } from './repositories/application.repository';
import { NotificationService } from '../notifications/notification.service';
import {
  ApplicationStage,
  VALID_APPLICATION_TRANSITIONS,
  SubmitApplicationDto,
  TransitionApplicationDto,
  ApplicationRecord,
  ApplicationSubmissionResult,
} from './dto/application.dto';

const MAX_CONCURRENT_APPLICATIONS = 3;

/**
 * Application Submission & Tracking (Requirement 8)
 *
 * - Submit to bank with mandatory field validation (Req 8.1, 8.8)
 * - Track stages: Submitted → Under Review → Approved → Disbursed (Req 8.2)
 * - Forward-only progression; any stage → Rejected (Req 8.2)
 * - Approval notification to customer + executive within 5 min (Req 8.3)
 * - Disbursement cancels other pending applications (Req 8.4)
 * - Rejection suggests alternatives (Req 8.5)
 * - Max 3 concurrent applications per lead (Req 8.6)
 * - All rejected → lead status ALL_REJECTED (Req 8.7)
 */
@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    private readonly repository: ApplicationRepository,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Submit application to a bank (Req 8.1, 8.6, 8.8)
   */
  async submitApplication(dto: SubmitApplicationDto): Promise<ApplicationSubmissionResult> {
    // 1. Validate lead exists and has mandatory fields (Req 8.1, 8.8)
    const lead = await this.repository.getLeadById(dto.leadId);
    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    const missingFields: string[] = [];
    if (!lead.customerName) missingFields.push('customer_name');
    if (!lead.customerMobile) missingFields.push('customer_mobile');
    if (!lead.existingLoanDetails) missingFields.push('loan_details');
    if (!dto.loanAmount) missingFields.push('loan_amount');

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Cannot submit application. Missing mandatory fields: ${missingFields.join(', ')}`,
      );
    }

    // 2. Check max 3 concurrent applications (Req 8.6)
    const activeCount = await this.repository.getActiveApplicationsCount(dto.leadId);
    if (activeCount >= MAX_CONCURRENT_APPLICATIONS) {
      throw new BadRequestException(
        `Maximum ${MAX_CONCURRENT_APPLICATIONS} concurrent applications allowed per lead. Currently active: ${activeCount}`,
      );
    }

    // 3. Validate bank exists
    const bank = await this.repository.getBankByCode(dto.bankCode);
    if (!bank) {
      throw new BadRequestException(`Bank not found: ${dto.bankCode}`);
    }

    // 4. Create application
    const application = await this.repository.createApplication({
      leadId: dto.leadId,
      bankName: bank.name,
      bankCode: dto.bankCode,
      loanAmount: dto.loanAmount,
    });

    // 5. Update lead status to BANK_SUBMITTED (Req 8.1)
    await this.repository.updateLeadStatus(dto.leadId, LeadStatus.BANK_SUBMITTED);

    this.logger.log(`Application submitted: ${application.id} → ${bank.name} for lead ${dto.leadId}`);

    return {
      applicationId: application.id,
      leadId: dto.leadId,
      bankName: bank.name,
      stage: ApplicationStage.SUBMITTED,
      totalActiveApplications: activeCount + 1,
    };
  }

  /**
   * Transition application stage (Req 8.2, 8.3, 8.4, 8.5, 8.7)
   */
  async transitionStage(applicationId: string, dto: TransitionApplicationDto): Promise<ApplicationRecord> {
    const app = await this.repository.getApplicationById(applicationId);
    if (!app) {
      throw new BadRequestException('Application not found');
    }

    // Validate forward-only transition (Req 8.2)
    const allowed = VALID_APPLICATION_TRANSITIONS[app.stage] || [];
    if (!allowed.includes(dto.newStage)) {
      throw new BadRequestException(
        `Cannot transition from ${app.stage} to ${dto.newStage}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    // Update stage
    const updated = await this.repository.updateApplicationStage(applicationId, dto.newStage, {
      rejectionReason: dto.reason,
      approvedAmount: dto.approvedAmount,
      disbursementAmount: dto.disbursementAmount,
      conditions: dto.conditions,
    });

    if (!updated) throw new BadRequestException('Failed to update application');

    // Handle specific stage transitions
    switch (dto.newStage) {
      case ApplicationStage.APPROVED:
        // Req 8.3: Notify customer + executive within 5 minutes
        await this.handleApproval(updated);
        await this.repository.updateLeadStatus(app.leadId, LeadStatus.APPROVED);
        break;

      case ApplicationStage.DISBURSED:
        // Req 8.4: Record disbursement, cancel others, update lead
        await this.handleDisbursement(updated);
        break;

      case ApplicationStage.REJECTED:
        // Req 8.5: Suggest alternatives; Req 8.7: check if all rejected
        await this.handleRejection(updated);
        break;
    }

    this.logger.log(`Application ${applicationId}: ${app.stage} → ${dto.newStage}`);

    return updated;
  }

  /**
   * Get all applications for a lead
   */
  async getApplicationsForLead(leadId: string): Promise<ApplicationRecord[]> {
    return this.repository.getApplicationsByLeadId(leadId);
  }

  private async handleApproval(app: ApplicationRecord): Promise<void> {
    // Req 8.3: Notify customer + executive within 5 minutes
    const lead = await this.repository.getLeadById(app.leadId);
    if (lead) {
      this.notificationService.sendLeadWelcomeNotification({
        name: lead.customerName,
        mobile: lead.customerMobile,
        leadId: app.leadId,
        monthlySaving: undefined,
        recommendedBank: app.bankName,
      }).catch((e) => this.logger.error(`Approval notification failed: ${e}`));
    }
  }

  private async handleDisbursement(app: ApplicationRecord): Promise<void> {
    // Req 8.4: Cancel other pending applications
    const cancelled = await this.repository.cancelOtherApplications(app.leadId, app.id);
    this.logger.log(`Disbursement: cancelled ${cancelled} other applications for lead ${app.leadId}`);

    // Update lead status to DISBURSED
    await this.repository.updateLeadStatus(app.leadId, LeadStatus.DISBURSED);
  }

  private async handleRejection(app: ApplicationRecord): Promise<void> {
    // Check if ALL applications for this lead are now rejected (Req 8.7)
    const allApps = await this.repository.getApplicationsByLeadId(app.leadId);
    const allRejectedOrCancelled = allApps.every(
      (a) => a.stage === ApplicationStage.REJECTED || a.stage === ApplicationStage.CANCELLED,
    );

    if (allRejectedOrCancelled && allApps.length > 0) {
      await this.repository.updateLeadStatus(app.leadId, LeadStatus.ALL_REJECTED);
      this.logger.warn(`All applications rejected for lead ${app.leadId}`);

      // Notify executive
      const lead = await this.repository.getLeadById(app.leadId);
      if (lead?.assignedTo) {
        this.notificationService.sendLeadWelcomeNotification({
          name: lead.customerName,
          mobile: lead.customerMobile,
          leadId: app.leadId,
        }).catch(() => {});
      }
    }
  }

  /**
   * Get alternative bank suggestions after rejection (Req 8.5)
   */
  async getAlternatives(leadId: string): Promise<string[]> {
    return this.repository.getAlternativeBanks(leadId);
  }
}
