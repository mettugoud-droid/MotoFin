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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreApprovalResponseDto = exports.PreApprovalMetaDto = exports.PreApprovalDataDto = exports.PreApprovalBankDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PreApprovalBankDto {
    bankName;
    offeredRate;
    historicalApprovalRate;
}
exports.PreApprovalBankDto = PreApprovalBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC Bank' }),
    __metadata("design:type", String)
], PreApprovalBankDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8.5 }),
    __metadata("design:type", Number)
], PreApprovalBankDto.prototype, "offeredRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 72.5 }),
    __metadata("design:type", Number)
], PreApprovalBankDto.prototype, "historicalApprovalRate", void 0);
class PreApprovalDataDto {
    approvalProbability;
    confidenceLevel;
    confidenceMessage;
    topUpEligibility;
    recommendedBanks;
    disclaimer;
}
exports.PreApprovalDataDto = PreApprovalDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 84, description: 'Approval probability 0-100' }),
    __metadata("design:type", Number)
], PreApprovalDataDto.prototype, "approvalProbability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH', enum: ['HIGH', 'MODERATE', 'SUBJECT_TO_VERIFICATION'] }),
    __metadata("design:type", String)
], PreApprovalDataDto.prototype, "confidenceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'High Chance of Approval' }),
    __metadata("design:type", String)
], PreApprovalDataDto.prototype, "confidenceMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 175000, description: 'Top-up eligible amount in INR' }),
    __metadata("design:type", Object)
], PreApprovalDataDto.prototype, "topUpEligibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PreApprovalBankDto], description: 'Top 3 recommended banks' }),
    __metadata("design:type", Array)
], PreApprovalDataDto.prototype, "recommendedBanks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is an indicative estimate based on the information provided. Final approval is subject to document verification and bank assessment.' }),
    __metadata("design:type", String)
], PreApprovalDataDto.prototype, "disclaimer", void 0);
class PreApprovalMetaDto {
    preApprovalId;
    sourceSessionId;
    responseTimeMs;
    timestamp;
}
exports.PreApprovalMetaDto = PreApprovalMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    __metadata("design:type", String)
], PreApprovalMetaDto.prototype, "preApprovalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    __metadata("design:type", String)
], PreApprovalMetaDto.prototype, "sourceSessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85 }),
    __metadata("design:type", Number)
], PreApprovalMetaDto.prototype, "responseTimeMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-18T10:30:00.000Z' }),
    __metadata("design:type", String)
], PreApprovalMetaDto.prototype, "timestamp", void 0);
class PreApprovalResponseDto {
    success;
    data;
    meta;
}
exports.PreApprovalResponseDto = PreApprovalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PreApprovalResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PreApprovalDataDto }),
    __metadata("design:type", PreApprovalDataDto)
], PreApprovalResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PreApprovalMetaDto }),
    __metadata("design:type", PreApprovalMetaDto)
], PreApprovalResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=pre-approval-response.dto.js.map