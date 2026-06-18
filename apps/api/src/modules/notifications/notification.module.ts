import { Module, Global } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { ConsoleNotificationProvider } from './providers/console-notification.provider';
import { NOTIFICATION_PROVIDER } from './providers/notification-provider.interface';

@Global()
@Module({
  providers: [
    NotificationService,
    {
      provide: NOTIFICATION_PROVIDER,
      useClass: ConsoleNotificationProvider,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
