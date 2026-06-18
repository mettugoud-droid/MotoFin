import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';

import { CrmRepository } from './repositories/crm.repository';
import {
  VALID_TRANSITIONS,
  InteractionType,
  INTERACTION_LIMITS,
  CreateInteractionDto,
  StageHistoryEntry,
  InteractionRecord,
} from './dto/crm.dto';

/**
 * CRM Lead Lifecycle Management (Requirement 5)
 *
 * - Manages lead status transitions with validation (Req 5.1, 5.6)
 * - Records append-only stage history (Req 5.2)
 * - Records all interactions (calls, WhatsApp, emails, notes, tasks) (Req 5.3, 5.4)
 * - Validates content length per interaction type (Req 5.7)
 */
@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly repository: CrmRepository) {}

  /**
   * Transition a lead to a new status (Req 5.1, 5.6)
   * Only logically adjacent transitions are allowed.
   */
  async transitionLeadStatus(
    leadId: string,
    newStatus: LeadStatus,
    changedBy: string,
  ): Promise<{ success: boolean; previousStatus: string; newStatus: string }> {
    // 1. Get current lead
    const lead = await this.repository.getLeadById(leadId);
    if (!lead) {
      throw new BadRequestException(`Lead not found: ${leadId}`);
    }

    const currentStatus = lead.status;

    // 2. Validate transition (Req 5.6)
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`,
      );
    }

    // 3. Update status
    await this.repository.updateLeadStatus(leadId, newStatus);

    // 4. Record stage history — append-only (Req 5.2)
    const historyEntry: StageHistoryEntry = {
      previousStatus: currentStatus,
      newStatus,
      changedBy,
      timestamp: new Date().toISOString(),
    };
    await this.repository.appendStageHistory(leadId, historyEntry);

    this.logger.log(`Lead ${leadId}: ${currentStatus} → ${newStatus} by ${changedBy}`);

    return { success: true, previousStatus: currentStatus, newStatus };
  }

  /**
   * Log an interaction against a lead (Req 5.3, 5.4, 5.7)
   */
  async logInteraction(
    leadId: string,
    dto: CreateInteractionDto,
    createdBy: string,
  ): Promise<InteractionRecord> {
    // 1. Validate content length per type (Req 5.7)
    const limits = INTERACTION_LIMITS[dto.type];
    if (dto.content.length > limits.content) {
      throw new BadRequestException(
        `Content for ${dto.type} must not exceed ${limits.content} characters (received ${dto.content.length})`,
      );
    }
    if (dto.type === InteractionType.EMAIL && dto.subject && limits.subject && dto.subject.length > limits.subject) {
      throw new BadRequestException(
        `Subject for email must not exceed ${limits.subject} characters (received ${dto.subject.length})`,
      );
    }

    // 2. Verify lead exists
    const lead = await this.repository.getLeadById(leadId);
    if (!lead) {
      throw new BadRequestException(`Lead not found: ${leadId}`);
    }

    // 3. Create interaction record (Req 5.4 — persist within 3 seconds)
    const interaction = await this.repository.createInteraction({
      leadId,
      type: dto.type,
      content: dto.content,
      subject: dto.subject,
      durationSeconds: dto.durationSeconds,
      direction: dto.direction,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      assigneeId: dto.assigneeId,
      createdBy,
    });

    // 4. Update lastInteractionAt on lead
    await this.repository.updateLastInteraction(leadId);

    this.logger.log(`Interaction logged: lead=${leadId} type=${dto.type} by=${createdBy}`);

    return interaction;
  }

  /**
   * Get interaction history for a lead, sorted by timestamp desc (Req 5.4)
   */
  async getInteractionHistory(leadId: string, limit = 50, offset = 0): Promise<InteractionRecord[]> {
    return this.repository.getInteractionsByLeadId(leadId, limit, offset);
  }

  /**
   * Get stage history for a lead (append-only audit trail)
   */
  async getStageHistory(leadId: string): Promise<StageHistoryEntry[]> {
    return this.repository.getStageHistory(leadId);
  }

  /**
   * Get leads with no interaction in last 24 hours for reminder (Req 5.5)
   */
  async getStaleLeads(hoursThreshold = 24): Promise<Array<{ leadId: string; assignedTo: string; hoursSinceInteraction: number }>> {
    return this.repository.getLeadsWithNoRecentInteraction(hoursThreshold);
  }
}
