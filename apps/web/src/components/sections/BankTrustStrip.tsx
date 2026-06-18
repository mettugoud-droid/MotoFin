'use client';

import { useEffect, useRef, useState } from 'react';

const banks = [
  { name: 'HDFC Bank', short: 'HDFC' },
  { name: 'ICICI Bank', short: 'ICICI' },
  { name: 'Axis Bank', short: 'Axis' },
  { name: 'Kotak Mahindra Bank', short: 'Kotak' },
  { name: 'IndusInd Bank', short: 'IndusInd' },
  { name: 'AU Small Finance Bank', short: 'AU Finance' },
];

export function BankTrustStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-white py-8 md:py-10 px-4 border-b border-slate-100"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Eligible Across Leading Banks
        </h2>

        {/* Desktop: Row layout */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          {banks.map((bank, i) => (
            <div
              key={bank.name}
              className={`group flex items-center justify-center px-5 py-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-card transition-all duration-300 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-8 h-8 rounded-md bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center mr-2.5 transition-colors duration-300">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors duration-300">
                  {bank.short.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">
                {bank.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3 min-w-max pb-2">
            {banks.map((bank, i) => (
              <div
                key={bank.name}
                className={`group flex items-center px-4 py-3 rounded-lg border border-slate-100 bg-slate-50/50 flex-shrink-0 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-slate-500">
                    {bank.short.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                  {bank.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Compare rates from 9+ RBI-registered partner banks
        </p>
      </div>
    </section>
  );
}
