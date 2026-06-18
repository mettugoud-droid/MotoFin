import { Module } from '@nestjs/common';

import { SavingsCalculatorController } from './savings-calculator.controller';
import { SavingsCalculatorService } from './savings-calculator.service';
import { SavingsCalculationRepository } from './repositories/savings-calculation.repository';

@Module({
  controllers: [SavingsCalculatorController],
  providers: [SavingsCalculatorService, SavingsCalculationRepository],
  exports: [SavingsCalculatorService],
})
export class SavingsCalculatorModule {}
