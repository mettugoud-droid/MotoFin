'use client';

import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
          <CheckCircle size={14} className="text-green-400" />
          <span className="text-sm font-medium text-green-300">50,000+ customers already saved</span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Ready to Reduce Your EMI?
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-lg mx-auto">
          Check your savings in 30 seconds. No documents, no login, completely free.
        </p>

        <Button
          size="xl"
          onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
          className="group"
        >
          Check My Savings <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-6 mt-10 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-green-400" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-green-400" />
            <span className="text-xs">30 Seconds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-green-400" />
            <span className="text-xs">100% Free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
