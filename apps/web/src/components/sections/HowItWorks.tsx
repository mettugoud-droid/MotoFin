'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Enter Your Loan Details',
    description: 'Current EMI, outstanding amount, and interest rate — takes 30 seconds.',
  },
  {
    number: '2',
    title: 'See Instant Savings',
    description: 'Compare rates across 9+ banks and see your approval chances.',
  },
  {
    number: '3',
    title: 'Get Expert Callback',
    description: 'A loan specialist connects you to the best refinance option.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">How It Works</h2>
        <p className="text-slate-500 mb-12">3 simple steps to lower your EMI</p>

        <div className="space-y-8 md:space-y-0 md:flex md:gap-8 text-left md:text-center">
          {steps.map((step, i) => (
            <div key={step.number} className="flex md:flex-col items-start md:items-center gap-4 flex-1">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Calculating <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
