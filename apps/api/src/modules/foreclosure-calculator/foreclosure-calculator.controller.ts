import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { ForeclosureCalculatorService } from './foreclosure-calculator.service';
import { CalculateForeclosureDto } from './dto/calculate-foreclosure.dto';
import { ForeclosureCalculationResponseDto } from './dto/foreclosure-response.dto';

@ApiTags('Calculator')
@Controller('v1/foreclosure')
export class ForeclosureCalculatorController {
  constructor(private readonly foreclosureService: ForeclosureCalculatorService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate foreclosure amount and takeover eligibility',
    description: 'Public endpoint. Calculates estimated foreclosure amount, pre-closure charges, net savings after refinancing, and takeover eligibility.',
  })
  @ApiBody({ type: CalculateForeclosureDto })
  @ApiResponse({ status: 200, description: 'Foreclosure calculation successful', type: ForeclosureCalculationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error — invalid input fields' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @ApiResponse({ status: 503, description: 'Service unavailable — bank rates not loaded' })
  async calculateForeclosure(
    @Body() dto: CalculateForeclosureDto,
  ): Promise<ForeclosureCalculationResponseDto> {
    const result = await this.foreclosureService.calculateForeclosure(dto);

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
