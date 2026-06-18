import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeadStatus, OpportunityCategory } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface CreateLeadData {
  customerName: string;
  customerMobile: string;
  customerCity: string;
  leadSourceId: string;
  assignedTo: string | null;
  status: LeadStatus;
  opportunityCategory: OpportunityCategory;
  opportunityScore: number;
  existingLoanDetails: Record<string, unknown> | null;
  requestedLoanAmount: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

@Injectable()
export class LeadRepository {
  private readonly logger = new Logger(LeadRepository.name);

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

  async create(data: CreateLeadData) {
    return this.prisma.lead.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        customerCity: data.customerCity,
        leadSourceId: data.leadSourceId,
        assignedTo: data.assignedTo,
        status: data.status,
        opportunityCategory: data.opportunityCategory,
        opportunityScore: data.opportunityScore,
        existingLoanDetails: data.existingLoanDetails as object,
        requestedLoanAmount: data.requestedLoanAmount,
        sourceTimestamp: new Date(),
        assignedAt: data.assignedTo ? new Date() : null,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
      },
    });
  }

  async updateLastInteraction(id: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { lastInteractionAt: new Date() },
    });
  }

  async getLeadSourceByType(type: string) {
    return this.prisma.leadSource.findFirst({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        type: type as never,
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
        role: {
          name: 'Sales Executive',
          deletedAt: null,
        },
      },
      orderBy: { lastAssignmentAt: 'asc' },
    });
  }
}
