'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingDown, Percent, PlusCircle, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: TrendingDown,
    title: 'Reduce EMI',
    description: 'Lower your monthly payment by ₹2,000 - ₹5,000. Same car, less burden.',
    scenario: 'Priya from Bangalore saved ₹3,100/month after switching from 12.5% to 8.75%.',
    stat: '₹3,100',
    statLabel: 'saved/month',
  },
  {
    icon: Percent,
    title: 'Lower Interest Rate',
    description: 'Market rates drop regularly. Your old loan may be overpriced today.',
    scenario: 'Rahul was paying 14% — refinanced to 9.2% and saved ₹4,200 monthly.',
    stat: '4.8%',
    statLabel: 'rate drop',
  },
  {
    icon: PlusCircle,
    title: 'Access Top-Up Funding',
    description: 'Get additional ₹50K to ₹5L on your existing loan without new paperwork.',
    scenario: 'Sneha got ₹2.5L top-up along with a lower rate — funded her home renovation.',
    stat: '₹2.5L',
    statLabel: 'top-up',
  },
  {
    icon: Wallet,
    title: 'Consolidate Finances',
    description: 'One lower EMI instead of juggling multiple payments. Simplify your life.',
    scenario: 'Amit consolidated his car + personal loan into one EMI — saved ₹6,800/month.',
    stat: '₹6,800',
    statLabel: 'saved/month',
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
    <section ref={ref} className="section-padding bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
            Why Customers Refinance
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            Real savings from real customers who switched to lower rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map(({ icon: Icon, title, description, scenario, stat, statLabel }, i) => (
            <div
              key={title}
              className={`premium-card p-7 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
                  <Icon size={20} className="text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 tabular-nums">{stat}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{statLabel}</p>
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-lg">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  &ldquo;{scenario}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
