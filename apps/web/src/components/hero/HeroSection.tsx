import { Container } from '@/components/layout';
import { BankLogos } from './BankLogos';
import { HeroCTA } from './HeroCTA';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative bg-gradient-to-br from-brand-primary via-[#1E293B] to-brand-primary overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #22C55E 1px, transparent 1px), radial-gradient(circle at 75% 75%, #3B82F6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <Container size="md" className="relative py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-2xl mx-auto">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-display md:text-[3rem] lg:text-[3.5rem] text-white leading-tight mb-4 animate-slide-up"
          >
            Reduce Your Car EMI{' '}
            <span className="text-accent-success">in 30 Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body md:text-h3 text-brand-muted mb-8 animate-slide-up [animation-delay:100ms]">
            Check Savings, Top-Up Eligibility and Approval Chances Instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up [animation-delay:200ms]">
            <HeroCTA />
            <a
              href="#sample-result"
              className="btn btn-ghost text-brand-muted hover:text-white border border-white/20 hover:border-white/40"
            >
              See Sample Result
            </a>
          </div>

          {/* Trust signals */}
          <div className="animate-slide-up [animation-delay:300ms]">
            <p className="text-caption text-brand-muted mb-4 uppercase tracking-wide">
              Trusted by customers across India — Partnered with
            </p>
            <BankLogos />
          </div>
        </div>
      </Container>
    </section>
  );
}
