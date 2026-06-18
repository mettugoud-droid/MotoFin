import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeadStatus, OpportunityCategory, LeadSourceType } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface CreateLeadData {
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerCity?: string;
  leadSourceId: string;
  assignedTo?: string;
  status: LeadStatus;
  opportunityCategory?: OpportunityCategory;
  opportunityScore?: number;
  existingLoanDetails?: Record<string, unknown>;
  requestedLoanAmount?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  matchedSignals?: unknown[];
}

@Injectable()
export class LeadAcquisitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByMobile(mobile: string) {
    return this.prisma.lead.findFirst({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        customerMobile: mobile,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLeadSourceByType(type: LeadSourceType) {
    return this.prisma.leadSource.findFirst({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        type,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async getFirstActiveExecutive() {
    return this.prisma.user.findFirst({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        isActive: true,
        deletedAt: null,
      },
      orderBy: [
        { lastAssignmentAt: 'asc' },
      ],
    });
  }

  async create(data: CreateLeadData) {
    return this.prisma.lead.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        customerEmail: data.customerEmail,
        customerCity: data.customerCity,
        leadSourceId: data.leadSourceId,
        assignedTo: data.assignedTo,
        status: data.status,
        opportunityCategory: data.opportunityCategory,
        opportunityScore: data.opportunityScore,
        existingLoanDetails: data.existingLoanDetails as any,
        requestedLoanAmount: data.requestedLoanAmount,
        matchedSignals: data.matchedSignals as any || [],
        sourceTimestamp: new Date(),
        assignedAt: data.assignedTo ? new Date() : null,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
  }

  async updateLastInteraction(leadId: string) {
    return this.prisma.lead.update({
      where: { id: leadId },
      data: { lastInteractionAt: new Date() },
    });
  }

  async appendSourceToExistingLead(leadId: string, newSource: string, updatedFields: Record<string, unknown>) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    const existingSignals = (lead.matchedSignals as unknown[]) || [];
    const updatedSignals = [
      ...existingSignals,
      { source: newSource, timestamp: new Date().toISOString(), ...updatedFields },
    ];

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        matchedSignals: updatedSignals as any,
        lastInteractionAt: new Date(),
        customerCity: updatedFields.city as string || lead.customerCity,
        customerEmail: updatedFields.email as string || lead.customerEmail,
      },
    });
  }
}
