import { Module } from '@nestjs/common';

import { LeadAcquisitionController } from './lead-acquisition.controller';
import { LeadAcquisitionService } from './lead-acquisition.service';
import { LeadAcquisitionRepository } from './repositories/lead-acquisition.repository';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [LeadAcquisitionController],
  providers: [LeadAcquisitionService, LeadAcquisitionRepository],
  exports: [LeadAcquisitionService, LeadAcquisitionRepository],
})
export class LeadAcquisitionModule {}
