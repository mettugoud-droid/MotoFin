import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { ExecutiveCandidate } from '../dto/assignment.dto';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

@Injectable()
export class LeadAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all available sales executives with their current workload.
   * "Available" = active, not deleted, within max capacity.
   */
  async getAvailableExecutives(): Promise<ExecutiveCandidate[]> {
    const executives = await this.prisma.user.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        isActive: true,
        deletedAt: null,
        role: {
          name: { in: ['Sales Executive', 'Sales Manager'] },
        },
      },
      include: {
        _count: {
          select: {
            assignedLeads: {
              where: {
                status: { notIn: ['DISBURSED', 'REJECTED', 'CLOSED', 'ALL_REJECTED'] },
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: { lastAssignmentAt: 'asc' },
    });

    return executives
      .filter((exec) => exec._count.assignedLeads < exec.maxActiveLeads)
      .map((exec) => ({
        id: exec.id,
        fullName: exec.fullName,
        city: exec.city,
        productExpertise: exec.productExpertise,
        activeLeadCount: exec._count.assignedLeads,
        lastAssignmentAt: exec.lastAssignmentAt,
        maxActiveLeads: exec.maxActiveLeads,
      }));
  }

  /**
   * Assign a lead to an executive.
   */
  async assignLead(leadId: string, executiveId: string) {
    const now = new Date();

    // Update lead
    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedTo: executiveId,
        assignedAt: now,
      },
    });

    // Update executive's last assignment time
    await this.prisma.user.update({
      where: { id: executiveId },
      data: { lastAssignmentAt: now },
    });

    return { leadId, executiveId, assignedAt: now };
  }

  /**
   * Get lead details for assignment context.
   */
  async getLeadForAssignment(leadId: string) {
    return this.prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        customerCity: true,
        opportunityCategory: true,
        opportunityScore: true,
        assignedTo: true,
        existingLoanDetails: true,
      },
    });
  }

  /**
   * Get sales manager for escalation notifications.
   */
  async getSalesManagers() {
    return this.prisma.user.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        isActive: true,
        deletedAt: null,
        role: { name: 'Sales Manager' },
      },
    });
  }
}
