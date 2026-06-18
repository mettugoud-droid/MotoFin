import { Injectable } from '@nestjs/common';
import { OpportunityCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

import { ScoreHistoryEntry } from '../dto/opportunity.dto';

@Injectable()
export class OpportunityDetectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateLeadOpportunity(
    leadId: string,
    data: { opportunityCategory: OpportunityCategory; matchedSignals: string[] },
  ) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        opportunityCategory: data.opportunityCategory,
        matchedSignals: data.matchedSignals as any,
      },
    });
  }

  async updateLeadScore(leadId: string, score: number, isPartial: boolean) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        opportunityScore: score,
        scoreIsPartial: isPartial,
      },
    });
  }

  /**
   * Append score change to lead's matched_signals as history.
   * In production, this would be a separate lead_score_history table.
   * For now, storing in the matchedSignals JSON field.
   */
  async appendScoreHistory(leadId: string, entry: ScoreHistoryEntry) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return;

    const existingSignals = (lead.matchedSignals as unknown[]) || [];
    const updatedSignals = [
      ...existingSignals,
      { type: 'score_change', ...entry },
    ];

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        matchedSignals: updatedSignals as any,
      },
    });
  }

  async getLeadById(leadId: string) {
    return this.prisma.lead.findUnique({ where: { id: leadId } });
  }
}
