import { Badge } from '@/components/ui';
import type { BankComparison } from '@/types/calculator';

interface BankComparisonItemProps {
  bank: BankComparison;
  rank: number;
  isBest: boolean;
}

export function BankComparisonItem({ bank, rank, isBest }: BankComparisonItemProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${isBest ? 'bg-accent-successLight/30 border border-accent-success/20 shadow-sm' : 'bg-surface-offWhite hover:bg-surface-offWhite/80'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold ${isBest ? 'bg-accent-success text-white' : 'bg-surface-border text-brand-muted'}`}>
          {rank}
        </div>
        <div>
          <p className="text-body-sm font-semibold text-brand-primary flex items-center gap-2">
            {bank.bankName}
            {isBest && <Badge variant="success">Best</Badge>}
          </p>
          <p className="text-caption text-brand-muted">
            Rate: {bank.offeredRate}% · EMI: ₹{bank.estimatedEmi.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-body-sm font-bold text-accent-successDark tabular-nums">
          ₹{bank.monthlySaving.toLocaleString('en-IN')}
        </p>
        <p className="text-caption text-brand-muted">saved/mo</p>
      </div>
    </div>
  );
}
