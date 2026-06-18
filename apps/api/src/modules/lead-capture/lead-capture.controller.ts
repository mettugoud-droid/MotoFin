import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { LeadCaptureService } from './lead-capture.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
import { CaptureLeadResponseDto } from './dto/capture-lead-response.dto';

@ApiTags('Leads')
@Controller('v1/calculator')
export class LeadCaptureController {
  constructor(private readonly leadCaptureService: LeadCaptureService) {}

  @Post('capture-lead')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Capture lead from calculator result',
    description: 'Public endpoint. Captures customer contact details after viewing calculator savings results. Creates a lead in CRM with scoring and auto-assignment.',
  })
  @ApiBody({ type: CaptureLeadDto })
  @ApiResponse({ status: 200, description: 'Lead captured successfully', type: CaptureLeadResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Session or lead source not found' })
  async captureLead(@Body() dto: CaptureLeadDto): Promise<CaptureLeadResponseDto> {
    const result = await this.leadCaptureService.captureLead(dto);

    const message = result.existingLead
      ? 'Welcome back! Your updated savings report is being prepared.'
      : 'Your savings report has been unlocked. Our team will contact you shortly.';

    return {
      success: true,
      data: {
        leadId: result.leadId,
        existingLead: result.existingLead,
        status: result.status,
        opportunityCategory: result.opportunityCategory,
        score: result.score,
        assignedTo: result.assignedTo,
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: dto.calculatorType === 'savings' ? 'savings_calculator' : 'foreclosure_calculator',
      },
    };
  }
}
