import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum DocumentType {
  PAN_CARD = 'pan_card',
  AADHAAR_CARD = 'aadhaar_card',
  REGISTRATION_CERTIFICATE = 'registration_certificate',
  INSURANCE = 'insurance',
  BANK_STATEMENTS = 'bank_statements',
  SALARY_SLIPS = 'salary_slips',
  IT_RETURNS = 'it_returns',
  VEHICLE_PHOTOS = 'vehicle_photos',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  VERIFIED = 'verified',
  FAILED = 'failed',
  OCR_FAILED = 'ocr_failed',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * OCR validation patterns per document type (Req 6.3)
 */
export const OCR_VALIDATION_PATTERNS: Record<string, { field: string; pattern: RegExp; description: string }[]> = {
  [DocumentType.PAN_CARD]: [
    { field: 'panNumber', pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, description: '5 uppercase letters + 4 digits + 1 uppercase letter' },
  ],
  [DocumentType.AADHAAR_CARD]: [
    { field: 'aadhaarNumber', pattern: /^\d{12}$/, description: '12-digit number' },
  ],
  [DocumentType.INSURANCE]: [
    { field: 'expiryDate', pattern: /^\d{4}-\d{2}-\d{2}$/, description: 'Valid date (YYYY-MM-DD)' },
  ],
  [DocumentType.REGISTRATION_CERTIFICATE]: [
    { field: 'registrationNumber', pattern: /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/, description: 'Indian vehicle registration format' },
  ],
};

/**
 * Required documents per loan product (Req 6.8)
 */
export const REQUIRED_DOCUMENTS_BY_PRODUCT: Record<string, DocumentType[]> = {
  refinance_loan: [DocumentType.PAN_CARD, DocumentType.AADHAAR_CARD, DocumentType.REGISTRATION_CERTIFICATE, DocumentType.BANK_STATEMENTS],
  balance_transfer: [DocumentType.PAN_CARD, DocumentType.AADHAAR_CARD, DocumentType.REGISTRATION_CERTIFICATE, DocumentType.BANK_STATEMENTS, DocumentType.INSURANCE],
  used_car_loan: [DocumentType.PAN_CARD, DocumentType.AADHAAR_CARD, DocumentType.REGISTRATION_CERTIFICATE, DocumentType.INSURANCE, DocumentType.VEHICLE_PHOTOS],
  top_up_loan: [DocumentType.PAN_CARD, DocumentType.AADHAAR_CARD, DocumentType.REGISTRATION_CERTIFICATE, DocumentType.BANK_STATEMENTS],
  loan_against_vehicle: [DocumentType.PAN_CARD, DocumentType.AADHAAR_CARD, DocumentType.REGISTRATION_CERTIFICATE, DocumentType.INSURANCE, DocumentType.VEHICLE_PHOTOS],
};

export class UploadDocumentDto {
  @ApiProperty({ description: 'Lead UUID' })
  @IsUUID()
  leadId!: string;

  @ApiProperty({ description: 'Document type', enum: DocumentType })
  @IsEnum(DocumentType, { message: 'documentType must be a valid document type' })
  documentType!: DocumentType;

  @ApiPropertyOptional({ description: 'Loan product code for completeness check' })
  @IsOptional()
  @IsString()
  loanProductCode?: string;
}

export interface OcrExtractedData {
  holderName?: string;
  documentNumber?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  registrationNumber?: string;
  ownerName?: string;
  policyNumber?: string;
  expiryDate?: string;
  transactionDetails?: Record<string, unknown>[];
}

export interface DocumentRecord {
  id: string;
  leadId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  storagePath: string;
  ocrData: OcrExtractedData | null;
  validationErrors: string[];
  expiryDate: string | null;
  uploadedAt: string;
  processedAt: string | null;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; expected: string; received: string }>;
}
