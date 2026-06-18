import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';

export enum LoanRequirement {
  USED_CAR_LOAN = 'Used Car Loan',
  REFINANCE_LOAN = 'Refinance Loan',
  VEHICLE_LOAN_BALANCE_TRANSFER = 'Vehicle Loan Balance Transfer',
  TOP_UP_VEHICLE_LOAN = 'Top-Up Vehicle Loan',
  LOAN_AGAINST_CAR = 'Loan Against Car',
  COMMERCIAL_VEHICLE_REFINANCE = 'Commercial Vehicle Refinance',
}

export enum LeadSourceChannel {
  META_LEAD_ADS = 'meta_lead_ads',
  GOOGLE_LEAD_FORMS = 'google_lead_forms',
  LANDING_PAGE = 'landing_page',
  WHATSAPP_CAMPAIGN = 'whatsapp_campaign',
  REFERRAL_PARTNER = 'referral_partner',
  DEALER_NETWORK = 'dealer_network',
}

export class CreateLeadDto {
  @ApiProperty({ description: 'Customer name (required)', example: 'Rahul Sharma', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name!: string;

  @ApiProperty({ description: 'Customer mobile (10-digit Indian number)', example: '9876543210' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Mobile must be a valid 10-digit Indian number starting with 6-9' })
  mobile!: string;

  @ApiPropertyOptional({ description: 'Customer email', example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Hyderabad' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'Occupation', example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @ApiPropertyOptional({ description: 'Vehicle type', example: 'Sedan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vehicleType?: string;

  @ApiPropertyOptional({ description: 'Vehicle age in months', example: 36 })
  @IsOptional()
  vehicleAge?: number;

  @ApiPropertyOptional({ description: 'Does customer have an existing loan?', example: true })
  @IsOptional()
  existingLoanStatus?: boolean;

  @ApiPropertyOptional({ description: 'Loan requirement type', enum: LoanRequirement })
  @IsOptional()
  @IsEnum(LoanRequirement, { message: 'loanRequirement must be one of: Used Car Loan, Refinance Loan, Vehicle Loan Balance Transfer, Top-Up Vehicle Loan, Loan Against Car, Commercial Vehicle Refinance' })
  loanRequirement?: LoanRequirement;

  @ApiProperty({ description: 'Lead source channel', enum: LeadSourceChannel })
  @IsEnum(LeadSourceChannel, { message: 'source must be a valid lead source channel' })
  source!: LeadSourceChannel;

  @ApiPropertyOptional({ description: 'UTM source' })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({ description: 'UTM medium' })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({ description: 'UTM campaign' })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiPropertyOptional({ description: 'Referral code (for referral partner leads)' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({ description: 'Dealer/Partner ID (for dealer network leads)' })
  @IsOptional()
  @IsString()
  partnerId?: string;
}
