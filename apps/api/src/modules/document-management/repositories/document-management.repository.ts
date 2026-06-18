import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentType, DocumentStatus, OcrExtractedData, DocumentRecord } from '../dto/document.dto';
import { LeadStatus } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface CreateDocumentData {
  leadId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  status: DocumentStatus;
}

/**
 * Repository for document operations.
 * For MVP: stores document metadata in the lead's matchedSignals JSON.
 * In production: use a dedicated documents table (as defined in the schema).
 */
@Injectable()
export class DocumentManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  // In-memory document store for MVP (production: dedicated table)
  private documents: Map<string, DocumentRecord & { loanProductCode?: string }> = new Map();

  async createDocument(data: CreateDocumentData): Promise<DocumentRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: DocumentRecord = {
      id,
      leadId: data.leadId,
      documentType: data.documentType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      status: data.status,
      storagePath: data.storagePath,
      ocrData: null,
      validationErrors: [],
      expiryDate: null,
      uploadedAt: now,
      processedAt: null,
    };

    this.documents.set(id, record);
    return record;
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    ocrData: OcrExtractedData | null,
    validationErrors: string[],
  ): Promise<void> {
    const doc = this.documents.get(documentId);
    if (!doc) return;

    doc.status = status;
    doc.ocrData = ocrData;
    doc.validationErrors = validationErrors;
    doc.processedAt = new Date().toISOString();

    // Extract expiry date if available
    if (ocrData?.expiryDate) {
      doc.expiryDate = ocrData.expiryDate;
    }
  }

  async getDocumentById(documentId: string): Promise<(DocumentRecord & { loanProductCode?: string }) | null> {
    return this.documents.get(documentId) || null;
  }

  async getDocumentsByLeadId(leadId: string): Promise<DocumentRecord[]> {
    return Array.from(this.documents.values())
      .filter((d) => d.leadId === leadId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async getVerifiedDocumentsForLead(leadId: string): Promise<DocumentRecord[]> {
    return Array.from(this.documents.values())
      .filter((d) => d.leadId === leadId && d.status === DocumentStatus.VERIFIED);
  }

  async getDocumentsExpiringWithin(days: number): Promise<Array<{ documentId: string; leadId: string; documentType: string; expiryDate: string; daysUntilExpiry: number }>> {
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const expiring: Array<{ documentId: string; leadId: string; documentType: string; expiryDate: string; daysUntilExpiry: number }> = [];

    for (const doc of this.documents.values()) {
      if (doc.expiryDate && doc.status === DocumentStatus.VERIFIED) {
        const expiry = new Date(doc.expiryDate);
        if (expiry <= cutoff && expiry > now) {
          const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          expiring.push({
            documentId: doc.id,
            leadId: doc.leadId,
            documentType: doc.documentType,
            expiryDate: doc.expiryDate,
            daysUntilExpiry: daysUntil,
          });
        }
      }
    }

    return expiring;
  }

  async updateLeadStatus(leadId: string, status: string): Promise<void> {
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: status as LeadStatus },
    });
  }
}
