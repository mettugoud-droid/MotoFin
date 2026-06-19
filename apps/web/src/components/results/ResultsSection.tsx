'use client';

import { useRouter } from 'next/navigation';
import { Card, Button, SkeletonLoader } from '@/components/ui';
import { SavingsCard } from './SavingsCard';
import { BankComparisonList } from './BankComparisonList';
import { TopUpBadge } from './TopUpBadge';
import { PreApprovalCard } from './PreApprovalCard';
import type { SavingsResult, PreApprovalResult } from '@/types/calculator';

interface ResultsSectionProps {
  savings: SavingsResult | null;
  preApproval: PreApprovalResult | null;
  sessionId: string;
  isLoading?: boolean;
}

export function ResultsSection({ savings, preApproval, sessionId, isLoading = false }: ResultsSectionProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <section aria-labelledby="results-heading" className="section">
        <div className="container-app max-w-2xl space-y-6">
          <Card>
            <SkeletonLoader height="2rem" width="60%" className="mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonLoader height="6rem" rounded="lg" />
              <SkeletonLoader height="6rem" rounded="lg" />
            </div>
          </Card>
          <Card>
            <SkeletonLoader height="1.5rem" width="40%" className="mb-4" />
            <SkeletonLoader height="4rem" className="mb-3" />
            <SkeletonLoader height="4rem" className="mb-3" />
            <SkeletonLoader height="4rem" />
          </Card>
        </div>
      </section>
    );
  }

  if (!savings) return null;

  return (
    <section id="results-section" aria-labelledby="results-heading" className="section">
      <div className="container-app max-w-2xl space-y-6">
        <h2 id="results-heading" className="text-h2 text-brand-primary text-center mb-2">
          Your Savings Estimate
        </h2>

        <div className="animate-slide-up">
          <SavingsCard savings={savings} />
        </div>

        {savings.topUpEligible && savings.topUpAmount && (
          <div className="animate-slide-up [animation-delay:100ms]">
            <TopUpBadge amount={savings.topUpAmount} />
          </div>
        )}

        {!savings.isRateCompetitive && savings.bankComparisons.length > 0 && (
          <div className="animate-slide-up [animation-delay:200ms]">
            <Card>
              <BankComparisonList banks={savings.bankComparisons} />
            </Card>
          </div>
        )}

        {preApproval && (
          <div className="animate-slide-up [animation-delay:300ms]">
            <PreApprovalCard result={preApproval} />
          </div>
        )}

        <div className="animate-slide-up [animation-delay:400ms]">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => router.push(`/lead-capture?sid=${sessionId}`)}
            className="shadow-lg shadow-accent-success/25"
          >
            Get Free Callback
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
