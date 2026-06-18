'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  const scrollToCalculator = () => {
    trackEvent('hero_cta_clicked', { cta_text: 'Check My Savings' });
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-32 md:pt-28 md:pb-40 px-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-200">
            Free · Instant · No credit check
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-balance">
          Reduce Your Car EMI in 30 Seconds
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg mx-auto">
          Check Monthly Savings, Top-Up Eligibility and Approval Chances Instantly.
        </p>

        {/* Animated EMI Comparison */}
        <EmiComparison />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button size="xl" onClick={scrollToCalculator} className="w-full sm:w-auto">
            Check My Savings <ArrowRight size={20} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToCalculator}
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30"
          >
            See Example Result
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 mt-10 text-slate-400 text-sm">
          <span className="tabular-nums"><strong className="text-white">50,000+</strong> customers</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span className="tabular-nums"><strong className="text-white">9+</strong> banks</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span className="tabular-nums"><strong className="text-green-400">₹3,200</strong> avg saved/mo</span>
        </div>
      </div>
    </section>
  );
}

function EmiComparison() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t); }, []);

  if (!show) return null;

  return (
    <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 animate-fade-in-up">
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <p className="text-slate-400 text-xs mb-0.5">Current EMI</p>
          <p className="text-white/80 font-semibold tabular-nums line-through decoration-red-400">₹28,000</p>
        </div>
        <span className="text-green-400 text-lg">→</span>
        <div className="text-center">
          <p className="text-slate-400 text-xs mb-0.5">New EMI</p>
          <p className="text-white font-bold tabular-nums">₹25,650</p>
        </div>
        <span className="text-green-400 text-lg">→</span>
        <div className="text-center">
          <p className="text-green-400 text-xs mb-0.5">You Save</p>
          <p className="text-green-400 font-bold tabular-nums">₹2,350/mo</p>
        </div>
      </div>
    </div>
  );
}
