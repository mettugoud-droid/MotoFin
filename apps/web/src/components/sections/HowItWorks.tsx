'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, FileText, BarChart3, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Enter Your Loan Details',
    description: 'Current EMI, outstanding amount, and interest rate — takes just 30 seconds.',
    color: 'blue',
  },
  {
    icon: BarChart3,
    number: '02',
    title: 'See Instant Savings',
    description: 'Compare rates across 9+ banks. See your approval chances and top-up eligibility.',
    color: 'green',
  },
  {
    icon: PhoneCall,
    number: '03',
    title: 'Get Expert Callback',
    description: 'A dedicated loan specialist calls within 30 minutes with best options.',
    color: 'purple',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string; num: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200', num: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200', num: 'text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200', num: 'text-purple-600' },
};

export function HowItWorks() {
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">How It Works</h2>
          <p className="text-slate-500">3 simple steps to lower your EMI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200" />

          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={step.number}
                className={`relative text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
              >
                {/* Step icon circle */}
                <div className={`relative z-10 w-16 h-16 ${colors.bg} border-2 ${colors.border} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110 duration-300`}>
                  <step.icon size={24} className={colors.icon} />
                </div>
                {/* Step number */}
                <p className={`text-xs font-bold ${colors.num} uppercase tracking-wider mb-2`}>Step {step.number}</p>
                <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
            Start Calculating <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
