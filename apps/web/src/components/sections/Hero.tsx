'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  const scrollToCalculator = () => {
    trackEvent('hero_cta_clicked', { cta_text: 'Check My Savings' });
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-36 md:pt-28 md:pb-44 px-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-200">Free · Instant · No credit check</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight text-balance leading-[1.1]">
          Reduce Your Car EMI{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            in 30 Seconds
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
          Check Monthly Savings, Top-Up Eligibility and Approval Chances Instantly.
        </p>

        {/* Interactive EMI Infographic */}
        <EmiInfographic />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button size="xl" onClick={scrollToCalculator} className="w-full sm:w-auto group">
            Check My Savings <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" onClick={scrollToCalculator} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30">
            See Example Result
          </Button>
        </div>

        {/* Live Counter Stats */}
        <LiveStats />

        {/* Scroll indicator */}
        <div className="mt-10 animate-bounce">
          <ArrowDown size={20} className="mx-auto text-slate-500" />
        </div>
      </div>
    </section>
  );
}

function EmiInfographic() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 3), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-col items-center bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-5 md:px-8 md:py-6 animate-fade-in-up">
      <div className="flex items-center gap-3 md:gap-5">
        {/* Current EMI */}
        <div className={`text-center transition-all duration-500 ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/20 border-2 border-red-400/50 flex items-center justify-center mx-auto mb-1.5">
            <span className="text-red-300 text-xs font-bold">OLD</span>
          </div>
          <p className="text-white/70 font-semibold tabular-nums text-sm line-through decoration-red-400">₹28,000</p>
          <p className="text-slate-500 text-[10px] mt-0.5">Current EMI</p>
        </div>

        {/* Arrow */}
        <div className={`transition-all duration-500 delay-200 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          <svg width="40" height="20" viewBox="0 0 40 20" className="text-green-400">
            <path d="M0 10 L30 10 M25 5 L30 10 L25 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* New EMI */}
        <div className={`text-center transition-all duration-500 delay-300 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500/20 border-2 border-green-400/50 flex items-center justify-center mx-auto mb-1.5">
            <span className="text-green-300 text-xs font-bold">NEW</span>
          </div>
          <p className="text-white font-bold tabular-nums text-sm">₹25,650</p>
          <p className="text-slate-500 text-[10px] mt-0.5">New EMI</p>
        </div>

        {/* Arrow */}
        <div className={`transition-all duration-500 delay-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          <svg width="24" height="20" viewBox="0 0 24 20" className="text-green-400">
            <path d="M2 10 L18 10 M14 5 L18 10 L14 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Savings */}
        <div className={`text-center transition-all duration-500 delay-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-green-500/30 animate-pulse-ring">
            <span className="text-white text-[10px] font-bold">SAVE</span>
          </div>
          <p className="text-green-400 font-bold tabular-nums text-sm">₹2,350</p>
          <p className="text-green-400/70 text-[10px] mt-0.5">Every Month</p>
        </div>
      </div>
    </div>
  );
}

function LiveStats() {
  const [count, setCount] = useState({ customers: 0, saved: 0 });

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount({
        customers: Math.round(50000 * eased),
        saved: Math.round(3200 * eased),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 mt-10">
      <StatItem value={`${(count.customers / 1000).toFixed(0)}K+`} label="Customers" />
      <div className="w-px h-8 bg-slate-700" />
      <StatItem value="9+" label="Partner Banks" />
      <div className="w-px h-8 bg-slate-700" />
      <StatItem value={`₹${count.saved.toLocaleString('en-IN')}`} label="Avg Saved/mo" highlight />
    </div>
  );
}

function StatItem({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-lg md:text-xl font-bold tabular-nums ${highlight ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
