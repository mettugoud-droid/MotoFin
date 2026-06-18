'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TrendingDown, ArrowRight } from 'lucide-react';

const bankRates = [
  { bank: 'Your Current Rate', logo: null, rate: '14.0%', emi: '₹32,100', save: '—', bar: 100, current: true },
  { bank: 'IndusInd Bank', logo: '/banks/indusind.svg', rate: '9.5%', emi: '₹26,400', save: '₹5,700', bar: 82, current: false },
  { bank: 'ICICI Bank', logo: '/banks/icici.svg', rate: '9.0%', emi: '₹25,900', save: '₹6,200', bar: 80, current: false },
  { bank: 'Axis Bank', logo: '/banks/axis.svg', rate: '8.9%', emi: '₹25,750', save: '₹6,350', bar: 79, current: false },
  { bank: 'HDFC Bank', logo: '/banks/hdfc.svg', rate: '8.75%', emi: '₹25,650', save: '₹6,450', bar: 78, current: false },
];

export function SavingsInfographic() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
            <TrendingDown size={14} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">Live Rate Comparison</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            See How Much You Could Save
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Example: ₹8,00,000 loan with 36 months remaining — compare bank offers
          </p>
        </div>

        {/* Rate Comparison Chart */}
        <div className="bg-white rounded-2xl shadow-card-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
            <div className="col-span-4">Bank</div>
            <div className="col-span-2 text-center">Rate</div>
            <div className="col-span-3 text-center">EMI</div>
            <div className="col-span-3 text-right">You Save</div>
          </div>

          {/* Rows */}
          {bankRates.map((item, i) => (
            <div
              key={item.bank}
              className={`grid grid-cols-12 gap-2 items-center px-5 py-4 border-b border-slate-50 last:border-b-0 transition-all duration-500 ${
                !item.current ? 'hover:bg-green-50/30' : 'bg-red-50/30'
              } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards' }}
            >
              {/* Bank */}
              <div className="col-span-4 flex items-center gap-2">
                {item.logo ? (
                  <Image src={item.logo} alt={item.bank} width={60} height={22} className="rounded" />
                ) : (
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">You</span>
                )}
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">{item.bank}</span>
              </div>
              {/* Rate */}
              <div className="col-span-2 text-center">
                <span className={`text-sm font-bold tabular-nums ${item.current ? 'text-red-500' : 'text-green-600'}`}>
                  {item.rate}
                </span>
              </div>
              {/* EMI */}
              <div className="col-span-3 text-center">
                <span className={`text-sm font-semibold tabular-nums ${item.current ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.emi}
                </span>
              </div>
              {/* Savings */}
              <div className="col-span-3 text-right">
                {item.save !== '—' ? (
                  <span className="text-sm font-bold text-green-600 tabular-nums">{item.save}/mo</span>
                ) : (
                  <span className="text-xs text-slate-400">Current</span>
                )}
              </div>
            </div>
          ))}

          {/* Best Rate Highlight */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/banks/hdfc.svg" alt="HDFC" width={70} height={26} className="rounded" />
              <div>
                <p className="text-sm font-bold text-green-800">Best Rate: 8.75% p.a.</p>
                <p className="text-xs text-green-600">Lowest available for your profile</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-700 tabular-nums">₹6,450</p>
              <p className="text-[10px] text-green-600">saved every month</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm hover:text-green-700 hover:gap-3 transition-all"
          >
            Check your personalized savings <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
