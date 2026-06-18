import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PreApprovalBankDto {
  @ApiProperty({ example: 'HDFC Bank' })
  bankName!: string;

  @ApiProperty({ example: 8.5 })
  offeredRate!: number;

  @ApiProperty({ example: 72.5 })
  historicalApprovalRate!: number;
}

export class PreApprovalDataDto {
  @ApiProperty({ example: 84, description: 'Approval probability 0-100' })
  approvalProbability!: number;

  @ApiProperty({ example: 'HIGH', enum: ['HIGH', 'MODERATE', 'SUBJECT_TO_VERIFICATION'] })
  confidenceLevel!: string;

  @ApiProperty({ example: 'High Chance of Approval' })
  confidenceMessage!: string;

  @ApiPropertyOptional({ example: 175000, description: 'Top-up eligible amount in INR' })
  topUpEligibility!: number | null;

  @ApiProperty({ type: [PreApprovalBankDto], description: 'Top 3 recommended banks' })
  recommendedBanks!: PreApprovalBankDto[];

  @ApiProperty({ example: 'This is an indicative estimate based on the information provided. Final approval is subject to document verification and bank assessment.' })
  disclaimer!: string;
}

export class PreApprovalMetaDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  preApprovalId!: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  sourceSessionId!: string;

  @ApiProperty({ example: 85 })
  responseTimeMs!: number;

  @ApiProperty({ example: '2026-06-18T10:30:00.000Z' })
  timestamp!: string;
}

export class PreApprovalResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: PreApprovalDataDto })
  data!: PreApprovalDataDto;

  @ApiProperty({ type: PreApprovalMetaDto })
  meta!: PreApprovalMetaDto;
}
