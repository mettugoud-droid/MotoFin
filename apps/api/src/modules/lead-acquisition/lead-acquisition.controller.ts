import { Controller, Post, Body, HttpCode, HttpStatus, Headers, Query, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { LeadAcquisitionService } from './lead-acquisition.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadCreatedResponseDto } from './dto/lead-response.dto';
import { MetaWebhookPayloadDto } from './dto/meta-webhook.dto';
import { GoogleLeadFormDataDto } from './dto/google-webhook.dto';

@ApiTags('Leads')
@Controller('v1/leads')
export class LeadAcquisitionController {
  private readonly logger = new Logger(LeadAcquisitionController.name);

  constructor(private readonly leadAcquisitionService: LeadAcquisitionService) {}

  /**
   * General lead ingestion endpoint — accepts leads from all channels
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new lead from any source channel' })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({ status: 201, description: 'Lead captured successfully', type: LeadCreatedResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async captureLead(@Body() dto: CreateLeadDto): Promise<LeadCreatedResponseDto> {
    const result = await this.leadAcquisitionService.captureLead(dto);

    return {
      success: true,
      data: {
        leadId: result.leadId,
        isExisting: result.isExisting,
        status: result.status,
        opportunityCategory: result.opportunityCategory,
        opportunityScore: result.opportunityScore,
        assignedTo: result.assignedTo,
        source: result.source,
        sourceTimestamp: result.sourceTimestamp,
      },
      meta: {
        timestamp: new Date().toISOString(),
        message: result.isExisting
          ? 'Lead linked to existing customer record'
          : 'New lead captured and assigned',
      },
    };
  }

  /**
   * Meta Lead Ads Webhook — verification (GET)
   */
  @Get('webhook/meta')
  @ApiOperation({ summary: 'Meta webhook verification (hub.challenge)' })
  verifyMetaWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'motofin_verify_token';

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      this.logger.log('Meta webhook verified successfully');
      return challenge;
    }

    this.logger.warn('Meta webhook verification failed');
    return 'Verification failed';
  }

  /**
   * Meta Lead Ads Webhook — lead event (POST)
   */
  @Post('webhook/meta')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive Meta Lead Ads webhook events' })
  async handleMetaWebhook(
    @Body() payload: MetaWebhookPayloadDto,
    @Headers('x-hub-signature-256') signature: string,
  ): Promise<{ received: boolean }> {
    // TODO: Verify signature using app secret in production
    this.logger.log(`Meta webhook received: ${payload.entry?.length || 0} entries`);

    // Process each lead entry
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'leadgen') {
          const leadgenId = change.value.leadgen_id;
          this.logger.log(`Processing Meta lead: ${leadgenId}`);

          // In production: fetch full lead data from Graph API
          // GET /{leadgen_id}?fields=name,email,phone_number,city,...
          // For now, queue for manual processing
          // TODO: Implement Graph API fetch when META_ACCESS_TOKEN is configured
        }
      }
    }

    return { received: true };
  }

  /**
   * Google Lead Forms Webhook
   */
  @Post('webhook/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive Google Lead Form submissions' })
  async handleGoogleWebhook(
    @Body() data: GoogleLeadFormDataDto,
  ): Promise<LeadCreatedResponseDto> {
    this.logger.log(`Google lead received: ${data.name} (${data.mobile})`);

    const result = await this.leadAcquisitionService.captureFromGoogle({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      loanRequirement: data.loanRequirement,
      campaignId: data.campaignId,
    });

    return {
      success: true,
      data: {
        leadId: result.leadId,
        isExisting: result.isExisting,
        status: result.status,
        opportunityCategory: result.opportunityCategory,
        opportunityScore: result.opportunityScore,
        assignedTo: result.assignedTo,
        source: result.source,
        sourceTimestamp: result.sourceTimestamp,
      },
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
