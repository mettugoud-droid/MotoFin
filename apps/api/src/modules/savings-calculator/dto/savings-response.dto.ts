import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BankComparisonDto {
  @ApiProperty({ example: 'HDFC Bank' })
  bankName!: string;

  @ApiProperty({ example: 8.5 })
  offeredRate!: number;

  @ApiProperty({ example: 22500 })
  estimatedEmi!: number;

  @ApiProperty({ example: 2500 })
  monthlySaving!: number;

  @ApiProperty({ example: 90000 })
  totalSaving!: number;
}

export class RecommendedBankDto {
  @ApiProperty({ example: 'HDFC Bank' })
  name!: string;

  @ApiProperty({ example: 8.5 })
  offeredRate!: number;

  @ApiProperty({ example: 22500 })
  estimatedEmi!: number;
}

export class SavingsCalculationDataDto {
  @ApiProperty({ example: 2350, description: 'Monthly EMI saving in INR' })
  monthlySaving!: number;

  @ApiProperty({ example: 84600, description: 'Total interest saving over remaining tenure' })
  totalInterestSaving!: number;

  @ApiProperty({ example: true })
  topUpEligible!: boolean;

  @ApiPropertyOptional({ example: 175000, description: 'Top-up eligible amount if applicable' })
  topUpAmount!: number | null;

  @ApiProperty({ type: RecommendedBankDto })
  recommendedBank!: RecommendedBankDto;

  @ApiProperty({ type: [BankComparisonDto], description: 'Top 3 banks sorted by rate ascending' })
  bankComparisons!: BankComparisonDto[];

  @ApiProperty({ example: false, description: 'True if current rate is already competitive' })
  isRateCompetitive!: boolean;

  @ApiPropertyOptional({ example: null })
  competitiveMessage!: string | null;
}

export class SavingsMetaDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  calculationId!: string;

  @ApiProperty({ example: 145 })
  responseTimeMs!: number;

  @ApiProperty({ example: '2026-06-18T10:30:00.000Z' })
  timestamp!: string;
}

export class SavingsCalculationResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: SavingsCalculationDataDto })
  data!: SavingsCalculationDataDto;

  @ApiProperty({ type: SavingsMetaDto })
  meta!: SavingsMetaDto;
}
