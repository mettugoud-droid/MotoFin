'use client';

import { useEffect } from 'react';
import { Card, Badge } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { PreApprovalResult } from '@/types/calculator';

interface PreApprovalCardProps {
  result: PreApprovalResult;
}

const confidenceConfig = {
  HIGH: { color: 'text-confidence-high', bg: 'bg-confidence-high', label: 'High Chance', badgeVariant: 'success' as const },
  MODERATE: { color: 'text-confidence-moderate', bg: 'bg-confidence-moderate', label: 'Moderate Chance', badgeVariant: 'warning' as const },
  SUBJECT_TO_VERIFICATION: { color: 'text-confidence-low', bg: 'bg-confidence-low', label: 'Subject to Verification', badgeVariant: 'warning' as const },
};

export function PreApprovalCard({ result }: PreApprovalCardProps) {
  const { trackEvent } = useAnalytics();
  const config = confidenceConfig[result.confidenceLevel];

  useEffect(() => {
    trackEvent({ event: 'pre_approval_view', confidenceLevel: result.confidenceLevel });
  }, [result.confidenceLevel, trackEvent]);

  return (
    <Card className="border-2 border-accent-success/20">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-h3 text-brand-primary">Pre-Approval Indication</h3>
        <Badge variant={config.badgeVariant}>{config.label}</Badge>
      </div>

      {/* Approval gauge */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-h2 ${config.bg}`}>
          {result.approvalProbability}%
        </div>
        <div>
          <p className={`text-body font-semibold ${config.color}`}>{config.label}</p>
          <p className="text-body-sm text-brand-secondary">{result.confidenceMessage}</p>
        </div>
      </div>

      {/* Recommended banks */}
      {result.recommendedBanks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-border">
          <p className="text-body-sm font-medium text-brand-secondary mb-2">Recommended Banks</p>
          <div className="flex flex-wrap gap-2">
            {result.recommendedBanks.map((bank) => (
              <Badge key={bank.bankName} variant="info">
                {bank.bankName} ({bank.offeredRate}%)
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-caption text-brand-muted mt-4 italic">{result.disclaimer}</p>
    </Card>
  );
}
