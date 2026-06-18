import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, IsDateString, MaxLength, Min } from 'class-validator';
import { LeadStatus } from '@prisma/client';

/**
 * Valid stage transitions (Req 5.1)
 * Only logically adjacent stages are permitted.
 */
export const VALID_TRANSITIONS: Record<string, string[]> = {
  NEW: ['CONTACTED', 'CLOSED'],
  CONTACTED: ['QUALIFIED', 'FOLLOW_UP', 'CLOSED'],
  QUALIFIED: ['FOLLOW_UP', 'DOCS_PENDING', 'CLOSED'],
  FOLLOW_UP: ['QUALIFIED', 'DOCS_PENDING', 'CLOSED'],
  DOCS_PENDING: ['DOCS_RECEIVED', 'CLOSED'],
  DOCS_RECEIVED: ['BANK_SUBMITTED', 'CLOSED'],
  BANK_SUBMITTED: ['APPROVED', 'REJECTED', 'CLOSED'],
  APPROVED: ['DISBURSED', 'CLOSED'],
  DISBURSED: [],
  REJECTED: ['FOLLOW_UP', 'CLOSED'],
  CLOSED: [],
  ALL_REJECTED: ['FOLLOW_UP', 'CLOSED'],
};

export enum InteractionType {
  CALL = 'call',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  NOTE = 'note',
  TASK = 'task',
}

/**
 * Character limits per interaction type (Req 5.7)
 */
export const INTERACTION_LIMITS: Record<InteractionType, { content: number; subject?: number }> = {
  [InteractionType.CALL]: { content: 2000 },
  [InteractionType.WHATSAPP]: { content: 2000 },
  [InteractionType.EMAIL]: { content: 10000, subject: 200 },
  [InteractionType.NOTE]: { content: 5000 },
  [InteractionType.TASK]: { content: 2000 },
};

export class TransitionStatusDto {
  @ApiProperty({ description: 'New status to transition to', enum: LeadStatus })
  @IsEnum(LeadStatus, { message: 'status must be a valid lead stage' })
  newStatus!: LeadStatus;
}

export class CreateInteractionDto {
  @ApiProperty({ description: 'Interaction type', enum: InteractionType })
  @IsEnum(InteractionType, { message: 'type must be: call, whatsapp, email, note, or task' })
  type!: InteractionType;

  @ApiProperty({ description: 'Content/summary of interaction', maxLength: 10000 })
  @IsString()
  @MaxLength(10000, { message: 'Content exceeds maximum allowed length' })
  content!: string;

  @ApiPropertyOptional({ description: 'Subject (for email type)', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  subject?: string;

  @ApiPropertyOptional({ description: 'Call duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({ description: 'Message direction (inbound/outbound)' })
  @IsOptional()
  @IsEnum(['inbound', 'outbound'])
  direction?: 'inbound' | 'outbound';

  @ApiPropertyOptional({ description: 'Task due date (ISO format)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Task assignee user ID' })
  @IsOptional()
  @IsString()
  assigneeId?: string;
}

export interface StageHistoryEntry {
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  timestamp: string;
}

export interface InteractionRecord {
  id: string;
  leadId: string;
  type: InteractionType;
  content: string;
  subject?: string;
  durationSeconds?: number;
  direction?: string;
  dueDate?: string;
  assigneeId?: string;
  isComplete?: boolean;
  createdBy: string;
  createdAt: string;
}
