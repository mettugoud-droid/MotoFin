'use client';

import { useEffect, useRef, useState } from 'react';

const data = [
  { rate: '14%', emi: '₹32,100', save: '—', bar: 100, highlight: false },
  { rate: '12%', emi: '₹28,000', save: '₹4,100', bar: 87, highlight: false },
  { rate: '10%', emi: '₹25,650', save: '₹6,450', bar: 80, highlight: true },
  { rate: '8.75%', emi: '₹24,200', save: '₹7,900', bar: 75, highlight: true },
];

export function SavingsInfographic() {
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
    <section ref={ref} className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            See How Much You Could Save
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            For a ₹8,00,000 loan with 36 months remaining — rates vary by bank
          </p>
        </div>

        {/* Interactive Rate Chart */}
        <div className="bg-white rounded-2xl shadow-card-xl border border-slate-100 p-6 md:p-8">
          <div className="space-y-4">
            {data.map((item, i) => (
              <div
                key={item.rate}
                className={`flex items-center gap-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-14 text-right">
                  <span className={`text-sm font-bold tabular-nums ${item.highlight ? 'text-green-600' : 'text-slate-500'}`}>
                    {item.rate}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="relative h-10 bg-slate-50 rounded-lg overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ease-out flex items-center px-3 ${
                        item.highlight
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-slate-300 to-slate-400'
                      }`}
                      style={{ width: isVisible ? `${item.bar}%` : '0%', transitionDelay: `${i * 200}ms` }}
                    >
                      <span className="text-white text-xs font-bold whitespace-nowrap">
                        EMI {item.emi}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right">
                  {item.save !== '—' ? (
                    <span className={`text-sm font-bold tabular-nums ${item.highlight ? 'text-green-600' : 'text-slate-400'}`}>
                      {item.save}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Current</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Interest rate →</p>
            <p className="text-xs text-slate-400">Monthly savings →</p>
          </div>

          {/* Highlight box */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-green-800">Best Available Rate</p>
              <p className="text-xs text-green-600">HDFC Bank @ 8.75% p.a.</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-700 tabular-nums">₹7,900</p>
              <p className="text-[10px] text-green-600">saved every month</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
