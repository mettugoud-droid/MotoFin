import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class MetaLeadFieldDto {
  @ApiProperty() name!: string;
  @ApiProperty() values!: string[];
}

export class MetaWebhookEntryChangeValueDto {
  @ApiProperty() leadgen_id!: string;
  @ApiProperty() page_id!: string;
  @ApiPropertyOptional() form_id?: string;
  @ApiPropertyOptional() created_time?: number;
}

export class MetaWebhookEntryChangeDto {
  @ApiProperty() field!: string;
  @ApiProperty() value!: MetaWebhookEntryChangeValueDto;
}

export class MetaWebhookEntryDto {
  @ApiProperty() id!: string;
  @ApiProperty() time!: number;
  @ApiProperty() changes!: MetaWebhookEntryChangeDto[];
}

export class MetaWebhookPayloadDto {
  @ApiProperty() object!: string;
  @ApiProperty() entry!: MetaWebhookEntryDto[];
}

/**
 * Simplified Meta lead data after Graph API fetch
 */
export class MetaLeadDataDto {
  @IsString()
  leadgenId!: string;

  @IsString()
  name!: string;

  @IsString()
  mobile!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  loanRequirement?: string;
}
