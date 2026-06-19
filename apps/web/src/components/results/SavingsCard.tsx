'use client';

import { AnimatedCounter } from './AnimatedCounter';
import { Card } from '@/components/ui';
import type { SavingsResult } from '@/types/calculator';

interface SavingsCardProps {
  savings: SavingsResult;
}

export function SavingsCard({ savings }: SavingsCardProps) {
  if (savings.isRateCompetitive) {
    return (
      <Card className="bg-accent-successLight border-accent-success/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-success/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-body font-semibold text-brand-primary">Great news!</p>
            <p className="text-body-sm text-brand-secondary">{savings.competitiveMessage}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-accent-successLight/50 rounded-xl p-5 text-center">
          <p className="text-caption font-medium text-accent-successDark mb-1">Monthly Saving</p>
          <p className="text-h1 font-bold text-accent-successDark">
            <AnimatedCounter value={savings.monthlySaving} />
          </p>
          <p className="text-caption text-brand-muted mt-1">per month</p>
        </div>
        <div className="bg-highlight-blueLight/50 rounded-xl p-5 text-center">
          <p className="text-caption font-medium text-highlight-blueDark mb-1">Total Interest Saved</p>
          <p className="text-h1 font-bold text-highlight-blueDark">
            <AnimatedCounter value={savings.totalInterestSaving} />
          </p>
          <p className="text-caption text-brand-muted mt-1">over loan tenure</p>
        </div>
      </div>
    </Card>
  );
}
