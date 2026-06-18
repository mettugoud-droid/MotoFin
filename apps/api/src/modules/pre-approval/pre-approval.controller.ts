import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { PreApprovalService } from './pre-approval.service';
import { CalculatePreApprovalDto } from './dto/calculate-pre-approval.dto';
import { PreApprovalResponseDto } from './dto/pre-approval-response.dto';

@ApiTags('Calculator')
@Controller('v1/calculator')
export class PreApprovalController {
  constructor(private readonly preApprovalService: PreApprovalService) {}

  @Post('pre-approval')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate instant pre-approval indication',
    description: 'Public endpoint. Calculates approval probability based on savings calculation data. Shows confidence level and recommended banks.',
  })
  @ApiBody({ type: CalculatePreApprovalDto })
  @ApiResponse({ status: 200, description: 'Pre-approval calculated', type: PreApprovalResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Session calculation not found' })
  async calculatePreApproval(
    @Body() dto: CalculatePreApprovalDto,
  ): Promise<PreApprovalResponseDto> {
    const result = await this.preApprovalService.calculatePreApproval(dto);

    return {
      success: true,
      data: result.data,
      meta: {
        preApprovalId: result.preApprovalId,
        sourceSessionId: dto.sessionId,
        responseTimeMs: result.responseTimeMs,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
