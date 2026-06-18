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
exports.PreApprovalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pre_approval_service_1 = require("./pre-approval.service");
const calculate_pre_approval_dto_1 = require("./dto/calculate-pre-approval.dto");
const pre_approval_response_dto_1 = require("./dto/pre-approval-response.dto");
let PreApprovalController = class PreApprovalController {
    preApprovalService;
    constructor(preApprovalService) {
        this.preApprovalService = preApprovalService;
    }
    async calculatePreApproval(dto) {
        const result = await this.preApprovalService.calculatePreApproval(dto);
        return {
            success: true,
            data: result.data,
            meta: {
                preApprovalId: result.preApprovalId,
                sourceSessionId: dto.sessionId,
                responseTimeMs: result.responseTimeMs,
                timestamp: new Date().toISOString(),
            },
        };
    }
};
exports.PreApprovalController = PreApprovalController;
__decorate([
    (0, common_1.Post)('pre-approval'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate instant pre-approval indication',
        description: 'Public endpoint. Calculates approval probability based on savings calculation data. Shows confidence level and recommended banks.',
    }),
    (0, swagger_1.ApiBody)({ type: calculate_pre_approval_dto_1.CalculatePreApprovalDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pre-approval calculated', type: pre_approval_response_dto_1.PreApprovalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session calculation not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_pre_approval_dto_1.CalculatePreApprovalDto]),
    __metadata("design:returntype", Promise)
], PreApprovalController.prototype, "calculatePreApproval", null);
exports.PreApprovalController = PreApprovalController = __decorate([
    (0, swagger_1.ApiTags)('Calculator'),
    (0, common_1.Controller)('v1/calculator'),
    __metadata("design:paramtypes", [pre_approval_service_1.PreApprovalService])
], PreApprovalController);
//# sourceMappingURL=pre-approval.controller.js.map