'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Lock, ShieldCheck, Phone, CreditCard } from 'lucide-react';

const banks = [
  { name: 'HDFC Bank', short: 'HDFC', color: '#004C8F', bg: '#E8F4FD' },
  { name: 'ICICI Bank', short: 'ICICI', color: '#F58220', bg: '#FFF3E8' },
  { name: 'Axis Bank', short: 'Axis', color: '#97144D', bg: '#F9E8F0' },
  { name: 'Kotak Mahindra', short: 'Kotak', color: '#ED1C24', bg: '#FDE8E8' },
  { name: 'IndusInd Bank', short: 'IndusInd', color: '#5C2D91', bg: '#F0E8F9' },
  { name: 'AU Finance', short: 'AU', color: '#FF6B00', bg: '#FFF0E5' },
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
    <section ref={ref} className="bg-white py-10 md:py-12 px-4 border-b border-slate-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Trusted Refinance Assessment Across Leading Banks
        </h2>

        {/* Bank Logos - Desktop */}
        <div className="hidden md:grid grid-cols-6 gap-4">
          {banks.map((bank, i) => (
            <div
              key={bank.name}
              className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-card-hover transition-all duration-300 cursor-default ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              {/* SVG Bank Logo */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: bank.bg }}
              >
                <span className="text-sm font-black" style={{ color: bank.color }}>
                  {bank.short.substring(0, 2)}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 group-hover:text-slate-800 transition-colors text-center">
                {bank.name}
              </span>
              {/* Hover rate tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                From 8.5% p.a.
              </div>
            </div>
          ))}
        </div>

        {/* Bank Logos - Mobile Carousel */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-3 min-w-max pb-2">
            {banks.map((bank, i) => (
              <div
                key={bank.name}
                className={`flex flex-col items-center px-4 py-3 rounded-xl border border-slate-100 flex-shrink-0 min-w-[90px] ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-1.5"
                  style={{ backgroundColor: bank.bg }}
                >
                  <span className="text-xs font-black" style={{ color: bank.color }}>
                    {bank.short.substring(0, 2)}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600">{bank.short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-slate-100">
          {trustPoints.map(({ icon: Icon, text }, i) => (
            <div
              key={text}
              className={`flex items-center gap-2.5 p-3 rounded-lg bg-green-50/50 border border-green-100/50 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(i + 6) * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-green-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
