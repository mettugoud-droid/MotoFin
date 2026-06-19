'use client';

import { BankComparisonItem } from './BankComparisonItem';
import type { BankComparison } from '@/types/calculator';

interface BankComparisonListProps {
  banks: BankComparison[];
}

export function BankComparisonList({ banks }: BankComparisonListProps) {
  if (!banks || banks.length === 0) return null;

  // Sort by highest monthly saving first
  const sorted = [...banks].sort((a, b) => b.monthlySaving - a.monthlySaving);

  return (
    <div>
      <h3 className="text-h3 text-brand-primary mb-4">Best Bank Offers</h3>
      <div className="space-y-3">
        {sorted.map((bank, index) => (
          <BankComparisonItem
            key={bank.bankName}
            bank={bank}
            rank={index + 1}
            isBest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
