'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Lock, Phone, CreditCard, Star } from 'lucide-react';

const banks = [
  { name: 'HDFC Bank', logo: '/banks/hdfc.svg', rate: '8.75%' },
  { name: 'ICICI Bank', logo: '/banks/icici.svg', rate: '9.00%' },
  { name: 'Axis Bank', logo: '/banks/axis.svg', rate: '9.25%' },
  { name: 'Kotak', logo: '/banks/kotak.svg', rate: '9.10%' },
  { name: 'IndusInd', logo: '/banks/indusind.svg', rate: '9.50%' },
  { name: 'AU Finance', logo: '/banks/au.svg', rate: '8.90%' },
];

const trustPoints = [
  { icon: Lock, text: 'Secure & Encrypted', desc: '256-bit SSL protection' },
  { icon: CreditCard, text: 'No Credit Score Impact', desc: 'Soft check only' },
  { icon: CheckCircle, text: 'Free Eligibility Check', desc: 'Zero charges' },
  { icon: Phone, text: 'Callback in 30 Min', desc: 'Expert specialist' },
];

export function BankTrustStrip() {
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
    <section ref={ref} className="bg-white py-10 md:py-14 px-4 border-b border-slate-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
            Trusted Refinance Assessment Across Leading Banks
          </h2>
          <p className="text-sm text-slate-500">
            Compare rates from India&apos;s top banks. Get the lowest EMI available for your car loan.
          </p>
        </div>

        {/* Bank Logo Grid - Desktop */}
        <div className="hidden md:grid grid-cols-6 gap-4 mb-8">
          {banks.map((bank, i) => (
            <div
              key={bank.name}
              className={`group relative flex flex-col items-center p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <Image
                src={bank.logo}
                alt={bank.name}
                width={100}
                height={36}
                className="mb-2 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-[11px] text-slate-400 group-hover:text-green-600 font-medium transition-colors">
                From {bank.rate} p.a.
              </span>
            </div>
          ))}
        </div>

        {/* Bank Logo Carousel - Mobile */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 mb-8" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-3 min-w-max pb-2">
            {banks.map((bank, i) => (
              <div
                key={bank.name}
                className={`flex flex-col items-center px-4 py-3 rounded-xl border border-slate-100 bg-white flex-shrink-0 min-w-[100px] ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              >
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  width={80}
                  height={30}
                  className="mb-1.5"
                />
                <span className="text-[10px] text-slate-400 font-medium">From {bank.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 rounded-xl p-4 md:p-5">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-slate-800 tabular-nums">50,000+</p>
            <p className="text-xs text-slate-500 mt-0.5">Happy Customers</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-2xl md:text-3xl font-bold text-green-600 tabular-nums">₹3,200</p>
            <p className="text-xs text-slate-500 mt-0.5">Avg Monthly Savings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500">4.8/5 Rating</p>
          </div>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustPoints.map(({ icon: Icon, text, desc }, i) => (
            <div
              key={text}
              className={`flex items-start gap-3 p-3.5 rounded-xl bg-green-50/70 border border-green-100 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(i + 6) * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{text}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
