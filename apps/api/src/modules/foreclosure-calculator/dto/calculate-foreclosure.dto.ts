import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString, Min, Max, IsIn } from 'class-validator';

const SUPPORTED_BANKS = [
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'IndusInd Bank', 'AU Small Finance Bank', 'Shriram Finance',
  'Cholamandalam Finance', 'Mahindra Finance',
];

export class CalculateForeclosureDto {
  @ApiProperty({
    description: 'Current bank name from supported list',
    example: 'HDFC Bank',
    enum: SUPPORTED_BANKS,
  })
  @IsString({ message: 'currentBank must be a string' })
  @IsIn(SUPPORTED_BANKS, { message: 'currentBank must be a supported bank' })
  currentBank!: string;

  @ApiProperty({ description: 'Current monthly EMI in INR', example: 28000, minimum: 1, maximum: 10000000 })
  @IsNumber({}, { message: 'currentEmi must be a valid number' })
  @Min(1, { message: 'currentEmi must be at least ₹1' })
  @Max(10000000, { message: 'currentEmi must not exceed ₹1,00,00,000' })
  currentEmi!: number;

  @ApiProperty({ description: 'Loan start date (ISO format)', example: '2021-06-15' })
  @IsDateString({}, { message: 'loanStartDate must be a valid date' })
  loanStartDate!: string;

  @ApiProperty({ description: 'Outstanding loan amount in INR', example: 800000, minimum: 1, maximum: 100000000 })
  @IsNumber({}, { message: 'outstandingAmount must be a valid number' })
  @Min(1, { message: 'outstandingAmount must be at least ₹1' })
  @Max(100000000, { message: 'outstandingAmount must not exceed ₹10,00,00,000' })
  outstandingAmount!: number;

  @ApiProperty({ description: 'Current annual interest rate in %', example: 12.5, minimum: 0.01, maximum: 50 })
  @IsNumber({}, { message: 'currentRate must be a valid number' })
  @Min(0.01, { message: 'currentRate must be at least 0.01%' })
  @Max(50, { message: 'currentRate must not exceed 50%' })
  currentRate!: number;
}
