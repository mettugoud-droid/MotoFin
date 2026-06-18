import { Module } from '@nestjs/common';

import { LeadAssignmentService } from './lead-assignment.service';
import { LeadAssignmentRepository } from './repositories/lead-assignment.repository';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [LeadAssignmentService, LeadAssignmentRepository],
  exports: [LeadAssignmentService],
})
export class LeadAssignmentModule {}
