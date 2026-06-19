'use client';

import type { CalculatorFormData } from '@/lib/validations';

interface StepFourProps {
  formData: CalculatorFormData;
  onEdit: (step: number) => void;
}

export function StepFour({ formData, onEdit }: StepFourProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-h3 text-brand-primary mb-1">Review Your Details</h3>
        <p className="text-body-sm text-brand-secondary">Confirm your loan information before calculating</p>
      </div>

      <div className="space-y-3">
        {/* Loan Details */}
        <div className="flex items-center justify-between p-4 bg-surface-offWhite rounded-xl">
          <div>
            <p className="text-caption text-brand-muted">Monthly EMI</p>
            <p className="text-body font-semibold text-brand-primary tabular-nums">
              ₹{formData.currentEmi?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <button onClick={() => onEdit(1)} className="text-caption text-highlight-blue hover:underline">Edit</button>
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-offWhite rounded-xl">
          <div>
            <p className="text-caption text-brand-muted">Outstanding Amount</p>
            <p className="text-body font-semibold text-brand-primary tabular-nums">
              ₹{formData.outstandingAmount?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <button onClick={() => onEdit(1)} className="text-caption text-highlight-blue hover:underline">Edit</button>
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-offWhite rounded-xl">
          <div>
            <p className="text-caption text-brand-muted">Interest Rate</p>
            <p className="text-body font-semibold text-brand-primary tabular-nums">
              {formData.currentRate || '—'}%
            </p>
          </div>
          <button onClick={() => onEdit(2)} className="text-caption text-highlight-blue hover:underline">Edit</button>
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-offWhite rounded-xl">
          <div>
            <p className="text-caption text-brand-muted">Tenure</p>
            <p className="text-body font-semibold text-brand-primary tabular-nums">
              {formData.remainingTenure || '—'} / {formData.originalTenure || '—'} months
            </p>
          </div>
          <button onClick={() => onEdit(3)} className="text-caption text-highlight-blue hover:underline">Edit</button>
        </div>
      </div>
    </div>
  );
}
