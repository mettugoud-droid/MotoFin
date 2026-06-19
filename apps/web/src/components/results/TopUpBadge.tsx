import { Card } from '@/components/ui';

interface TopUpBadgeProps {
  amount: number;
}

export function TopUpBadge({ amount }: TopUpBadgeProps) {
  return (
    <Card padding="sm" className="bg-[#F5F3FF] border-[#8B5CF6]/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p className="text-body-sm font-semibold text-brand-primary">Top-Up Eligible</p>
          <p className="text-caption text-brand-secondary">
            Get up to <span className="font-bold text-[#8B5CF6] tabular-nums">₹{amount.toLocaleString('en-IN')}</span> additional funds
          </p>
        </div>
      </div>
    </Card>
  );
}
