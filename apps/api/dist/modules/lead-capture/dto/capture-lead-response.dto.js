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
exports.CaptureLeadResponseDto = exports.CaptureLeadMetaDto = exports.CaptureLeadDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CaptureLeadDataDto {
    leadId;
    existingLead;
    status;
    opportunityCategory;
    score;
    assignedTo;
    message;
}
exports.CaptureLeadDataDto = CaptureLeadDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    __metadata("design:type", String)
], CaptureLeadDataDto.prototype, "leadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'True if mobile already existed in system' }),
    __metadata("design:type", Boolean)
], CaptureLeadDataDto.prototype, "existingLead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NEW' }),
    __metadata("design:type", String)
], CaptureLeadDataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'refinance_opportunity' }),
    __metadata("design:type", String)
], CaptureLeadDataDto.prototype, "opportunityCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 70 }),
    __metadata("design:type", Number)
], CaptureLeadDataDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'exec-uuid', description: 'Assigned sales executive ID' }),
    __metadata("design:type", Object)
], CaptureLeadDataDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Your savings report has been unlocked. Our team will contact you shortly.' }),
    __metadata("design:type", String)
], CaptureLeadDataDto.prototype, "message", void 0);
class CaptureLeadMetaDto {
    timestamp;
    source;
}
exports.CaptureLeadMetaDto = CaptureLeadMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-18T10:30:00.000Z' }),
    __metadata("design:type", String)
], CaptureLeadMetaDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'savings_calculator' }),
    __metadata("design:type", String)
], CaptureLeadMetaDto.prototype, "source", void 0);
class CaptureLeadResponseDto {
    success;
    data;
    meta;
}
exports.CaptureLeadResponseDto = CaptureLeadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CaptureLeadResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CaptureLeadDataDto }),
    __metadata("design:type", CaptureLeadDataDto)
], CaptureLeadResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CaptureLeadMetaDto }),
    __metadata("design:type", CaptureLeadMetaDto)
], CaptureLeadResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=capture-lead-response.dto.js.map