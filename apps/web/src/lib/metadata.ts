import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, ...keywords],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.fullName,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SITE_CONFIG.fullName,
        url: SITE_CONFIG.url,
        description: 'Vehicle finance comparison platform helping customers find the best refinance rates from partner banks.',
        logo: `${SITE_CONFIG.url}/images/logo.svg`,
      },
      {
        '@type': 'WebApplication',
        name: `${SITE_CONFIG.name} EMI Savings Calculator`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    ],
  };
}
