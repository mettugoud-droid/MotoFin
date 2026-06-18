import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { SavingsCalculatorService } from './savings-calculator.service';
import { CalculateSavingsDto } from './dto/calculate-savings.dto';
import { SavingsCalculationResponseDto } from './dto/savings-response.dto';

@ApiTags('Calculator')
@Controller('v1/calculator')
export class SavingsCalculatorController {
  constructor(private readonly savingsCalculatorService: SavingsCalculatorService) {}

  @Post('savings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate EMI savings for vehicle loan refinancing',
    description: 'Public endpoint. Calculates potential monthly and total interest savings by comparing current loan terms against best available bank rates.',
  })
  @ApiBody({ type: CalculateSavingsDto })
  @ApiResponse({
    status: 200,
    description: 'Savings calculation successful',
    type: SavingsCalculationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error — invalid input fields' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @ApiResponse({ status: 503, description: 'Service unavailable — bank rates not loaded' })
  async calculateSavings(
    @Body() dto: CalculateSavingsDto,
  ): Promise<SavingsCalculationResponseDto> {
    const result = await this.savingsCalculatorService.calculateSavings(dto);

    return {
      success: true,
      data: result.data,
      meta: {
        calculationId: result.calculationId,
        responseTimeMs: result.responseTimeMs,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
