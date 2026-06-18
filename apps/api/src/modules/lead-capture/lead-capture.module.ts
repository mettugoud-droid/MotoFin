import { Module } from '@nestjs/common';

import { LeadCaptureController } from './lead-capture.controller';
import { LeadCaptureService } from './lead-capture.service';
import { LeadRepository } from './repositories/lead.repository';
import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';

@Module({
  controllers: [LeadCaptureController],
  providers: [LeadCaptureService, LeadRepository, SavingsCalculationRepository],
  exports: [LeadCaptureService, LeadRepository],
})
export class LeadCaptureModule {}
