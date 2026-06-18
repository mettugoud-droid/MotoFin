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
exports.CalculateSavingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
let IsGreaterThanOrEqualConstraint = class IsGreaterThanOrEqualConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        return value >= relatedValue;
    }
    defaultMessage(args) {
        const [relatedPropertyName] = args.constraints;
        return `$property must be greater than or equal to ${relatedPropertyName}`;
    }
};
IsGreaterThanOrEqualConstraint = __decorate([
    (0, class_validator_2.ValidatorConstraint)({ name: 'isGreaterThanOrEqual', async: false })
], IsGreaterThanOrEqualConstraint);
class CalculateSavingsDto {
    currentEmi;
    outstandingAmount;
    currentRate;
    remainingTenure;
    originalTenure;
    employmentType;
}
exports.CalculateSavingsDto = CalculateSavingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current monthly EMI in INR', example: 25000, minimum: 1, maximum: 10000000 }),
    (0, class_validator_1.IsNumber)({}, { message: 'currentEmi must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'currentEmi must be at least ₹1' }),
    (0, class_validator_1.Max)(10000000, { message: 'currentEmi must not exceed ₹1,00,00,000' }),
    __metadata("design:type", Number)
], CalculateSavingsDto.prototype, "currentEmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Outstanding loan amount in INR', example: 800000, minimum: 1, maximum: 100000000 }),
    (0, class_validator_1.IsNumber)({}, { message: 'outstandingAmount must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'outstandingAmount must be at least ₹1' }),
    (0, class_validator_1.Max)(100000000, { message: 'outstandingAmount must not exceed ₹10,00,00,000' }),
    __metadata("design:type", Number)
], CalculateSavingsDto.prototype, "outstandingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current annual interest rate in %', example: 12.5, minimum: 1, maximum: 30 }),
    (0, class_validator_1.IsNumber)({}, { message: 'currentRate must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'currentRate must be at least 1%' }),
    (0, class_validator_1.Max)(30, { message: 'currentRate must not exceed 30%' }),
    __metadata("design:type", Number)
], CalculateSavingsDto.prototype, "currentRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remaining loan tenure in months', example: 36, minimum: 1, maximum: 120 }),
    (0, class_validator_1.IsInt)({ message: 'remainingTenure must be a whole number' }),
    (0, class_validator_1.Min)(1, { message: 'remainingTenure must be at least 1 month' }),
    (0, class_validator_1.Max)(120, { message: 'remainingTenure must not exceed 120 months' }),
    __metadata("design:type", Number)
], CalculateSavingsDto.prototype, "remainingTenure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original loan tenure in months', example: 60, minimum: 1, maximum: 120 }),
    (0, class_validator_1.IsInt)({ message: 'originalTenure must be a whole number' }),
    (0, class_validator_1.Min)(1, { message: 'originalTenure must be at least 1 month' }),
    (0, class_validator_1.Max)(120, { message: 'originalTenure must not exceed 120 months' }),
    (0, class_validator_1.Validate)(IsGreaterThanOrEqualConstraint, ['remainingTenure'], {
        message: 'originalTenure must be greater than or equal to remainingTenure',
    }),
    __metadata("design:type", Number)
], CalculateSavingsDto.prototype, "originalTenure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employment type for eligibility filtering', enum: ['salaried', 'self_employed', 'business'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['salaried', 'self_employed', 'business'], { message: 'employmentType must be salaried, self_employed, or business' }),
    __metadata("design:type", String)
], CalculateSavingsDto.prototype, "employmentType", void 0);
//# sourceMappingURL=calculate-savings.dto.js.map