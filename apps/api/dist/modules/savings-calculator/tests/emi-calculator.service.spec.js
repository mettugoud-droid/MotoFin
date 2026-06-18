"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emi_calculator_service_1 = require("../../shared/services/emi-calculator.service");
const decimal_js_1 = __importDefault(require("decimal.js"));
describe('EmiCalculatorService', () => {
    let service;
    beforeEach(() => {
        service = new emi_calculator_service_1.EmiCalculatorService();
    });
    describe('calculateEmi', () => {
        it('should calculate correct EMI for standard loan', () => {
            const emi = service.calculateEmi(800000, 9, 36);
            expect(emi.toNumber()).toBeCloseTo(25439.79, 0);
        });
        it('should calculate correct EMI for high interest rate', () => {
            const emi = service.calculateEmi(500000, 14, 48);
            expect(emi.toNumber()).toBeGreaterThan(13000);
            expect(emi.toNumber()).toBeLessThan(14500);
        });
        it('should calculate correct EMI for low interest rate', () => {
            const emi = service.calculateEmi(1000000, 8.25, 60);
            expect(emi.toNumber()).toBeGreaterThan(20000);
            expect(emi.toNumber()).toBeLessThan(21000);
        });
        it('should handle zero interest rate', () => {
            const emi = service.calculateEmi(360000, 0, 36);
            expect(emi.toNumber()).toBe(10000);
        });
        it('should return Decimal type for precision', () => {
            const emi = service.calculateEmi(800000, 12, 36);
            expect(emi).toBeInstanceOf(decimal_js_1.default);
        });
        it('should round to 2 decimal places', () => {
            const emi = service.calculateEmi(800000, 12.5, 36);
            const str = emi.toString();
            const decimalPart = str.split('.')[1] || '';
            expect(decimalPart.length).toBeLessThanOrEqual(2);
        });
    });
    describe('calculateMonthlySaving', () => {
        it('should return positive saving when new EMI is lower', () => {
            const newEmi = new decimal_js_1.default(22000);
            const saving = service.calculateMonthlySaving(25000, newEmi);
            expect(saving.toNumber()).toBe(3000);
        });
        it('should return zero when EMIs are equal', () => {
            const newEmi = new decimal_js_1.default(25000);
            const saving = service.calculateMonthlySaving(25000, newEmi);
            expect(saving.toNumber()).toBe(0);
        });
        it('should return negative when new EMI is higher', () => {
            const newEmi = new decimal_js_1.default(27000);
            const saving = service.calculateMonthlySaving(25000, newEmi);
            expect(saving.toNumber()).toBe(-2000);
        });
    });
    describe('calculateTotalInterest', () => {
        it('should calculate total interest correctly', () => {
            const emi = new decimal_js_1.default(25000);
            const totalInterest = service.calculateTotalInterest(emi, 36, 800000);
            expect(totalInterest.toNumber()).toBe(100000);
        });
    });
});
//# sourceMappingURL=emi-calculator.service.spec.js.map