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
exports.SavingsCalculationResponseDto = exports.SavingsMetaDto = exports.SavingsCalculationDataDto = exports.RecommendedBankDto = exports.BankComparisonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BankComparisonDto {
    bankName;
    offeredRate;
    estimatedEmi;
    monthlySaving;
    totalSaving;
}
exports.BankComparisonDto = BankComparisonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC Bank' }),
    __metadata("design:type", String)
], BankComparisonDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8.5 }),
    __metadata("design:type", Number)
], BankComparisonDto.prototype, "offeredRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 22500 }),
    __metadata("design:type", Number)
], BankComparisonDto.prototype, "estimatedEmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2500 }),
    __metadata("design:type", Number)
], BankComparisonDto.prototype, "monthlySaving", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 90000 }),
    __metadata("design:type", Number)
], BankComparisonDto.prototype, "totalSaving", void 0);
class RecommendedBankDto {
    name;
    offeredRate;
    estimatedEmi;
}
exports.RecommendedBankDto = RecommendedBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC Bank' }),
    __metadata("design:type", String)
], RecommendedBankDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8.5 }),
    __metadata("design:type", Number)
], RecommendedBankDto.prototype, "offeredRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 22500 }),
    __metadata("design:type", Number)
], RecommendedBankDto.prototype, "estimatedEmi", void 0);
class SavingsCalculationDataDto {
    monthlySaving;
    totalInterestSaving;
    topUpEligible;
    topUpAmount;
    recommendedBank;
    bankComparisons;
    isRateCompetitive;
    competitiveMessage;
}
exports.SavingsCalculationDataDto = SavingsCalculationDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2350, description: 'Monthly EMI saving in INR' }),
    __metadata("design:type", Number)
], SavingsCalculationDataDto.prototype, "monthlySaving", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 84600, description: 'Total interest saving over remaining tenure' }),
    __metadata("design:type", Number)
], SavingsCalculationDataDto.prototype, "totalInterestSaving", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SavingsCalculationDataDto.prototype, "topUpEligible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 175000, description: 'Top-up eligible amount if applicable' }),
    __metadata("design:type", Object)
], SavingsCalculationDataDto.prototype, "topUpAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RecommendedBankDto }),
    __metadata("design:type", RecommendedBankDto)
], SavingsCalculationDataDto.prototype, "recommendedBank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BankComparisonDto], description: 'Top 3 banks sorted by rate ascending' }),
    __metadata("design:type", Array)
], SavingsCalculationDataDto.prototype, "bankComparisons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'True if current rate is already competitive' }),
    __metadata("design:type", Boolean)
], SavingsCalculationDataDto.prototype, "isRateCompetitive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null }),
    __metadata("design:type", Object)
], SavingsCalculationDataDto.prototype, "competitiveMessage", void 0);
class SavingsMetaDto {
    calculationId;
    responseTimeMs;
    timestamp;
}
exports.SavingsMetaDto = SavingsMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    __metadata("design:type", String)
], SavingsMetaDto.prototype, "calculationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 145 }),
    __metadata("design:type", Number)
], SavingsMetaDto.prototype, "responseTimeMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-18T10:30:00.000Z' }),
    __metadata("design:type", String)
], SavingsMetaDto.prototype, "timestamp", void 0);
class SavingsCalculationResponseDto {
    success;
    data;
    meta;
}
exports.SavingsCalculationResponseDto = SavingsCalculationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SavingsCalculationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SavingsCalculationDataDto }),
    __metadata("design:type", SavingsCalculationDataDto)
], SavingsCalculationResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SavingsMetaDto }),
    __metadata("design:type", SavingsMetaDto)
], SavingsCalculationResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=savings-response.dto.js.map