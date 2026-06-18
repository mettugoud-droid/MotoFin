import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { BankMatchingService } from './bank-matching.service';
import { CustomerProfileDto } from './dto/bank-matching.dto';

@ApiTags('Bank Matching')
@Controller('v1/bank-matching')
export class BankMatchingController {
  constructor(private readonly bankMatchingService: BankMatchingService) {}

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Evaluate customer profile against bank eligibility rules',
    description: 'Returns up to 3 recommended banks ranked by approval probability. Requires lead to be in DOCS_RECEIVED status.',
  })
  @ApiBody({ type: CustomerProfileDto })
  @ApiResponse({ status: 200, description: 'Bank matching completed' })
  @ApiResponse({ status: 400, description: 'Validation error or missing data' })
  async evaluateBankMatch(@Body() dto: CustomerProfileDto) {
    const result = await this.bankMatchingService.matchBanks(dto);

    return {
      success: true,
      data: result,
      meta: {
        evaluationTimeMs: result.evaluationTimeMs,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
