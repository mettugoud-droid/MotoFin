import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsInt, Min, Max, IsArray } from 'class-validator';

export class CustomerProfileDto {
  @ApiProperty({ description: 'Lead UUID' })
  @IsUUID()
  leadId!: string;

  @ApiProperty({ description: 'Customer credit score', example: 750 })
  @IsInt()
  @Min(300)
  @Max(900)
  creditScore!: number;

  @ApiProperty({ description: 'Vehicle age in months', example: 48 })
  @IsInt()
  @Min(0)
  @Max(360)
  vehicleAgeMonths!: number;

  @ApiProperty({ description: 'Monthly income in INR', example: 50000 })
  @IsNumber()
  @Min(0)
  monthlyIncome!: number;

  @ApiProperty({ description: 'Employment type', enum: ['salaried', 'self_employed', 'business'] })
  @IsEnum(['salaried', 'self_employed', 'business'])
  employmentType!: string;

  @ApiProperty({ description: 'City', example: 'Mumbai' })
  @IsString()
  city!: string;

  @ApiProperty({ description: 'Requested loan amount in INR', example: 800000 })
  @IsNumber()
  @Min(1)
  loanAmount!: number;

  @ApiPropertyOptional({ description: 'Loan product code', example: 'refinance_loan' })
  @IsOptional()
  @IsString()
  loanProductCode?: string;
}

export interface BankEligibilityResult {
  bankId: string;
  bankName: string;
  bankCode: string;
  isEligible: boolean;
  failedCriteria: string[];
  approvalProbability: number | null;
  offeredRate: number | null;
}

export interface BankRecommendation {
  bankName: string;
  bankCode: string;
  approvalProbability: number;
  offeredRate: number;
  maxLoanAmount: number;
  estimatedEmi: number;
}

export interface BankMatchingResult {
  leadId: string;
  totalBanksEvaluated: number;
  eligibleBanks: number;
  recommendations: BankRecommendation[];
  ineligibleBanks: Array<{ bankName: string; failedCriteria: string[] }>;
  requiresManualReview: boolean;
  evaluationTimeMs: number;
}
