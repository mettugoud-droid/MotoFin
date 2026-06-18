import { Module } from '@nestjs/common';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './repositories/application.repository';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService],
})
export class ApplicationModule {}
