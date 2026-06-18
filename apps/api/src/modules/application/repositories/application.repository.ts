import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeadStatus } from '@prisma/client';
import { ApplicationStage, ApplicationRecord } from '../dto/application.dto';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Application Repository
 * For MVP: in-memory store. Production: dedicated applications table.
 */
@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private applications: Map<string, ApplicationRecord> = new Map();

  async createApplication(data: {
    leadId: string;
    bankName: string;
    bankCode: string;
    loanAmount: number;
  }): Promise<ApplicationRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: ApplicationRecord = {
      id,
      leadId: data.leadId,
      bankName: data.bankName,
      bankCode: data.bankCode,
      loanAmount: data.loanAmount,
      stage: ApplicationStage.SUBMITTED,
      approvedAmount: null,
      disbursementAmount: null,
      rejectionReason: null,
      conditions: null,
      stageHistory: [{ stage: ApplicationStage.SUBMITTED, timestamp: now }],
      createdAt: now,
      updatedAt: now,
    };

    this.applications.set(id, record);
    return record;
  }

  async getApplicationById(id: string): Promise<ApplicationRecord | null> {
    return this.applications.get(id) || null;
  }

  async getApplicationsByLeadId(leadId: string): Promise<ApplicationRecord[]> {
    return Array.from(this.applications.values())
      .filter((a) => a.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveApplicationsCount(leadId: string): Promise<number> {
    return Array.from(this.applications.values())
      .filter((a) => a.leadId === leadId && a.stage !== ApplicationStage.CANCELLED && a.stage !== ApplicationStage.REJECTED)
      .length;
  }

  async updateApplicationStage(
    id: string,
    stage: ApplicationStage,
    extra?: { rejectionReason?: string; approvedAmount?: number; disbursementAmount?: number; conditions?: string },
  ): Promise<ApplicationRecord | null> {
    const app = this.applications.get(id);
    if (!app) return null;

    app.stage = stage;
    app.updatedAt = new Date().toISOString();
    app.stageHistory.push({ stage, timestamp: app.updatedAt });

    if (extra?.rejectionReason) app.rejectionReason = extra.rejectionReason;
    if (extra?.approvedAmount) app.approvedAmount = extra.approvedAmount;
    if (extra?.disbursementAmount) app.disbursementAmount = extra.disbursementAmount;
    if (extra?.conditions) app.conditions = extra.conditions;

    return app;
  }

  async cancelOtherApplications(leadId: string, exceptId: string): Promise<number> {
    let count = 0;
    for (const app of this.applications.values()) {
      if (app.leadId === leadId && app.id !== exceptId && app.stage !== ApplicationStage.REJECTED && app.stage !== ApplicationStage.DISBURSED && app.stage !== ApplicationStage.CANCELLED) {
        app.stage = ApplicationStage.CANCELLED;
        app.updatedAt = new Date().toISOString();
        app.stageHistory.push({ stage: ApplicationStage.CANCELLED, timestamp: app.updatedAt });
        count++;
      }
    }
    return count;
  }

  async getAlternativeBanks(leadId: string): Promise<string[]> {
    const submitted = Array.from(this.applications.values())
      .filter((a) => a.leadId === leadId)
      .map((a) => a.bankCode);

    // Return bank codes not yet submitted to
    const allBanks = ['hdfc', 'icici', 'axis', 'kotak', 'indusind', 'au', 'shriram', 'chola', 'mahindra_finance'];
    return allBanks.filter((b) => !submitted.includes(b));
  }

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
  }

  async getLeadById(leadId: string) {
    return this.prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, status: true, customerName: true, customerMobile: true, assignedTo: true, existingLoanDetails: true, requestedLoanAmount: true },
    });
  }

  async getBankByCode(code: string) {
    return this.prisma.bank.findFirst({
      where: { tenantId: DEFAULT_TENANT_ID, code, isActive: true, deletedAt: null },
    });
  }
}
