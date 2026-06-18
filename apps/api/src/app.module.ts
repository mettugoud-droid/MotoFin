import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SharedModule } from './modules/shared/shared.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { SavingsCalculatorModule } from './modules/savings-calculator/savings-calculator.module';
import { LeadCaptureModule } from './modules/lead-capture/lead-capture.module';
import { PreApprovalModule } from './modules/pre-approval/pre-approval.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { abortEarly: false },
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    PrismaModule,
    SharedModule,
    NotificationModule,
    HealthModule,
    SavingsCalculatorModule,
    LeadCaptureModule,
    PreApprovalModule,
  ],
})
export class AppModule {}
