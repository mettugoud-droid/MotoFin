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
exports.CaptureLeadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CaptureLeadDto {
    sessionId;
    calculatorType;
    name;
    mobile;
    city;
    currentBank;
    utmSource;
    utmMedium;
    utmCampaign;
    utmContent;
    utmTerm;
    fbclid;
    gclid;
}
exports.CaptureLeadDto = CaptureLeadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID from calculator result', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    (0, class_validator_1.IsUUID)('4', { message: 'sessionId must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'sessionId is required' }),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calculator type that generated the session', enum: ['savings', 'foreclosure'], example: 'savings' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['savings', 'foreclosure'], { message: 'calculatorType must be savings or foreclosure' }),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "calculatorType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer full name', example: 'Surender Goud', minLength: 2, maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indian mobile number (10 digits)', example: '9876543210' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'mobile is required' }),
    (0, class_validator_1.Matches)(/^[6-9]\d{9}$/, { message: 'mobile must be a valid 10-digit Indian mobile number starting with 6-9' }),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer city', example: 'Hyderabad' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'city is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'city must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'city must not exceed 100 characters' }),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current bank name', example: 'HDFC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "currentBank", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UTM Source', example: 'facebook' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "utmSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UTM Medium', example: 'cpc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "utmMedium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UTM Campaign', example: 'refinance_june_2026' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "utmCampaign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UTM Content', example: 'savings_calculator_cta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "utmContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UTM Term', example: 'car+loan+refinance' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "utmTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facebook Click ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "fbclid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Google Click ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureLeadDto.prototype, "gclid", void 0);
//# sourceMappingURL=capture-lead.dto.js.map