import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CaptureLeadDataDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  leadId: string;

  @ApiProperty({ example: false, description: 'True if mobile already existed in system' })
  existingLead: boolean;

  @ApiProperty({ example: 'NEW' })
  status: string;

  @ApiProperty({ example: 'refinance_opportunity' })
  opportunityCategory: string;

  @ApiProperty({ example: 70 })
  score: number;

  @ApiPropertyOptional({ example: 'exec-uuid', description: 'Assigned sales executive ID' })
  assignedTo: string | null;

  @ApiProperty({ example: 'Your savings report has been unlocked. Our team will contact you shortly.' })
  message: string;
}

export class CaptureLeadMetaDto {
  @ApiProperty({ example: '2026-06-18T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'savings_calculator' })
  source: string;
}

export class CaptureLeadResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CaptureLeadDataDto })
  data: CaptureLeadDataDto;

  @ApiProperty({ type: CaptureLeadMetaDto })
  meta: CaptureLeadMetaDto;
}
