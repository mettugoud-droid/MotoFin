import { Module } from '@nestjs/common';

import { ForeclosureCalculatorController } from './foreclosure-calculator.controller';
import { ForeclosureCalculatorService } from './foreclosure-calculator.service';
import { ForeclosureCalculationRepository } from './repositories/foreclosure-calculation.repository';

@Module({
  controllers: [ForeclosureCalculatorController],
  providers: [ForeclosureCalculatorService, ForeclosureCalculationRepository],
  exports: [ForeclosureCalculatorService, ForeclosureCalculationRepository],
})
export class ForeclosureCalculatorModule {}
