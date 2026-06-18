'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-32 md:pt-28 md:pb-40 px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-200">
            Free · Instant · No credit check
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-balance">
          Reduce Your Car EMI in 30 Seconds
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg mx-auto">
          Check Savings, Top-Up Eligibility and Approval Chances Instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="xl" onClick={scrollToCalculator} className="w-full sm:w-auto">
            Check My Savings <ArrowRight size={20} />
          </Button>
          <Button variant="outline" size="lg" onClick={scrollToCalculator} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30">
            See Sample Result
          </Button>
        </div>

        {/* Social Proof */}
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
