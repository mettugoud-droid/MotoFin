import { Module } from '@nestjs/common';

import { DocumentManagementController } from './document-management.controller';
import { DocumentManagementService } from './document-management.service';
import { DocumentManagementRepository } from './repositories/document-management.repository';

@Module({
  controllers: [DocumentManagementController],
  providers: [DocumentManagementService, DocumentManagementRepository],
  exports: [DocumentManagementService],
})
export class DocumentManagementModule {}
