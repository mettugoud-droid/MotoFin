import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GoogleLeadFormDataDto {
  @IsString()
  @ApiProperty()
  leadId!: string;

  @IsString()
  @ApiProperty()
  name!: string;

  @IsString()
  @ApiProperty()
  mobile!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  city?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  loanRequirement?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  campaignId?: string;
}
