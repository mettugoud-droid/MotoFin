import { Module } from '@nestjs/common';

import { PreApprovalController } from './pre-approval.controller';
import { PreApprovalService } from './pre-approval.service';
import { PreApprovalRepository } from './repositories/pre-approval.repository';
import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';

@Module({
  controllers: [PreApprovalController],
  providers: [PreApprovalService, PreApprovalRepository, SavingsCalculationRepository],
  exports: [PreApprovalService],
})
export class PreApprovalModule {}
