import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrentLoanTermsDto {
  @ApiProperty() bankName!: string;
  @ApiProperty() interestRate!: number;
  @ApiProperty() monthlyEmi!: number;
  @ApiProperty() remainingTenureMonths!: number;
  @ApiProperty() totalRemainingInterest!: number;
}

export class ProposedRefinanceTermsDto {
  @ApiProperty() bankName!: string;
  @ApiProperty() interestRate!: number;
  @ApiProperty() monthlyEmi!: number;
  @ApiProperty() remainingTenureMonths!: number;
  @ApiProperty() totalRemainingInterest!: number;
}

export class ForeclosureDataDto {
  @ApiProperty({ description: 'Estimated foreclosure amount (principal + interest + charges)' })
  foreclosureAmount!: number;

  @ApiProperty({ description: 'Pre-closure penalty charges' })
  preclosureCharges!: number;

  @ApiProperty({ description: 'Net savings after foreclosure charges over remaining tenure' })
  netSavingsAfterForeclosure!: number;

  @ApiProperty({ description: 'Is takeover eligible' })
  takeoverEligible!: boolean;

  @ApiPropertyOptional({ description: 'Reason if takeover not eligible' })
  takeoverIneligibilityReason?: string;

  @ApiProperty({ description: 'Best refinance bank name' })
  bestRefinanceBank!: string;

  @ApiProperty({ description: 'Monthly savings after refinance' })
  monthlySavings!: number;

  @ApiProperty({ description: 'Whether the loan is likely floating rate' })
  isFloatingRate!: boolean;

  @ApiProperty() currentLoanTerms!: CurrentLoanTermsDto;
  @ApiProperty() proposedRefinanceTerms!: ProposedRefinanceTermsDto;
}

export class ForeclosureCalculationResponseDto {
  @ApiProperty() success!: boolean;
  @ApiProperty() data!: ForeclosureDataDto;
  @ApiProperty() meta!: Record<string, unknown>;
}
