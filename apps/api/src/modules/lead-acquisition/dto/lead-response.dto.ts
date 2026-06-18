import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeadCreatedDataDto {
  @ApiProperty() leadId!: string;
  @ApiProperty() isExisting!: boolean;
  @ApiProperty() status!: string;
  @ApiPropertyOptional() opportunityCategory?: string;
  @ApiPropertyOptional() opportunityScore?: number;
  @ApiPropertyOptional() assignedTo?: string;
  @ApiProperty() source!: string;
  @ApiProperty() sourceTimestamp!: string;
}

export class LeadCreatedResponseDto {
  @ApiProperty() success!: boolean;
  @ApiProperty() data!: LeadCreatedDataDto;
  @ApiProperty() meta!: Record<string, unknown>;
}
