'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to Reduce Your EMI?
        </h2>
        <p className="text-slate-300 mb-8">
          Join 50,000+ customers who have saved on their car loans.
        </p>
        <Button
          size="xl"
          onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Check My Savings <ArrowRight size={20} />
        </Button>
        <p className="text-slate-500 text-sm mt-4">⏱ Takes less than 30 seconds</p>
      </div>
    </section>
  );
}
