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
var VehicleValuationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleValuationService = void 0;
const common_1 = require("@nestjs/common");
const decimal_js_1 = __importDefault(require("decimal.js"));
let VehicleValuationService = class VehicleValuationService {
    static { VehicleValuationService_1 = this; }
    static LTV_AT_ORIGINATION = 0.80;
    static ANNUAL_DEPRECIATION_RATE = 0.15;
    static MAX_LTV_FOR_TOPUP = 0.80;
    static REPAYMENT_VARIANCE_THRESHOLD = 0.20;
    static MIN_TOPUP_AMOUNT = 25000;
    estimateCurrentVehicleValue(outstandingAmount, originalTenure, remainingTenure) {
        const elapsedMonths = originalTenure - remainingTenure;
        const elapsedYears = new decimal_js_1.default(elapsedMonths).div(12);
        const estimatedOriginalLoan = new decimal_js_1.default(outstandingAmount).mul(new decimal_js_1.default(originalTenure).div(remainingTenure));
        const originalVehicleValue = estimatedOriginalLoan.div(VehicleValuationService_1.LTV_AT_ORIGINATION);
        const depreciationFactor = new decimal_js_1.default(1).minus(new decimal_js_1.default(VehicleValuationService_1.ANNUAL_DEPRECIATION_RATE).mul(elapsedYears));
        const adjustedFactor = decimal_js_1.default.max(depreciationFactor, new decimal_js_1.default(0.1));
        return originalVehicleValue.mul(adjustedFactor).toDecimalPlaces(2);
    }
    calculateLtv(outstandingAmount, vehicleValue) {
        return new decimal_js_1.default(outstandingAmount).div(vehicleValue).toDecimalPlaces(4);
    }
    checkTopUpEligibility(outstandingAmount, originalTenure, remainingTenure) {
        const vehicleValue = this.estimateCurrentVehicleValue(outstandingAmount, originalTenure, remainingTenure);
        const ltv = this.calculateLtv(outstandingAmount, vehicleValue);
        if (ltv.gte(VehicleValuationService_1.MAX_LTV_FOR_TOPUP)) {
            return { eligible: false, amount: null };
        }
        const elapsedMonths = originalTenure - remainingTenure;
        if (elapsedMonths < 12) {
            return { eligible: false, amount: null };
        }
        const maxLoanOnVehicle = vehicleValue.mul(VehicleValuationService_1.MAX_LTV_FOR_TOPUP);
        const topUpAmount = maxLoanOnVehicle.minus(new decimal_js_1.default(outstandingAmount)).toDecimalPlaces(2);
        if (topUpAmount.lt(VehicleValuationService_1.MIN_TOPUP_AMOUNT)) {
            return { eligible: false, amount: null };
        }
        return { eligible: true, amount: topUpAmount.toNumber() };
    }
};
exports.VehicleValuationService = VehicleValuationService;
exports.VehicleValuationService = VehicleValuationService = VehicleValuationService_1 = __decorate([
    (0, common_1.Injectable)()
], VehicleValuationService);
//# sourceMappingURL=vehicle-valuation.service.js.map