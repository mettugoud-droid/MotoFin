'use client';

import { CALCULATOR_STEPS } from '@/lib/constants';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm font-medium text-brand-primary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-caption text-brand-muted">
            {CALCULATOR_STEPS[currentStep - 1]?.title}
          </span>
        </div>
        <div className="h-2 bg-surface-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-success rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStep} of ${totalSteps}: ${CALCULATOR_STEPS[currentStep - 1]?.title}`}
          />
        </div>
      </div>

      {/* Desktop: Horizontal stepper */}
      <div className="hidden md:flex items-center justify-between" role="list" aria-label="Calculator progress">
        {CALCULATOR_STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isFuture = stepNum > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none" role="listitem">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-semibold transition-all duration-300
                    ${isCompleted ? 'bg-accent-success text-white' : ''}
                    ${isCurrent ? 'bg-accent-success text-white animate-step-pulse' : ''}
                    ${isFuture ? 'bg-surface-border text-brand-muted' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`mt-2 text-caption ${isCurrent ? 'text-brand-primary font-semibold' : 'text-brand-muted'}`}>
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {index < CALCULATOR_STEPS.length - 1 && (
                <div className="flex-1 mx-3 mt-[-1.5rem]">
                  <div className="h-0.5 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-accent-success transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
