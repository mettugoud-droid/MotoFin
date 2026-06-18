import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { Benefits } from '@/components/sections/Benefits';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CalculatorSection />
      <Benefits />
      <HowItWorks />
      <FAQ />
      <FinalCTA />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialService',
            name: 'MotoFin Car Loan Refinance Calculator',
            description:
              'Free online calculator to check car loan refinancing savings. Compare rates from 9+ banks.',
            url: 'https://motofin.in',
            provider: { '@type': 'Organization', name: 'MotoFin Technologies' },
            serviceType: 'Loan Comparison',
            areaServed: { '@type': 'Country', name: 'India' },
          }),
        }}
      />
    </>
  );
}
