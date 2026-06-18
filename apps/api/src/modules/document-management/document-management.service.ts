import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import { DocumentManagementRepository } from './repositories/document-management.repository';
import {
  DocumentType,
  DocumentStatus,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  OCR_VALIDATION_PATTERNS,
  REQUIRED_DOCUMENTS_BY_PRODUCT,
  OcrExtractedData,
  DocumentRecord,
  DocumentValidationResult,
} from './dto/document.dto';

/**
 * Document Management Module (Requirement 6)
 *
 * - Upload validation: type, format (JPEG/PNG/PDF), size <= 10MB (Req 6.1)
 * - OCR processing via Google Vision (mocked for MVP) (Req 6.2)
 * - Auto-validation of extracted data (PAN, Aadhaar, dates) (Req 6.3)
 * - Failure notification to customer + executive (Req 6.4)
 * - OCR failure handling with manual fallback (Req 6.5)
 * - Encrypted storage with role-based access (Req 6.6)
 * - Expiry alert within 30 days of bank submission (Req 6.7)
 * - Auto-transition to DOCS_RECEIVED when all required docs verified (Req 6.8)
 */
@Injectable()
export class DocumentManagementService {
  private readonly logger = new Logger(DocumentManagementService.name);

  constructor(private readonly repository: DocumentManagementRepository) {}

  /**
   * Upload and process a document (Req 6.1, 6.2, 6.3)
   */
  async uploadDocument(
    leadId: string,
    documentType: DocumentType,
    file: { originalName: string; mimeType: string; size: number; buffer: Buffer },
    loanProductCode?: string,
  ): Promise<DocumentRecord> {
    // 1. Validate file format (Req 6.1)
    if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      throw new BadRequestException(
        `File format not supported. Allowed: JPEG, PNG, PDF. Received: ${file.mimeType}`,
      );
    }

    // 2. Validate file size (Req 6.1 — max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File size exceeds 10 MB limit. Received: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      );
    }

    // 3. Store document (Req 6.6 — encrypted storage)
    const storagePath = `documents/${leadId}/${documentType}/${Date.now()}_${file.originalName}`;
    // In production: upload to Supabase Storage encrypted bucket
    // For MVP: store path reference

    const docRecord = await this.repository.createDocument({
      leadId,
      documentType,
      fileName: file.originalName,
      fileSize: file.size,
      mimeType: file.mimeType,
      storagePath,
      status: DocumentStatus.PROCESSING,
    });

    // 4. Process OCR (Req 6.2 — within 30 seconds)
    // In production: enqueue BullMQ job for Google Vision
    // For MVP: simulate OCR extraction
    this.processOcr(docRecord.id, documentType, file.buffer).catch((err) => {
      this.logger.error(`OCR processing failed for doc ${docRecord.id}: ${err}`);
    });

    this.logger.log(`Document uploaded: ${documentType} for lead ${leadId} (${file.originalName}, ${file.size} bytes)`);

    return docRecord;
  }

  /**
   * Process OCR and validate extracted data (Req 6.2, 6.3, 6.4, 6.5)
   */
  private async processOcr(documentId: string, documentType: DocumentType, buffer: Buffer): Promise<void> {
    try {
      // Simulate OCR extraction (in production: call Google Vision API)
      const extractedData = await this.simulateOcrExtraction(documentType, buffer);

      if (!extractedData) {
        // Req 6.5: OCR failed — mark and notify
        await this.repository.updateDocumentStatus(documentId, DocumentStatus.OCR_FAILED, null, ['OCR extraction failed']);
        this.logger.warn(`OCR failed for document ${documentId}`);
        // TODO: Notify assigned sales executive
        return;
      }

      // Validate extracted data (Req 6.3)
      const validationResult = this.validateExtractedData(documentType, extractedData);

      if (!validationResult.isValid) {
        // Req 6.4: Validation failed — notify customer and executive
        const errorMessages = validationResult.errors.map(
          (e) => `${e.field}: expected ${e.expected}, received "${e.received}"`,
        );
        await this.repository.updateDocumentStatus(documentId, DocumentStatus.FAILED, extractedData, errorMessages);
        this.logger.warn(`Document validation failed: ${documentId} — ${errorMessages.join('; ')}`);
        // TODO: Send notification to customer + executive within 5 minutes
        return;
      }

      // Success — mark as verified
      await this.repository.updateDocumentStatus(documentId, DocumentStatus.VERIFIED, extractedData, []);

      // Check if all required documents are now complete (Req 6.8)
      const doc = await this.repository.getDocumentById(documentId);
      if (doc) {
        await this.checkDocumentCompleteness(doc.leadId, doc.loanProductCode);
      }

      this.logger.log(`Document ${documentId} verified successfully`);
    } catch (error) {
      await this.repository.updateDocumentStatus(documentId, DocumentStatus.OCR_FAILED, null, ['Unexpected OCR error']);
      this.logger.error(`OCR processing error: ${error}`);
    }
  }

  /**
   * Validate OCR-extracted data against expected formats (Req 6.3)
   */
  validateExtractedData(documentType: DocumentType, data: OcrExtractedData): DocumentValidationResult {
    const patterns = OCR_VALIDATION_PATTERNS[documentType];
    if (!patterns) return { isValid: true, errors: [] };

    const errors: Array<{ field: string; expected: string; received: string }> = [];

    for (const { field, pattern, description } of patterns) {
      const value = (data as Record<string, unknown>)[field] as string;
      if (value && !pattern.test(value)) {
        errors.push({ field, expected: description, received: value });
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Check if all required documents for a loan product are verified (Req 6.8)
   * If complete → update lead status to DOCS_RECEIVED within 60 seconds.
   */
  async checkDocumentCompleteness(leadId: string, loanProductCode?: string | null): Promise<boolean> {
    const productCode = loanProductCode || 'refinance_loan';
    const requiredDocs = REQUIRED_DOCUMENTS_BY_PRODUCT[productCode] || [];

    if (requiredDocs.length === 0) return false;

    const verifiedDocs = await this.repository.getVerifiedDocumentsForLead(leadId);
    const verifiedTypes = new Set(verifiedDocs.map((d) => d.documentType));

    const allComplete = requiredDocs.every((req) => verifiedTypes.has(req));

    if (allComplete) {
      // Req 6.8: Update lead status to DOCS_RECEIVED
      await this.repository.updateLeadStatus(leadId, 'DOCS_RECEIVED');
      this.logger.log(`All documents verified for lead ${leadId} — status → DOCS_RECEIVED`);
    }

    return allComplete;
  }

  /**
   * Check for documents expiring within 30 days (Req 6.7)
   */
  async checkExpiringDocuments(): Promise<Array<{ documentId: string; leadId: string; documentType: string; expiryDate: string; daysUntilExpiry: number }>> {
    return this.repository.getDocumentsExpiringWithin(30);
  }

  /**
   * Get all documents for a lead
   */
  async getDocumentsForLead(leadId: string): Promise<DocumentRecord[]> {
    return this.repository.getDocumentsByLeadId(leadId);
  }

  /**
   * Simulate OCR extraction (replace with Google Vision in production)
   */
  private async simulateOcrExtraction(documentType: DocumentType, buffer: Buffer): Promise<OcrExtractedData | null> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return simulated data based on document type
    switch (documentType) {
      case DocumentType.PAN_CARD:
        return { holderName: 'Extracted Name', panNumber: 'ABCDE1234F', documentNumber: 'ABCDE1234F' };
      case DocumentType.AADHAAR_CARD:
        return { holderName: 'Extracted Name', aadhaarNumber: '123456789012', documentNumber: '123456789012' };
      case DocumentType.REGISTRATION_CERTIFICATE:
        return { ownerName: 'Extracted Owner', registrationNumber: 'TS09AB1234' };
      case DocumentType.INSURANCE:
        return { policyNumber: 'POL-123456', expiryDate: '2025-12-31' };
      case DocumentType.BANK_STATEMENTS:
        return { transactionDetails: [{ month: 'Jan 2024', credits: 50000, debits: 30000 }] };
      default:
        return { holderName: 'Extracted' };
    }
  }
}
