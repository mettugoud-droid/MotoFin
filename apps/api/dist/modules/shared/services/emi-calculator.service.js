"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmiCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const decimal_js_1 = __importDefault(require("decimal.js"));
let EmiCalculatorService = class EmiCalculatorService {
    calculateEmi(principal, annualRate, tenureMonths) {
        const P = new decimal_js_1.default(principal);
        const annualRateDecimal = new decimal_js_1.default(annualRate);
        const n = new decimal_js_1.default(tenureMonths);
        const r = annualRateDecimal.div(12).div(100);
        if (r.isZero()) {
            return P.div(n).toDecimalPlaces(2);
        }
        const onePlusR = r.plus(1);
        const onePlusRPowN = onePlusR.pow(n);
        const numerator = P.mul(r).mul(onePlusRPowN);
        const denominator = onePlusRPowN.minus(1);
        return numerator.div(denominator).toDecimalPlaces(2);
    }
    calculateTotalInterest(emi, tenureMonths, principal) {
        const totalPayment = emi.mul(tenureMonths);
        const P = new decimal_js_1.default(principal);
        return totalPayment.minus(P).toDecimalPlaces(2);
    }
    calculateMonthlySaving(currentEmi, newEmi) {
        return new decimal_js_1.default(currentEmi).minus(newEmi).toDecimalPlaces(2);
    }
    calculateTotalInterestSaving(currentTotalInterest, newTotalInterest) {
        return currentTotalInterest.minus(newTotalInterest).toDecimalPlaces(2);
    }
};
exports.EmiCalculatorService = EmiCalculatorService;
exports.EmiCalculatorService = EmiCalculatorService = __decorate([
    (0, common_1.Injectable)()
], EmiCalculatorService);
//# sourceMappingURL=emi-calculator.service.js.map