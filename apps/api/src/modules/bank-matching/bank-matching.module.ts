import { Module } from '@nestjs/common';

import { BankMatchingController } from './bank-matching.controller';
import { BankMatchingService } from './bank-matching.service';
import { BankMatchingRepository } from './repositories/bank-matching.repository';

@Module({
  controllers: [BankMatchingController],
  providers: [BankMatchingService, BankMatchingRepository],
  exports: [BankMatchingService],
})
export class BankMatchingModule {}
