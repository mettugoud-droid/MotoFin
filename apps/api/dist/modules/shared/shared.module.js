"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const emi_calculator_service_1 = require("./services/emi-calculator.service");
const bank_rates_service_1 = require("./services/bank-rates.service");
const vehicle_valuation_service_1 = require("./services/vehicle-valuation.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [emi_calculator_service_1.EmiCalculatorService, bank_rates_service_1.BankRatesService, vehicle_valuation_service_1.VehicleValuationService],
        exports: [emi_calculator_service_1.EmiCalculatorService, bank_rates_service_1.BankRatesService, vehicle_valuation_service_1.VehicleValuationService],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map