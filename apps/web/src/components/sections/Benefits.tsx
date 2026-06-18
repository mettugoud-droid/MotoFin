'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingDown, Percent, PlusCircle, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: TrendingDown,
    title: 'Reduce EMI',
    description: 'Lower your monthly payment by ₹2,000 - ₹5,000. Same car, less burden.',
    scenario: 'Priya from Bangalore saved ₹3,100/month after switching from 12.5% to 8.75%.',
  },
  {
    icon: Percent,
    title: 'Lower Interest Rate',
    description: 'Market rates drop regularly. Your old loan may be overpriced today.',
    scenario: 'Rahul was paying 14% — refinanced to 9.2% and saved ₹4,200 monthly.',
  },
  {
    icon: PlusCircle,
    title: 'Access Top-Up Funding',
    description: 'Get additional ₹50K to ₹5L on your existing loan without new paperwork.',
    scenario: 'Sneha got ₹2.5L top-up along with a lower rate — funded her home renovation.',
  },
  {
    icon: Wallet,
    title: 'Consolidate Finances',
    description: 'One lower EMI instead of juggling multiple payments. Simplify your life.',
    scenario: 'Amit consolidated his car + personal loan into one EMI — saved ₹6,800/month.',
  },
];

export function Benefits() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-3">
          Why Customers Refinance
        </h2>
        <p className="text-slate-500 text-center mb-10 max-w-lg mx-auto">
          Real savings from real customers who switched to lower rates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reasons.map(({ icon: Icon, title, description, scenario }, i) => (
            <div
              key={title}
              className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{description}</p>
              <p className="text-xs text-slate-400 italic border-t border-slate-50 pt-3">
                &ldquo;{scenario}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
