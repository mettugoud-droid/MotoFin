import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, MinLength, MaxLength, IsOptional, IsIn, IsUUID } from 'class-validator';

export class CaptureLeadDto {
  @ApiProperty({ description: 'Session ID from calculator result', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4', { message: 'sessionId must be a valid UUID' })
  @IsNotEmpty({ message: 'sessionId is required' })
  sessionId: string;

  @ApiProperty({ description: 'Calculator type that generated the session', enum: ['savings', 'foreclosure'], example: 'savings' })
  @IsString()
  @IsIn(['savings', 'foreclosure'], { message: 'calculatorType must be savings or foreclosure' })
  calculatorType: string;

  @ApiProperty({ description: 'Customer full name', example: 'Surender Goud', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2, { message: 'name must be at least 2 characters' })
  @MaxLength(100, { message: 'name must not exceed 100 characters' })
  name: string;

  @ApiProperty({ description: 'Indian mobile number (10 digits)', example: '9876543210' })
  @IsString()
  @IsNotEmpty({ message: 'mobile is required' })
  @Matches(/^[6-9]\d{9}$/, { message: 'mobile must be a valid 10-digit Indian mobile number starting with 6-9' })
  mobile: string;

  @ApiProperty({ description: 'Customer city', example: 'Hyderabad' })
  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  @MinLength(2, { message: 'city must be at least 2 characters' })
  @MaxLength(100, { message: 'city must not exceed 100 characters' })
  city: string;

  @ApiPropertyOptional({ description: 'Current bank name', example: 'HDFC' })
  @IsOptional()
  @IsString()
  currentBank?: string;

  @ApiPropertyOptional({ description: 'UTM Source', example: 'facebook' })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({ description: 'UTM Medium', example: 'cpc' })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({ description: 'UTM Campaign', example: 'refinance_june_2026' })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiPropertyOptional({ description: 'UTM Content', example: 'savings_calculator_cta' })
  @IsOptional()
  @IsString()
  utmContent?: string;

  @ApiPropertyOptional({ description: 'UTM Term', example: 'car+loan+refinance' })
  @IsOptional()
  @IsString()
  utmTerm?: string;

  @ApiPropertyOptional({ description: 'Facebook Click ID' })
  @IsOptional()
  @IsString()
  fbclid?: string;

  @ApiPropertyOptional({ description: 'Google Click ID' })
  @IsOptional()
  @IsString()
  gclid?: string;
}
