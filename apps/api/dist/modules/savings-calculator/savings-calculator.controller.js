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
exports.SavingsCalculatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const savings_calculator_service_1 = require("./savings-calculator.service");
const calculate_savings_dto_1 = require("./dto/calculate-savings.dto");
const savings_response_dto_1 = require("./dto/savings-response.dto");
let SavingsCalculatorController = class SavingsCalculatorController {
    savingsCalculatorService;
    constructor(savingsCalculatorService) {
        this.savingsCalculatorService = savingsCalculatorService;
    }
    async calculateSavings(dto) {
        const result = await this.savingsCalculatorService.calculateSavings(dto);
        return {
            success: true,
            data: result.data,
            meta: {
                calculationId: result.calculationId,
                responseTimeMs: result.responseTimeMs,
                timestamp: new Date().toISOString(),
            },
        };
    }
};
exports.SavingsCalculatorController = SavingsCalculatorController;
__decorate([
    (0, common_1.Post)('savings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate EMI savings for vehicle loan refinancing',
        description: 'Public endpoint. Calculates potential monthly and total interest savings by comparing current loan terms against best available bank rates.',
    }),
    (0, swagger_1.ApiBody)({ type: calculate_savings_dto_1.CalculateSavingsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Savings calculation successful',
        type: savings_response_dto_1.SavingsCalculationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error — invalid input fields' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Rate limit exceeded' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable — bank rates not loaded' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_savings_dto_1.CalculateSavingsDto]),
    __metadata("design:returntype", Promise)
], SavingsCalculatorController.prototype, "calculateSavings", null);
exports.SavingsCalculatorController = SavingsCalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Calculator'),
    (0, common_1.Controller)('v1/calculator'),
    __metadata("design:paramtypes", [savings_calculator_service_1.SavingsCalculatorService])
], SavingsCalculatorController);
//# sourceMappingURL=savings-calculator.controller.js.map