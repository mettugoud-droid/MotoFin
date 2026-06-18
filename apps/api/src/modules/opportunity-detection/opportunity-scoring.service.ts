import { Injectable, Logger } from '@nestjs/common';

import { OpportunityScoringResult, ScoreHistoryEntry } from './dto/opportunity.dto';
import { OpportunityDetectionRepository } from './repositories/opportunity-detection.repository';

/**
 * Opportunity Scoring Engine (Requirement 3)
 *
 * Score formula:
 * score = round(0.30 * signal_strength + 0.25 * lead_completeness + 0.25 * recency + 0.20 * historical_patterns)
 *
 * If a factor is unavailable, weight = 0, remaining weights renormalize to 1.0.
 * Score flagged as "Partial" if any factor is unavailable.
 *
 * Category:
 * - Hot: 76–100
 * - Warm: 41–75
 * - Cold: 0–40
 */

interface ScoringInput {
  // Signal strength factors
  signalCount: number;          // Number of engagement signals
  hasCallbackRequest: boolean;
  hasDocumentUpload: boolean;
  hasInquirySubmission: boolean;

  // Lead completeness factors
  hasName: boolean;
  hasContact: boolean;
  hasVehiclePreference: boolean;
  hasIncomeRange: boolean;
  hasEmploymentStatus: boolean;

  // Recency
  lastEngagementAt: Date | null;

  // Historical patterns (optional — may not be available)
  historicalConversionRate: number | null; // 0-100
}

const WEIGHTS = {
  signalStrength: 0.30,
  leadCompleteness: 0.25,
  recency: 0.25,
  historicalPatterns: 0.20,
};

@Injectable()
export class OpportunityScoringService {
  private readonly logger = new Logger(OpportunityScoringService.name);

  constructor(private readonly repository: OpportunityDetectionRepository) {}

  /**
   * Calculate Opportunity Score (Req 3.1, 3.2, 3.3, 3.5)
   */
  calculateScore(input: ScoringInput): OpportunityScoringResult {
    const factors: Record<string, number | null> = {};
    const availableWeights: Record<string, number> = {};

    // Factor 1: Signal Strength (0-100)
    const signalStrength = this.calculateSignalStrength(input);
    factors.signalStrength = signalStrength;
    availableWeights.signalStrength = WEIGHTS.signalStrength;

    // Factor 2: Lead Completeness (0-100)
    const leadCompleteness = this.calculateLeadCompleteness(input);
    factors.leadCompleteness = leadCompleteness;
    availableWeights.leadCompleteness = WEIGHTS.leadCompleteness;

    // Factor 3: Recency (0-100)
    let recency: number | null = null;
    if (input.lastEngagementAt) {
      recency = this.calculateRecency(input.lastEngagementAt);
      factors.recency = recency;
      availableWeights.recency = WEIGHTS.recency;
    } else {
      factors.recency = null;
    }

    // Factor 4: Historical Patterns (0-100)
    let historicalPatterns: number | null = null;
    if (input.historicalConversionRate !== null && input.historicalConversionRate !== undefined) {
      historicalPatterns = input.historicalConversionRate;
      factors.historicalPatterns = historicalPatterns;
      availableWeights.historicalPatterns = WEIGHTS.historicalPatterns;
    } else {
      factors.historicalPatterns = null;
    }

    // Determine if partial (Req 3.5)
    const isPartial = factors.recency === null || factors.historicalPatterns === null;

    // Renormalize weights if some factors unavailable
    const totalWeight = Object.values(availableWeights).reduce((sum, w) => sum + w, 0);

    let score = 0;
    if (totalWeight > 0) {
      if (factors.signalStrength !== null) {
        score += (availableWeights.signalStrength / totalWeight) * factors.signalStrength;
      }
      if (factors.leadCompleteness !== null) {
        score += (availableWeights.leadCompleteness / totalWeight) * factors.leadCompleteness;
      }
      if (factors.recency !== null) {
        score += (availableWeights.recency / totalWeight) * factors.recency;
      }
      if (factors.historicalPatterns !== null) {
        score += (availableWeights.historicalPatterns / totalWeight) * factors.historicalPatterns;
      }
    }

    // Round to integer in range [0, 100] (Req 3.1)
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Classify category (Req 3.2)
    const category = this.classifyCategory(finalScore);

    return {
      score: finalScore,
      category,
      isPartial,
      factors: {
        signalStrength: factors.signalStrength as number | null,
        leadCompleteness: factors.leadCompleteness as number | null,
        recency: factors.recency as number | null,
        historicalPatterns: factors.historicalPatterns as number | null,
      },
    };
  }

  /**
   * Score and update a lead, recording history if category changes (Req 3.4, 3.6)
   */
  async scoreAndUpdateLead(
    leadId: string,
    input: ScoringInput,
    previousScore?: number,
    previousCategory?: string,
  ): Promise<OpportunityScoringResult> {
    const result = this.calculateScore(input);

    // Update lead with new score
    await this.repository.updateLeadScore(leadId, result.score, result.isPartial);

    // Req 3.6: Record history if category changed
    if (previousCategory && previousCategory !== result.category) {
      const historyEntry: ScoreHistoryEntry = {
        previousCategory,
        newCategory: result.category,
        previousScore: previousScore || 0,
        newScore: result.score,
        timestamp: new Date().toISOString(),
      };
      await this.repository.appendScoreHistory(leadId, historyEntry);

      this.logger.log(
        `Score category changed: lead=${leadId} ${previousCategory}(${previousScore}) → ${result.category}(${result.score})`,
      );
    }

    return result;
  }

  private calculateSignalStrength(input: ScoringInput): number {
    let score = 0;
    const maxSignals = 5;

    // Base signal count (each signal = 15 points, max 60)
    score += Math.min(60, input.signalCount * 15);

    // Specific high-value signals
    if (input.hasCallbackRequest) score += 20;
    if (input.hasDocumentUpload) score += 15;
    if (input.hasInquirySubmission) score += 10;

    return Math.min(100, score);
  }

  private calculateLeadCompleteness(input: ScoringInput): number {
    const fields = [
      input.hasName,
      input.hasContact,
      input.hasVehiclePreference,
      input.hasIncomeRange,
      input.hasEmploymentStatus,
    ];

    const completed = fields.filter(Boolean).length;
    return (completed / fields.length) * 100;
  }

  private calculateRecency(lastEngagement: Date): number {
    const now = new Date();
    const hoursElapsed = (now.getTime() - lastEngagement.getTime()) / (1000 * 60 * 60);

    // Within 48 hours = maximum weight (Req 3.3)
    if (hoursElapsed <= 48) return 100;
    // 48h to 7 days = linear decline
    if (hoursElapsed <= 168) return Math.round(100 - ((hoursElapsed - 48) / 120) * 50);
    // 7 to 30 days = lower
    if (hoursElapsed <= 720) return Math.round(50 - ((hoursElapsed - 168) / 552) * 40);
    // > 30 days = minimum weight
    return 10;
  }

  private classifyCategory(score: number): 'Hot' | 'Warm' | 'Cold' {
    if (score >= 76) return 'Hot';
    if (score >= 41) return 'Warm';
    return 'Cold';
  }
}
