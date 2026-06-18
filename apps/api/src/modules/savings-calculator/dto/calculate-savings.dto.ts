import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsInt, Min, Max, IsOptional, IsEnum, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isGreaterThanOrEqual', async: false })
class IsGreaterThanOrEqualConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName] as number;
    return value >= relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as string[];
    return `$property must be greater than or equal to ${relatedPropertyName}`;
  }
}

export class CalculateSavingsDto {
  @ApiProperty({ description: 'Current monthly EMI in INR', example: 25000, minimum: 1, maximum: 10000000 })
  @IsNumber({}, { message: 'currentEmi must be a valid number' })
  @Min(1, { message: 'currentEmi must be at least ₹1' })
  @Max(10000000, { message: 'currentEmi must not exceed ₹1,00,00,000' })
  currentEmi!: number;

  @ApiProperty({ description: 'Outstanding loan amount in INR', example: 800000, minimum: 1, maximum: 100000000 })
  @IsNumber({}, { message: 'outstandingAmount must be a valid number' })
  @Min(1, { message: 'outstandingAmount must be at least ₹1' })
  @Max(100000000, { message: 'outstandingAmount must not exceed ₹10,00,00,000' })
  outstandingAmount!: number;

  @ApiProperty({ description: 'Current annual interest rate in %', example: 12.5, minimum: 1, maximum: 30 })
  @IsNumber({}, { message: 'currentRate must be a valid number' })
  @Min(1, { message: 'currentRate must be at least 1%' })
  @Max(30, { message: 'currentRate must not exceed 30%' })
  currentRate!: number;

  @ApiProperty({ description: 'Remaining loan tenure in months', example: 36, minimum: 1, maximum: 120 })
  @IsInt({ message: 'remainingTenure must be a whole number' })
  @Min(1, { message: 'remainingTenure must be at least 1 month' })
  @Max(120, { message: 'remainingTenure must not exceed 120 months' })
  remainingTenure!: number;

  @ApiProperty({ description: 'Original loan tenure in months', example: 60, minimum: 1, maximum: 120 })
  @IsInt({ message: 'originalTenure must be a whole number' })
  @Min(1, { message: 'originalTenure must be at least 1 month' })
  @Max(120, { message: 'originalTenure must not exceed 120 months' })
  @Validate(IsGreaterThanOrEqualConstraint, ['remainingTenure'], {
    message: 'originalTenure must be greater than or equal to remainingTenure',
  })
  originalTenure!: number;

  @ApiPropertyOptional({ description: 'Employment type for eligibility filtering', enum: ['salaried', 'self_employed', 'business'] })
  @IsOptional()
  @IsEnum(['salaried', 'self_employed', 'business'], { message: 'employmentType must be salaried, self_employed, or business' })
  employmentType?: string;
}
