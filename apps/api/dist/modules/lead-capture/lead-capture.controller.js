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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadCaptureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lead_capture_service_1 = require("./lead-capture.service");
const capture_lead_dto_1 = require("./dto/capture-lead.dto");
const capture_lead_response_dto_1 = require("./dto/capture-lead-response.dto");
let LeadCaptureController = class LeadCaptureController {
    leadCaptureService;
    constructor(leadCaptureService) {
        this.leadCaptureService = leadCaptureService;
    }
    async captureLead(dto) {
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
};
exports.LeadCaptureController = LeadCaptureController;
__decorate([
    (0, common_1.Post)('capture-lead'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Capture lead from calculator result',
        description: 'Public endpoint. Captures customer contact details after viewing calculator savings results. Creates a lead in CRM with scoring and auto-assignment.',
    }),
    (0, swagger_1.ApiBody)({ type: capture_lead_dto_1.CaptureLeadDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lead captured successfully', type: capture_lead_response_dto_1.CaptureLeadResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session or lead source not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [capture_lead_dto_1.CaptureLeadDto]),
    __metadata("design:returntype", Promise)
], LeadCaptureController.prototype, "captureLead", null);
exports.LeadCaptureController = LeadCaptureController = __decorate([
    (0, swagger_1.ApiTags)('Leads'),
    (0, common_1.Controller)('v1/calculator'),
    __metadata("design:paramtypes", [lead_capture_service_1.LeadCaptureService])
], LeadCaptureController);
//# sourceMappingURL=lead-capture.controller.js.map