import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { ApplicationService } from './application.service';
import { SubmitApplicationDto, TransitionApplicationDto } from './dto/application.dto';

@ApiTags('Applications')
@Controller('v1/applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit loan application to a bank' })
  @ApiBody({ type: SubmitApplicationDto })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  @ApiResponse({ status: 400, description: 'Validation error or max applications reached' })
  async submitApplication(@Body() dto: SubmitApplicationDto) {
    const result = await this.applicationService.submitApplication(dto);

    return {
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Post(':applicationId/transition')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition application to a new stage' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiBody({ type: TransitionApplicationDto })
  @ApiResponse({ status: 200, description: 'Stage transitioned' })
  @ApiResponse({ status: 400, description: 'Invalid transition' })
  async transitionStage(
    @Param('applicationId') applicationId: string,
    @Body() dto: TransitionApplicationDto,
  ) {
    const result = await this.applicationService.transitionStage(applicationId, dto);

    return {
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get all applications for a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Applications returned' })
  async getApplicationsForLead(@Param('leadId') leadId: string) {
    const applications = await this.applicationService.getApplicationsForLead(leadId);

    return {
      success: true,
      data: applications,
      meta: { count: applications.length, timestamp: new Date().toISOString() },
    };
  }

  @Get('lead/:leadId/alternatives')
  @ApiOperation({ summary: 'Get alternative banks after rejection' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Alternative banks returned' })
  async getAlternatives(@Param('leadId') leadId: string) {
    const alternatives = await this.applicationService.getAlternatives(leadId);

    return {
      success: true,
      data: { alternatives, count: alternatives.length },
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
