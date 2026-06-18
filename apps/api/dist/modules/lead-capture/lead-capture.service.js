"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LeadCaptureService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadCaptureService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const lead_repository_1 = require("./repositories/lead.repository");
const savings_calculation_repository_1 = require("../savings-calculator/repositories/savings-calculation.repository");
const notification_service_1 = require("../notifications/notification.service");
const METRO_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
let LeadCaptureService = LeadCaptureService_1 = class LeadCaptureService {
    leadRepository;
    savingsCalcRepository;
    notificationService;
    logger = new common_1.Logger(LeadCaptureService_1.name);
    constructor(leadRepository, savingsCalcRepository, notificationService) {
        this.leadRepository = leadRepository;
        this.savingsCalcRepository = savingsCalcRepository;
        this.notificationService = notificationService;
    }
    async captureLead(dto) {
        const existingLead = await this.leadRepository.findByMobile(dto.mobile);
        if (existingLead) {
            await this.leadRepository.updateLastInteraction(existingLead.id);
            this.logger.log(`Duplicate lead detected: ${dto.mobile} → existing lead ${existingLead.id}`);
            return {
                leadId: existingLead.id,
                existingLead: true,
                status: existingLead.status,
                opportunityCategory: existingLead.opportunityCategory || 'refinance_opportunity',
                score: existingLead.opportunityScore || 0,
                assignedTo: existingLead.assignedTo,
            };
        }
        const opportunityCategory = this.classifyOpportunity(dto.calculatorType);
        const score = await this.calculateScore(dto);
        const sourceType = dto.calculatorType === 'savings' ? 'savings_calculator' : 'foreclosure_calculator';
        const leadSource = await this.leadRepository.getLeadSourceByType(sourceType);
        if (!leadSource) {
            throw new common_1.NotFoundException(`Lead source not found for type: ${sourceType}`);
        }
        const executive = await this.leadRepository.getFirstActiveExecutive();
        const assignedTo = executive ? executive.id : null;
        const savingsData = await this.getSavingsData(dto.sessionId);
        const lead = await this.leadRepository.create({
            customerName: dto.name,
            customerMobile: dto.mobile,
            customerCity: dto.city,
            leadSourceId: leadSource.id,
            assignedTo,
            status: client_1.LeadStatus.NEW,
            opportunityCategory,
            opportunityScore: score,
            existingLoanDetails: savingsData ? {
                currentEmi: Number(savingsData.currentEmi),
                outstandingAmount: Number(savingsData.outstandingAmount),
                currentRate: Number(savingsData.currentRate),
                remainingTenure: savingsData.remainingTenure,
                originalTenure: savingsData.originalTenure,
                currentBank: dto.currentBank || null,
                sessionId: dto.sessionId,
            } : null,
            requestedLoanAmount: savingsData ? Number(savingsData.outstandingAmount) : null,
            utmSource: dto.utmSource || null,
            utmMedium: dto.utmMedium || null,
            utmCampaign: dto.utmCampaign || null,
            utmContent: dto.utmContent || null,
            utmTerm: dto.utmTerm || null,
        });
        if (savingsData) {
            await this.savingsCalcRepository.markLeadCaptured(savingsData.id, lead.id);
        }
        this.triggerLeadNotification(dto.name, dto.mobile, lead.id, savingsData).catch((err) => {
            this.logger.error(`Failed to send lead notification: ${err instanceof Error ? err.message : 'Unknown error'}`);
        });
        this.logger.log(`Lead captured: ${dto.name} (${dto.mobile}) → ${opportunityCategory}, score=${score}, assigned=${assignedTo ? 'yes' : 'no'}`);
        return {
            leadId: lead.id,
            existingLead: false,
            status: client_1.LeadStatus.NEW,
            opportunityCategory,
            score,
            assignedTo,
        };
    }
    async triggerLeadNotification(name, mobile, leadId, savingsData) {
        const monthlySaving = savingsData?.monthlySaving ? Number(savingsData.monthlySaving) : undefined;
        const recommendedBank = savingsData?.recommendedBank || undefined;
        await this.notificationService.sendLeadWelcomeNotification({
            name,
            mobile,
            leadId,
            monthlySaving,
            recommendedBank,
        });
    }
    classifyOpportunity(calculatorType) {
        switch (calculatorType) {
            case 'savings':
                return client_1.OpportunityCategory.refinance_opportunity;
            case 'foreclosure':
                return client_1.OpportunityCategory.balance_transfer_opportunity;
            default:
                return client_1.OpportunityCategory.refinance_opportunity;
        }
    }
    async calculateScore(dto) {
        let score = 0;
        const savingsData = await this.getSavingsData(dto.sessionId);
        if (savingsData) {
            const monthlySaving = savingsData.monthlySaving ? Number(savingsData.monthlySaving) : 0;
            const outstandingAmount = Number(savingsData.outstandingAmount);
            const topUpEligible = savingsData.topUpEligible;
            if (monthlySaving > 2000) {
                score += 30;
            }
            else if (monthlySaving > 1000) {
                score += 20;
            }
            if (outstandingAmount > 500000) {
                score += 20;
            }
            if (topUpEligible) {
                score += 20;
            }
        }
        const isMetroCity = METRO_CITIES.some((city) => city.toLowerCase() === dto.city.toLowerCase());
        if (isMetroCity) {
            score += 10;
        }
        return Math.min(score, 100);
    }
    async getSavingsData(sessionId) {
        try {
            return await this.savingsCalcRepository.findBySessionId(sessionId);
        }
        catch {
            return null;
        }
    }
};
exports.LeadCaptureService = LeadCaptureService;
exports.LeadCaptureService = LeadCaptureService = LeadCaptureService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lead_repository_1.LeadRepository,
        savings_calculation_repository_1.SavingsCalculationRepository,
        notification_service_1.NotificationService])
], LeadCaptureService);
//# sourceMappingURL=lead-capture.service.js.map