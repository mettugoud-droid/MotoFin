import { Module } from '@nestjs/common';

import { OpportunityDetectionService } from './opportunity-detection.service';
import { OpportunityScoringService } from './opportunity-scoring.service';
import { OpportunityDetectionRepository } from './repositories/opportunity-detection.repository';

@Module({
  providers: [OpportunityDetectionService, OpportunityScoringService, OpportunityDetectionRepository],
  exports: [OpportunityDetectionService, OpportunityScoringService],
})
export class OpportunityDetectionModule {}
