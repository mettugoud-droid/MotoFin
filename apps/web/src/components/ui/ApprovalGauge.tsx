'use client';

import { useEffect, useState } from 'react';

interface ApprovalGaugeProps {
  probability: number;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'SUBJECT_TO_VERIFICATION';
  size?: number;
}

export function ApprovalGauge({ probability, confidenceLevel, size = 140 }: ApprovalGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(probability), 200);
    return () => clearTimeout(timer);
  }, [probability]);

  const offset = circumference - (animatedValue / 100) * circumference;

  const colorMap = {
    HIGH: { stroke: '#22C55E', bg: 'bg-green-50', text: 'text-green-700', label: 'High Approval Chance' },
    MODERATE: { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moderate Chance' },
    SUBJECT_TO_VERIFICATION: { stroke: '#F97316', bg: 'bg-orange-50', text: 'text-orange-700', label: 'Subject to Verification' },
  };

  const colors = colorMap[confidenceLevel];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={colors.stroke} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tabular-nums ${colors.text}`}>
            {animatedValue}%
          </span>
        </div>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
        {confidenceLevel === 'HIGH' && '✓ '}{colors.label}
      </span>
    </div>
  );
}
