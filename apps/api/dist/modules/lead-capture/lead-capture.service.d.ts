import { LeadRepository } from './repositories/lead.repository';
import { SavingsCalculationRepository } from '../savings-calculator/repositories/savings-calculation.repository';
import { NotificationService } from '../notifications/notification.service';
import { CaptureLeadDto } from './dto/capture-lead.dto';
export interface LeadCaptureResult {
    leadId: string;
    existingLead: boolean;
    status: string;
    opportunityCategory: string;
    score: number;
    assignedTo: string | null;
}
export declare class LeadCaptureService {
    private readonly leadRepository;
    private readonly savingsCalcRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(leadRepository: LeadRepository, savingsCalcRepository: SavingsCalculationRepository, notificationService: NotificationService);
    captureLead(dto: CaptureLeadDto): Promise<LeadCaptureResult>;
    private triggerLeadNotification;
    private classifyOpportunity;
    calculateScore(dto: CaptureLeadDto): Promise<number>;
    private getSavingsData;
}
//# sourceMappingURL=lead-capture.service.d.ts.map