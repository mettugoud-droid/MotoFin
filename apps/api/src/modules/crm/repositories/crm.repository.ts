import { Injectable } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { InteractionType, StageHistoryEntry, InteractionRecord } from '../dto/crm.dto';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface CreateInteractionData {
  leadId: string;
  type: InteractionType;
  content: string;
  subject?: string;
  durationSeconds?: number;
  direction?: string;
  dueDate?: Date;
  assigneeId?: string;
  createdBy: string;
}

@Injectable()
export class CrmRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLeadById(leadId: string) {
    return this.prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, status: true, assignedTo: true, matchedSignals: true },
    });
  }

  async updateLeadStatus(leadId: string, status: LeadStatus) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
  }

  /**
   * Append stage history to the lead's matchedSignals JSON (append-only).
   * In production: use a dedicated lead_stage_history table.
   */
  async appendStageHistory(leadId: string, entry: StageHistoryEntry) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return;

    const existing = (lead.matchedSignals as unknown[]) || [];
    const updated = [...existing, { type: 'stage_change', ...entry }];

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { matchedSignals: updated as any },
    });
  }

  async getStageHistory(leadId: string): Promise<StageHistoryEntry[]> {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return [];

    const signals = (lead.matchedSignals as any[]) || [];
    return signals
      .filter((s) => s.type === 'stage_change')
      .map((s) => ({
        previousStatus: s.previousStatus,
        newStatus: s.newStatus,
        changedBy: s.changedBy,
        timestamp: s.timestamp,
      }));
  }

  /**
   * Create an interaction record.
   * Stored in lead's matchedSignals JSON for MVP.
   * In production: use a dedicated activities table.
   */
  async createInteraction(data: CreateInteractionData): Promise<InteractionRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: InteractionRecord = {
      id,
      leadId: data.leadId,
      type: data.type,
      content: data.content,
      subject: data.subject,
      durationSeconds: data.durationSeconds,
      direction: data.direction,
      dueDate: data.dueDate?.toISOString(),
      assigneeId: data.assigneeId,
      isComplete: false,
      createdBy: data.createdBy,
      createdAt: now,
    };

    const lead = await this.prisma.lead.findUnique({ where: { id: data.leadId } });
    if (!lead) return record;

    const existing = (lead.matchedSignals as any[]) || [];
    const updated = [...existing, { entryType: 'interaction', ...record }];

    await this.prisma.lead.update({
      where: { id: data.leadId },
      data: { matchedSignals: updated as any },
    });

    return record;
  }

  /**
   * Get interactions sorted by timestamp descending (Req 5.4)
   */
  async getInteractionsByLeadId(leadId: string, limit: number, offset: number): Promise<InteractionRecord[]> {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return [];

    const signals = (lead.matchedSignals as any[]) || [];
    return signals
      .filter((s) => s.entryType === 'interaction')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
      .map((s) => ({
        id: s.id,
        leadId: s.leadId,
        type: s.type === 'interaction' ? s.type : s.type,
        content: s.content,
        subject: s.subject,
        durationSeconds: s.durationSeconds,
        direction: s.direction,
        dueDate: s.dueDate,
        assigneeId: s.assigneeId,
        isComplete: s.isComplete,
        createdBy: s.createdBy,
        createdAt: s.createdAt,
      }));
  }

  async updateLastInteraction(leadId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { lastInteractionAt: new Date() },
    });
  }

  /**
   * Find leads with no interaction in the last N hours (Req 5.5)
   */
  async getLeadsWithNoRecentInteraction(hoursThreshold: number): Promise<Array<{ leadId: string; assignedTo: string; hoursSinceInteraction: number }>> {
    const cutoff = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);

    const staleLeads = await this.prisma.lead.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        assignedTo: { not: null },
        status: { notIn: ['DISBURSED', 'REJECTED', 'CLOSED', 'ALL_REJECTED'] },
        deletedAt: null,
        OR: [
          { lastInteractionAt: null, assignedAt: { lt: cutoff } },
          { lastInteractionAt: { lt: cutoff } },
        ],
      },
      select: {
        id: true,
        assignedTo: true,
        lastInteractionAt: true,
        assignedAt: true,
      },
      take: 100,
    });

    return staleLeads.map((lead) => {
      const lastActivity = lead.lastInteractionAt || lead.assignedAt || new Date();
      const hours = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);
      return {
        leadId: lead.id,
        assignedTo: lead.assignedTo!,
        hoursSinceInteraction: Math.round(hours),
      };
    });
  }
}
