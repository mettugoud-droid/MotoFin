'use client';

import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export function SuccessConfirmation() {
  return (
    <Card padding="lg" className="text-center animate-slide-up">
      {/* Success animation */}
      <div className="w-20 h-20 mx-auto mb-6 bg-accent-successLight rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-accent-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="10" strokeWidth="2" className="opacity-30" />
          <path
            d="M8 12l3 3 5-5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            className="animate-check"
          />
        </svg>
      </div>

      <h1 className="text-h1 text-brand-primary mb-2">Request Submitted!</h1>
      <p className="text-body text-brand-secondary mb-6">Your callback request has been received successfully.</p>

      {/* Status checklist */}
      <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-accent-success rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-body-sm text-brand-primary">Savings Calculated</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-accent-success rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-body-sm text-brand-primary">Pre-Approval Generated</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-accent-success rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-body-sm text-brand-primary">Callback Requested</span>
        </div>
      </div>

      {/* Expected callback */}
      <div className="bg-highlight-blueLight/50 rounded-xl p-4 mb-6">
        <p className="text-body-sm text-highlight-blueDark font-medium">
          📞 Expected callback: <strong>Within 30 Minutes</strong>
        </p>
      </div>

      <Link href="/">
        <Button variant="secondary">
          Calculate Again
        </Button>
      </Link>
    </Card>
  );
}
