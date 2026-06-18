import { EmiCalculatorService } from '../../shared/services/emi-calculator.service';
import Decimal from 'decimal.js';

describe('EmiCalculatorService', () => {
  let service: EmiCalculatorService;

  beforeEach(() => {
    service = new EmiCalculatorService();
  });

  describe('calculateEmi', () => {
    it('should calculate correct EMI for standard loan', () => {
      // P=800000, r=9%/12/100=0.0075, n=36
      const emi = service.calculateEmi(800000, 9, 36);
      // EMI formula: 800000 * 0.0075 * (1.0075^36) / ((1.0075^36) - 1) ≈ ₹25,439.79
      expect(emi.toNumber()).toBeCloseTo(25439.79, 0);
    });

    it('should calculate correct EMI for high interest rate', () => {
      // P=500000, r=14%, n=48
      const emi = service.calculateEmi(500000, 14, 48);
      expect(emi.toNumber()).toBeGreaterThan(13000);
      expect(emi.toNumber()).toBeLessThan(14500);
    });

    it('should calculate correct EMI for low interest rate', () => {
      // P=1000000, r=8.25%, n=60
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
      expect(emi).toBeInstanceOf(Decimal);
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
      const newEmi = new Decimal(22000);
      const saving = service.calculateMonthlySaving(25000, newEmi);
      expect(saving.toNumber()).toBe(3000);
    });

    it('should return zero when EMIs are equal', () => {
      const newEmi = new Decimal(25000);
      const saving = service.calculateMonthlySaving(25000, newEmi);
      expect(saving.toNumber()).toBe(0);
    });

    it('should return negative when new EMI is higher', () => {
      const newEmi = new Decimal(27000);
      const saving = service.calculateMonthlySaving(25000, newEmi);
      expect(saving.toNumber()).toBe(-2000);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest correctly', () => {
      const emi = new Decimal(25000);
      const totalInterest = service.calculateTotalInterest(emi, 36, 800000);
      // Total payment = 25000 * 36 = 900000; Interest = 900000 - 800000 = 100000
      expect(totalInterest.toNumber()).toBe(100000);
    });
  });
});
