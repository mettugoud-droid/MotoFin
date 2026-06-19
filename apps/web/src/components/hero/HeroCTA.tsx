'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

export function HeroCTA() {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent({ event: 'hero_cta_click' });

    const calculatorSection = document.getElementById('calculator-section');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="btn-primary btn-lg w-full sm:w-auto shadow-lg shadow-accent-success/25"
    >
      Check My Savings
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}
