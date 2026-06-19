'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/components/ui';
import type { CalculatorFormData } from '@/lib/validations';

interface StepTwoProps {
  register: UseFormRegister<CalculatorFormData>;
  errors: FieldErrors<CalculatorFormData>;
}

export function StepTwo({ register, errors }: StepTwoProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-h3 text-brand-primary mb-1">Interest Rate</h3>
        <p className="text-body-sm text-brand-secondary">Your current loan interest rate</p>
      </div>

      <FormField
        label="Current Interest Rate"
        suffix="%"
        type="number"
        step="0.01"
        placeholder="e.g. 12.5"
        error={errors.currentRate?.message}
        helpText="You can find this on your loan statement or bank app"
        required
        {...register('currentRate')}
      />
    </div>
  );
}
