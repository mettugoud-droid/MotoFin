'use client';

import { Button } from '@/components/ui';

interface CalculatorNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function CalculatorNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: CalculatorNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-border">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={isFirstStep}
        className={isFirstStep ? 'invisible' : ''}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Button>

      {isLastStep ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          isLoading={isSubmitting}
          fullWidth={false}
        >
          Calculate Savings
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      ) : (
        <Button variant="primary" onClick={onNext}>
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}
    </div>
  );
}
