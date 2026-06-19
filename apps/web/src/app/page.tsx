import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero';
import { CalculatorSection } from '@/components/calculator';
import { HomepageClient } from '@/components/HomepageClient';
import { generateStructuredData } from '@/lib/metadata';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  openGraph: {
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
};

export default function HomePage() {
  const structuredData = generateStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <CalculatorSection />
      <HomepageClient />
    </>
  );
}
