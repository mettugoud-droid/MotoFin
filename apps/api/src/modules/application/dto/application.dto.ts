import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum ApplicationStage {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
  CANCELLED = 'cancelled',
}

/**
 * Forward-only stage progression (Req 8.2)
 * Any stage can transition to REJECTED.
 * CANCELLED is system-only (when another app is disbursed).
 */
export const VALID_APPLICATION_TRANSITIONS: Record<string, string[]> = {
  [ApplicationStage.SUBMITTED]: [ApplicationStage.UNDER_REVIEW, ApplicationStage.REJECTED],
  [ApplicationStage.UNDER_REVIEW]: [ApplicationStage.APPROVED, ApplicationStage.REJECTED],
  [ApplicationStage.APPROVED]: [ApplicationStage.DISBURSED, ApplicationStage.REJECTED],
  [ApplicationStage.REJECTED]: [],
  [ApplicationStage.DISBURSED]: [],
  [ApplicationStage.CANCELLED]: [],
};

export class SubmitApplicationDto {
  @ApiProperty({ description: 'Lead UUID' })
  @IsUUID()
  leadId!: string;

  @ApiProperty({ description: 'Bank code to submit to', example: 'hdfc' })
  @IsString()
  bankCode!: string;

  @ApiProperty({ description: 'Loan amount requested in INR' })
  @IsNumber()
  @Min(1)
  loanAmount!: number;

  @ApiPropertyOptional({ description: 'Loan product code', example: 'refinance_loan' })
  @IsOptional()
  @IsString()
  loanProductCode?: string;
}

export class TransitionApplicationDto {
  @ApiProperty({ description: 'New application stage', enum: ApplicationStage })
  @IsEnum(ApplicationStage)
  newStage!: ApplicationStage;

  @ApiPropertyOptional({ description: 'Rejection reason (required if rejecting)' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Approved loan amount (on approval)' })
  @IsOptional()
  @IsNumber()
  approvedAmount?: number;

  @ApiPropertyOptional({ description: 'Disbursement amount (on disbursement)' })
  @IsOptional()
  @IsNumber()
  disbursementAmount?: number;

  @ApiPropertyOptional({ description: 'Conditions of approval' })
  @IsOptional()
  @IsString()
  conditions?: string;
}

export interface ApplicationRecord {
  id: string;
  leadId: string;
  bankName: string;
  bankCode: string;
  loanAmount: number;
  stage: ApplicationStage;
  approvedAmount: number | null;
  disbursementAmount: number | null;
  rejectionReason: string | null;
  conditions: string | null;
  stageHistory: Array<{ stage: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSubmissionResult {
  applicationId: string;
  leadId: string;
  bankName: string;
  stage: ApplicationStage;
  totalActiveApplications: number;
}
