'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100;
  const currentLabel = labels?.[currentStep - 1] || `Step ${currentStep}`;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-slate-400">{currentLabel}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
