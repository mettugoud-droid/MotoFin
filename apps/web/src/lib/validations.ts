import { z } from 'zod';

export const calculatorSchema = z.object({
  currentEmi: z.coerce.number().min(1, 'EMI must be at least ₹1').max(10000000, 'EMI must not exceed ₹1 Crore'),
  outstandingAmount: z.coerce.number().min(1, 'Amount must be at least ₹1').max(100000000, 'Amount must not exceed ₹10 Crore'),
  currentRate: z.coerce.number().min(1, 'Rate must be at least 1%').max(30, 'Rate must not exceed 30%'),
  remainingTenure: z.coerce.number().int().min(1, 'Tenure must be at least 1 month').max(120, 'Tenure must not exceed 120 months'),
  originalTenure: z.coerce.number().int().min(1, 'Tenure must be at least 1 month').max(120, 'Tenure must not exceed 120 months'),
}).refine((data) => data.originalTenure >= data.remainingTenure, {
  message: 'Original tenure must be >= remaining tenure',
  path: ['originalTenure'],
});

export const leadCaptureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  city: z.string().min(2, 'City is required').max(100),
  currentBank: z.string().optional(),
});

export type CalculatorFormData = z.infer<typeof calculatorSchema>;
export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;
