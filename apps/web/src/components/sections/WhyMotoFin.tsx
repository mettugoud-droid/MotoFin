'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, TrendingDown, PlusCircle, ShieldCheck, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Compare Multiple Banks',
    description: 'Get the lowest rate by comparing 9+ banks in one click.',
  },
  {
    icon: TrendingDown,
    title: 'Reduce Monthly EMI',
    description: 'Save ₹2,000 to ₹5,000 every month on your car loan.',
  },
  {
    icon: PlusCircle,
    title: 'Access Top-Up Funding',
    description: 'Get additional funds up to ₹5 Lakh on your existing loan.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Encrypted Process',
    description: '256-bit bank-grade encryption. Your data is never shared.',
  },
  {
    icon: Zap,
    title: 'Fast Eligibility Check',
    description: '30-second instant check. No documents needed upfront.',
  },
  {
    icon: Users,
    title: 'Expert Loan Specialists',
    description: 'Dedicated specialist calls within 30 minutes of your request.',
  },
];

export function WhyMotoFin() {
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
    <section ref={ref} className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Why Choose MotoFin?
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            India&apos;s trusted platform for car loan refinancing. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`relative p-6 rounded-xl border border-slate-100 bg-white hover:shadow-card-hover hover:border-slate-200 transition-all duration-300 group ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <Icon size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
