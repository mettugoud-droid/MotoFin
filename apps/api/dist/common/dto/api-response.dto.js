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
exports.ApiErrorResponseDto = exports.ApiErrorBodyDto = exports.ApiErrorDetailDto = exports.ApiSuccessResponseDto = exports.ApiMetaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiMetaDto {
    timestamp;
    path;
    method;
    responseTimeMs;
    requestId;
}
exports.ApiMetaDto = ApiMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-18T10:30:00.000Z' }),
    __metadata("design:type", String)
], ApiMetaDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/api/v1/calculator/savings' }),
    __metadata("design:type", String)
], ApiMetaDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'GET' }),
    __metadata("design:type", String)
], ApiMetaDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 150 }),
    __metadata("design:type", Number)
], ApiMetaDto.prototype, "responseTimeMs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
    __metadata("design:type", String)
], ApiMetaDto.prototype, "requestId", void 0);
class ApiSuccessResponseDto {
    success;
    data;
    meta;
}
exports.ApiSuccessResponseDto = ApiSuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ApiSuccessResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ApiSuccessResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ApiMetaDto)
], ApiSuccessResponseDto.prototype, "meta", void 0);
class ApiErrorDetailDto {
    field;
    constraint;
    message;
}
exports.ApiErrorDetailDto = ApiErrorDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'currentEmi' }),
    __metadata("design:type", String)
], ApiErrorDetailDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'min' }),
    __metadata("design:type", String)
], ApiErrorDetailDto.prototype, "constraint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'currentEmi must not be less than 1' }),
    __metadata("design:type", String)
], ApiErrorDetailDto.prototype, "message", void 0);
class ApiErrorBodyDto {
    code;
    message;
    details;
}
exports.ApiErrorBodyDto = ApiErrorBodyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VALIDATION_ERROR' }),
    __metadata("design:type", String)
], ApiErrorBodyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Input validation failed' }),
    __metadata("design:type", String)
], ApiErrorBodyDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ApiErrorDetailDto] }),
    __metadata("design:type", Array)
], ApiErrorBodyDto.prototype, "details", void 0);
class ApiErrorResponseDto {
    success;
    error;
    meta;
}
exports.ApiErrorResponseDto = ApiErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ApiErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ApiErrorBodyDto)
], ApiErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ApiMetaDto)
], ApiErrorResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=api-response.dto.js.map