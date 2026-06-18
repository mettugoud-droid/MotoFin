"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsCalculatorModule = void 0;
const common_1 = require("@nestjs/common");
const savings_calculator_controller_1 = require("./savings-calculator.controller");
const savings_calculator_service_1 = require("./savings-calculator.service");
const savings_calculation_repository_1 = require("./repositories/savings-calculation.repository");
let SavingsCalculatorModule = class SavingsCalculatorModule {
};
exports.SavingsCalculatorModule = SavingsCalculatorModule;
exports.SavingsCalculatorModule = SavingsCalculatorModule = __decorate([
    (0, common_1.Module)({
        controllers: [savings_calculator_controller_1.SavingsCalculatorController],
        providers: [savings_calculator_service_1.SavingsCalculatorService, savings_calculation_repository_1.SavingsCalculationRepository],
        exports: [savings_calculator_service_1.SavingsCalculatorService],
    })
], SavingsCalculatorModule);
//# sourceMappingURL=savings-calculator.module.js.map