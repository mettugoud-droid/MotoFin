'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/components/ui';
import type { CalculatorFormData } from '@/lib/validations';

interface StepOneProps {
  register: UseFormRegister<CalculatorFormData>;
  errors: FieldErrors<CalculatorFormData>;
}

export function StepOne({ register, errors }: StepOneProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-h3 text-brand-primary mb-1">Loan Details</h3>
        <p className="text-body-sm text-brand-secondary">Enter your current loan information</p>
      </div>

      <FormField
        label="Current Monthly EMI"
        prefix="₹"
        type="number"
        placeholder="e.g. 25,000"
        error={errors.currentEmi?.message}
        required
        {...register('currentEmi')}
      />

      <FormField
        label="Outstanding Loan Amount"
        prefix="₹"
        type="number"
        placeholder="e.g. 8,00,000"
        error={errors.outstandingAmount?.message}
        required
        {...register('outstandingAmount')}
      />
    </div>
  );
}
