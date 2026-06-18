import { Module, Global } from '@nestjs/common';

import { EmiCalculatorService } from './services/emi-calculator.service';
import { BankRatesService } from './services/bank-rates.service';
import { VehicleValuationService } from './services/vehicle-valuation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [EmiCalculatorService, BankRatesService, VehicleValuationService],
  exports: [EmiCalculatorService, BankRatesService, VehicleValuationService],
})
export class SharedModule {}
