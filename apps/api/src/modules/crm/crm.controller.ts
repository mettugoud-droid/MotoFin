import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CrmService } from './crm.service';
import { TransitionStatusDto, CreateInteractionDto } from './dto/crm.dto';

@ApiTags('CRM')
@Controller('v1/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('leads/:leadId/transition')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition lead to a new status' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Status transitioned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid transition or lead not found' })
  async transitionStatus(
    @Param('leadId') leadId: string,
    @Body() dto: TransitionStatusDto,
  ) {
    // TODO: Get changedBy from auth token; using placeholder for now
    const changedBy = 'system';
    const result = await this.crmService.transitionLeadStatus(leadId, dto.newStatus, changedBy);

    return {
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Post('leads/:leadId/interactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log an interaction against a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 201, description: 'Interaction recorded' })
  @ApiResponse({ status: 400, description: 'Validation error or lead not found' })
  async logInteraction(
    @Param('leadId') leadId: string,
    @Body() dto: CreateInteractionDto,
  ) {
    // TODO: Get createdBy from auth token
    const createdBy = 'system';
    const record = await this.crmService.logInteraction(leadId, dto, createdBy);

    return {
      success: true,
      data: record,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  @Get('leads/:leadId/interactions')
  @ApiOperation({ summary: 'Get interaction history for a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Interaction history returned' })
  async getInteractions(
    @Param('leadId') leadId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const records = await this.crmService.getInteractionHistory(leadId, limit || 50, offset || 0);

    return {
      success: true,
      data: records,
      meta: { count: records.length, timestamp: new Date().toISOString() },
    };
  }

  @Get('leads/:leadId/history')
  @ApiOperation({ summary: 'Get stage change history for a lead' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Stage history returned' })
  async getStageHistory(@Param('leadId') leadId: string) {
    const history = await this.crmService.getStageHistory(leadId);

    return {
      success: true,
      data: history,
      meta: { count: history.length, timestamp: new Date().toISOString() },
    };
  }

  @Get('leads/stale')
  @ApiOperation({ summary: 'Get leads with no interaction in last 24 hours' })
  @ApiQuery({ name: 'hours', required: false, type: Number, description: 'Hours threshold (default 24)' })
  @ApiResponse({ status: 200, description: 'Stale leads returned' })
  async getStaleLeads(@Query('hours') hours?: number) {
    const staleLeads = await this.crmService.getStaleLeads(hours || 24);

    return {
      success: true,
      data: staleLeads,
      meta: { count: staleLeads.length, timestamp: new Date().toISOString() },
    };
  }
}
