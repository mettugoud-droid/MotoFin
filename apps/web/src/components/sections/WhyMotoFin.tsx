'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, TrendingDown, PlusCircle, ShieldCheck, Zap, Users } from 'lucide-react';

const features = [
  { icon: Building2, title: 'Compare Multiple Banks', description: 'Get the lowest rate by comparing 9+ banks in one click.', color: 'blue' },
  { icon: TrendingDown, title: 'Reduce Monthly EMI', description: 'Save ₹2,000 to ₹5,000 every month on your car loan.', color: 'green' },
  { icon: PlusCircle, title: 'Access Top-Up Funding', description: 'Get additional funds up to ₹5 Lakh on your existing loan.', color: 'purple' },
  { icon: ShieldCheck, title: 'Secure & Encrypted', description: '256-bit bank-grade encryption. RBI compliant process.', color: 'emerald' },
  { icon: Zap, title: 'Fast Eligibility Check', description: '30-second instant check. No documents needed upfront.', color: 'amber' },
  { icon: Users, title: 'Expert Loan Specialists', description: 'Dedicated specialist calls within 30 minutes.', color: 'indigo' },
];

const colorMap: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'group-hover:bg-blue-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', hover: 'group-hover:bg-green-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'group-hover:bg-purple-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:bg-emerald-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', hover: 'group-hover:bg-amber-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'group-hover:bg-indigo-100' },
};

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
    <section ref={ref} className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
            Why Choose MotoFin?
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg">
            India&apos;s trusted platform for car loan refinancing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }, i) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group relative p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-card-hover hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 ${c.bg} ${c.hover} rounded-xl flex items-center justify-center mb-5 transition-colors`}>
                  <Icon size={22} className={c.icon} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-lg">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
