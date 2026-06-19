'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/components/ui';
import type { CalculatorFormData } from '@/lib/validations';

interface StepThreeProps {
  register: UseFormRegister<CalculatorFormData>;
  errors: FieldErrors<CalculatorFormData>;
}

export function StepThree({ register, errors }: StepThreeProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-h3 text-brand-primary mb-1">Loan Tenure</h3>
        <p className="text-body-sm text-brand-secondary">Your remaining and original loan tenure</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Remaining Tenure"
          suffix="months"
          type="number"
          placeholder="e.g. 36"
          error={errors.remainingTenure?.message}
          required
          {...register('remainingTenure')}
        />

        <FormField
          label="Original Tenure"
          suffix="months"
          type="number"
          placeholder="e.g. 60"
          error={errors.originalTenure?.message}
          required
          {...register('originalTenure')}
        />
      </div>
    </div>
  );
}
