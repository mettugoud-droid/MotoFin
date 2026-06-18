import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';

import { DocumentManagementService } from './document-management.service';
import { UploadDocumentDto, DocumentType } from './dto/document.dto';

@ApiTags('Documents')
@Controller('v1/documents')
export class DocumentManagementController {
  constructor(private readonly documentService: DocumentManagementService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a document for a lead' })
  @ApiResponse({ status: 201, description: 'Document uploaded and processing started' })
  @ApiResponse({ status: 400, description: 'Validation error (type, format, or size)' })
  async uploadDocument(@Body() dto: UploadDocumentDto & { fileName?: string; fileSize?: number; mimeType?: string; fileBase64?: string }) {
    // In production: use @UploadedFile() with Multer
    // For MVP: accept metadata + base64 in body
    const fileName = dto.fileName || 'document.pdf';
    const fileSize = dto.fileSize || 1024;
    const mimeType = dto.mimeType || 'application/pdf';
    const buffer = dto.fileBase64 ? Buffer.from(dto.fileBase64, 'base64') : Buffer.alloc(fileSize);

    const result = await this.documentService.uploadDocument(
      dto.leadId,
      dto.documentType,
      { originalName: fileName, mimeType, size: fileSize, buffer },
      dto.loanProductCode,
    );

    return {
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get all documents for a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Documents returned' })
  async getDocumentsForLead(@Param('leadId') leadId: string) {
    const documents = await this.documentService.getDocumentsForLead(leadId);

    return {
      success: true,
      data: documents,
      meta: { count: documents.length, timestamp: new Date().toISOString() },
    };
  }

  @Get('lead/:leadId/completeness')
  @ApiOperation({ summary: 'Check document completeness for a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  async checkCompleteness(@Param('leadId') leadId: string) {
    const isComplete = await this.documentService.checkDocumentCompleteness(leadId);

    return {
      success: true,
      data: { isComplete },
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get documents expiring within 30 days' })
  @ApiResponse({ status: 200, description: 'Expiring documents returned' })
  async getExpiringDocuments() {
    const expiring = await this.documentService.checkExpiringDocuments();

    return {
      success: true,
      data: expiring,
      meta: { count: expiring.length, timestamp: new Date().toISOString() },
    };
  }
}
