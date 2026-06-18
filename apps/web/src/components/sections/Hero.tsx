'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown, TrendingDown, Shield, Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  const scrollToCalculator = () => {
    trackEvent('hero_cta_clicked', { cta_text: 'Check My Savings' });
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-36 md:pt-28 md:pb-44 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-200">Free · Instant · No credit check · No documents</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight text-balance leading-[1.1]">
          Reduce Your Car EMI{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">in 30 Seconds</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          India&apos;s #1 car loan refinancing platform. Compare rates from HDFC, ICICI, Axis & 6 more banks. Check your monthly savings, top-up eligibility, and approval chances — all free, all instant.
        </p>

        {/* Key Benefits Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
          <BenefitPill icon={TrendingDown} text="Save ₹2,000-₹5,000/mo" />
          <BenefitPill icon={Shield} text="No credit score impact" />
          <BenefitPill icon={Clock} text="Results in 30 seconds" />
          <BenefitPill icon={IndianRupee} text="100% free" />
        </div>

        {/* Animated EMI Comparison */}
        <EmiComparison />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button size="xl" onClick={scrollToCalculator} className="w-full sm:w-auto group">
            Check My Savings <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" onClick={scrollToCalculator} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30">
            See Example Result
          </Button>
        </div>

        {/* Live Stats */}
        <LiveStats />

        {/* Scroll indicator */}
        <div className="mt-8 animate-bounce">
          <ArrowDown size={18} className="mx-auto text-slate-500" />
        </div>
      </div>
    </section>
  );
}

function BenefitPill({ icon: Icon, text }: { icon: React.ComponentType<{ size?: number; className?: string }>; text: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
      <Icon size={13} className="text-green-400" />
      <span className="text-xs font-medium text-slate-300">{text}</span>
    </div>
  );
}

function EmiComparison() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 3), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-col items-center bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-5 md:px-8 md:py-6 animate-fade-in-up">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-3 font-medium">Live Example · ₹8L Loan · 36 Months</p>
      <div className="flex items-center gap-3 md:gap-5">
        <div className={`text-center transition-all duration-500 ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/20 border-2 border-red-400/40 flex items-center justify-center mx-auto mb-1.5">
            <span className="text-red-300 text-[10px] font-bold">12.5%</span>
          </div>
          <p className="text-white/70 font-semibold tabular-nums text-sm line-through decoration-red-400">₹28,000</p>
          <p className="text-slate-500 text-[10px] mt-0.5">Current EMI</p>
        </div>

        <svg width="36" height="20" viewBox="0 0 36 20" className={`text-green-400 transition-all duration-500 delay-200 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <path d="M0 10 L26 10 M22 5 L28 10 L22 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className={`text-center transition-all duration-500 delay-300 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-1.5">
            <span className="text-green-300 text-[10px] font-bold">8.75%</span>
          </div>
          <p className="text-white font-bold tabular-nums text-sm">₹25,650</p>
          <p className="text-slate-500 text-[10px] mt-0.5">New EMI</p>
        </div>

        <svg width="24" height="20" viewBox="0 0 24 20" className={`text-green-400 transition-all duration-500 delay-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <path d="M0 10 L16 10 M12 5 L18 10 L12 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>

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
      setCount({ customers: Math.round(50000 * eased), saved: Math.round(3200 * eased) });
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 mt-10">
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold tabular-nums text-white">{(count.customers / 1000).toFixed(0)}K+</p>
        <p className="text-[11px] text-slate-500">Customers</p>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold tabular-nums text-white">9+</p>
        <p className="text-[11px] text-slate-500">Partner Banks</p>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold tabular-nums text-green-400">₹{count.saved.toLocaleString('en-IN')}</p>
        <p className="text-[11px] text-slate-500">Avg Saved/mo</p>
      </div>
    </div>
  );
}
