import { Injectable, Logger } from '@nestjs/common';

import { LeadAssignmentRepository } from './repositories/lead-assignment.repository';
import { NotificationService } from '../notifications/notification.service';
import { AssignmentResult, ExecutiveCandidate } from './dto/assignment.dto';

/**
 * Lead Assignment Engine (Requirement 4)
 *
 * Distributes leads to Sales Executives using priority-based matching:
 * 1. Geographic specialization matching the lead's city
 * 2. Product expertise matching the lead's product interest
 * 3. Current workload (lowest active lead count)
 * 4. Least recently assigned (round-robin tiebreaker)
 *
 * If no executive is available → queue + escalation to manager.
 */

// Map opportunity categories to product expertise tags
const CATEGORY_TO_PRODUCT: Record<string, string> = {
  used_car_buyer: 'used_car_loan',
  refinance_opportunity: 'refinance_loan',
  balance_transfer_opportunity: 'balance_transfer',
  top_up_opportunity: 'top_up_loan',
  loan_against_vehicle: 'loan_against_vehicle',
};

@Injectable()
export class LeadAssignmentService {
  private readonly logger = new Logger(LeadAssignmentService.name);

  // In-memory unassigned queue (in production: use Redis or DB table)
  private unassignedQueue: Map<string, { queuedAt: Date; escalationCount: number; lastEscalatedAt: Date | null }> = new Map();

  constructor(
    private readonly repository: LeadAssignmentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Assign a lead to the best-fit available executive (Req 4.1, 4.2)
   * Must complete within 60 seconds of lead scoring.
   */
  async assignLead(leadId: string): Promise<AssignmentResult> {
    // 1. Get lead context
    const lead = await this.repository.getLeadForAssignment(leadId);
    if (!lead) {
      return { leadId, assignedTo: null, executiveName: null, assignedAt: null, method: 'queued', reason: 'Lead not found' };
    }

    // Already assigned?
    if (lead.assignedTo) {
      return { leadId, assignedTo: lead.assignedTo, executiveName: null, assignedAt: null, method: 'manual', reason: 'Already assigned' };
    }

    // 2. Get available executives
    const candidates = await this.repository.getAvailableExecutives();

    if (candidates.length === 0) {
      // Req 4.4: No executive available → queue + notify manager
      return this.queueLead(leadId);
    }

    // 3. Select best candidate using priority rules (Req 4.2)
    const leadCity = lead.customerCity?.toLowerCase() || '';
    const leadProduct = lead.opportunityCategory ? CATEGORY_TO_PRODUCT[lead.opportunityCategory] : '';

    const selected = this.selectBestCandidate(candidates, leadCity, leadProduct);

    // 4. Assign (Req 4.1 — within 60 seconds)
    const assignment = await this.repository.assignLead(leadId, selected.id);

    // 5. Send notification to executive (Req 4.3 — within 30 seconds)
    this.sendAssignmentNotification(selected, leadId).catch((err) => {
      this.logger.error(`Assignment notification failed: ${err}`);
    });

    // Remove from queue if it was queued
    this.unassignedQueue.delete(leadId);

    this.logger.log(
      `Lead ${leadId} assigned to ${selected.fullName} (city match: ${leadCity === selected.city?.toLowerCase()}, product match: ${selected.productExpertise.includes(leadProduct)}, workload: ${selected.activeLeadCount})`,
    );

    return {
      leadId,
      assignedTo: selected.id,
      executiveName: selected.fullName,
      assignedAt: assignment.assignedAt.toISOString(),
      method: 'auto',
      reason: 'Assigned by priority algorithm',
    };
  }

  /**
   * Priority-based selection (Req 4.2):
   * 1. Geographic specialization
   * 2. Product expertise
   * 3. Lowest current workload
   * 4. Least recently assigned
   */
  private selectBestCandidate(
    candidates: ExecutiveCandidate[],
    leadCity: string,
    leadProduct: string,
  ): ExecutiveCandidate {
    // Score each candidate
    const scored = candidates.map((c) => {
      let score = 0;

      // Priority 1: Geographic match (highest weight)
      if (leadCity && c.city?.toLowerCase() === leadCity) {
        score += 1000;
      }

      // Priority 2: Product expertise match
      if (leadProduct && c.productExpertise.includes(leadProduct)) {
        score += 100;
      }

      // Priority 3: Lowest workload (inverse — fewer leads = higher score)
      score += (c.maxActiveLeads - c.activeLeadCount);

      // Priority 4: Least recently assigned (older = higher priority)
      if (c.lastAssignmentAt) {
        const hoursSinceLastAssignment = (Date.now() - c.lastAssignmentAt.getTime()) / (1000 * 60 * 60);
        score += Math.min(10, hoursSinceLastAssignment);
      } else {
        score += 10; // Never assigned = highest priority for tiebreak
      }

      return { candidate: c, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored[0].candidate;
  }

  /**
   * Queue lead when no executive is available (Req 4.4, 4.6)
   */
  private async queueLead(leadId: string): Promise<AssignmentResult> {
    this.unassignedQueue.set(leadId, {
      queuedAt: new Date(),
      escalationCount: 0,
      lastEscalatedAt: null,
    });

    // Notify sales manager within 60 seconds (Req 4.4)
    this.escalateToManager(leadId).catch((err) => {
      this.logger.error(`Escalation failed: ${err}`);
    });

    this.logger.warn(`Lead ${leadId} queued — no available executives`);

    return {
      leadId,
      assignedTo: null,
      executiveName: null,
      assignedAt: null,
      method: 'queued',
      reason: 'No available executives. Lead queued for assignment. Sales manager notified.',
    };
  }

  /**
   * Escalate unassigned lead to sales manager (Req 4.4, 4.6)
   */
  private async escalateToManager(leadId: string): Promise<void> {
    const managers = await this.repository.getSalesManagers();

    for (const manager of managers) {
      await this.notificationService.sendLeadWelcomeNotification({
        name: manager.fullName,
        mobile: manager.phone || '',
        leadId,
        monthlySaving: undefined,
        recommendedBank: undefined,
      });
    }

    const queueEntry = this.unassignedQueue.get(leadId);
    if (queueEntry) {
      queueEntry.escalationCount += 1;
      queueEntry.lastEscalatedAt = new Date();
    }
  }

  /**
   * Process unassigned queue — called periodically (Req 4.6: every 15 minutes)
   * In production: use a cron job or n8n workflow.
   */
  async processUnassignedQueue(): Promise<void> {
    const now = Date.now();

    for (const [leadId, entry] of this.unassignedQueue.entries()) {
      const minutesInQueue = (now - entry.queuedAt.getTime()) / (1000 * 60);

      // Re-escalate every 15 minutes (Req 4.6)
      if (minutesInQueue > 15) {
        const minutesSinceEscalation = entry.lastEscalatedAt
          ? (now - entry.lastEscalatedAt.getTime()) / (1000 * 60)
          : Infinity;

        if (minutesSinceEscalation >= 15) {
          this.logger.warn(`Lead ${leadId} in queue for ${Math.round(minutesInQueue)} min — re-escalating`);
          await this.escalateToManager(leadId);
        }
      }

      // Try to assign again
      const candidates = await this.repository.getAvailableExecutives();
      if (candidates.length > 0) {
        await this.assignLead(leadId);
      }
    }
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): { queueSize: number; entries: Array<{ leadId: string; minutesInQueue: number }> } {
    const now = Date.now();
    const entries = Array.from(this.unassignedQueue.entries()).map(([leadId, entry]) => ({
      leadId,
      minutesInQueue: Math.round((now - entry.queuedAt.getTime()) / (1000 * 60)),
    }));

    return { queueSize: this.unassignedQueue.size, entries };
  }

  private async sendAssignmentNotification(executive: ExecutiveCandidate, leadId: string): Promise<void> {
    // Req 4.3: Notify assigned executive via platform + WhatsApp within 30 seconds
    await this.notificationService.sendLeadWelcomeNotification({
      name: executive.fullName,
      mobile: '',
      leadId,
      monthlySaving: undefined,
      recommendedBank: undefined,
    });
  }
}
