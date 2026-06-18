'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Lock, ShieldCheck, Phone, CreditCard } from 'lucide-react';

const banks = [
  { name: 'HDFC Bank', short: 'HDFC' },
  { name: 'ICICI Bank', short: 'ICICI' },
  { name: 'Axis Bank', short: 'Axis' },
  { name: 'Kotak Mahindra Bank', short: 'Kotak' },
  { name: 'IndusInd Bank', short: 'IndusInd' },
  { name: 'AU Small Finance Bank', short: 'AU Finance' },
];

const trustPoints = [
  { icon: Lock, text: 'Secure & Encrypted' },
  { icon: CreditCard, text: 'No Impact on Credit Score' },
  { icon: CheckCircle, text: 'Free Eligibility Check' },
  { icon: Phone, text: 'Callback Within 30 Minutes' },
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
    <section ref={ref} className="bg-white py-8 md:py-10 px-4 border-b border-slate-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">
          Trusted Refinance Assessment Across Leading Banks
        </h2>

        {/* Desktop bank row */}
        <div className="hidden md:flex items-center justify-center gap-5 lg:gap-8">
          {banks.map((bank, i) => (
            <div
              key={bank.name}
              className={`group flex items-center px-4 py-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-card transition-all duration-300 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-7 h-7 rounded-md bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center mr-2 transition-colors duration-300">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors duration-300">
                  {bank.short.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">
                {bank.short}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-3 min-w-max pb-1">
            {banks.map((bank, i) => (
              <div
                key={bank.name}
                className={`flex items-center px-3.5 py-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex-shrink-0 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center mr-2">
                  <span className="text-[10px] font-bold text-slate-500">{bank.short.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{bank.short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          {trustPoints.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-medium text-slate-600">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
