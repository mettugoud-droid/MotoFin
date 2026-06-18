# MotoFin SEO Architecture

## Technical SEO & Content Strategy for Organic Growth

**Version:** 2.0  
**Framework:** Next.js 15 (App Router with SSR/SSG)  
**Primary Market:** India (en-IN)  
**Domain:** motofin.in (assumed)  

---

## 1. SEO Strategy Overview

### Goals

| Metric | Target | Timeline |
|--------|--------|----------|
| Organic traffic | 10,000+ monthly sessions | 6 months |
| Keyword rankings (Top 10) | 15+ keywords | 6 months |
| Page Authority | 30+ | 12 months |
| Core Web Vitals | All "Good" | Immediate |
| Indexed pages | 15+ | 3 months |

### Target Audience Search Intent

| Intent | Keywords | Page |
|--------|----------|------|
| Informational | "what is car loan refinancing", "how to reduce car EMI" | Blog/FAQ |
| Navigational | "MotoFin calculator", "MotoFin savings" | Homepage |
| Transactional | "car loan balance transfer apply", "reduce car EMI now" | Calculator |
| Commercial | "best car loan refinance rates", "car loan top-up eligibility" | Calculator/Results |

---

## 2. Keyword Strategy

### Primary Keywords (High Priority)

| Keyword | Monthly Volume (est.) | Difficulty | Target Page |
|---------|----------------------|------------|-------------|
| car loan refinance | 8,100 | Medium | Homepage |
| reduce car EMI | 5,400 | Medium | Homepage |
| vehicle loan balance transfer | 4,400 | Medium | Homepage |
| car loan top-up | 3,600 | Low-Medium | Homepage |
| car loan interest rate | 12,100 | High | Blog |
| used car loan | 18,100 | High | Future page |
| auto loan transfer | 2,900 | Low | Homepage |
| vehicle loan foreclosure | 2,400 | Low | FAQ |

### Long-Tail Keywords

| Keyword | Target Page |
|---------|-------------|
| how to reduce car loan EMI without foreclosure | Blog/FAQ |
| car loan balance transfer from HDFC to ICICI | Blog |
| car loan refinance eligibility calculator | Homepage |
| top-up loan on existing car loan | Homepage |
| car loan interest rate comparison 2024 | Homepage |
| best bank for car loan transfer in India | Blog |
| car loan EMI savings calculator online free | Homepage |
| should I refinance my car loan | Blog/FAQ |

### Keyword Mapping by Page

```
Homepage (/)
├── car loan refinance
├── reduce car EMI
├── EMI savings calculator
├── car loan interest rate comparison
└── vehicle loan balance transfer

About (/about)
├── MotoFin Technologies
├── car loan comparison platform
└── vehicle finance aggregator

FAQ (/faq)
├── what is car loan refinancing
├── car loan balance transfer process
├── vehicle loan foreclosure
└── car loan top-up eligibility

Privacy (/privacy)
└── (no keyword targeting)

Terms (/terms)
└── (no keyword targeting)

Contact (/contact)
├── MotoFin contact
└── car loan help India
```

---


## 3. Technical SEO Implementation

### Next.js App Router Metadata API

```typescript
// app/layout.tsx — Global metadata
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://motofin.in'),
  title: {
    default: 'MotoFin - Reduce Your Car EMI | Free Savings Calculator',
    template: '%s | MotoFin',
  },
  description: 'Check how much you could save on your existing car loan in under 30 seconds. Compare refinance rates from 9+ banks. Free, instant results. No documents needed.',
  keywords: [
    'car loan refinance',
    'vehicle loan balance transfer',
    'reduce car EMI',
    'car loan top-up',
    'EMI savings calculator',
    'car loan interest rate',
    'auto loan transfer',
    'vehicle loan foreclosure',
  ],
  authors: [{ name: 'MotoFin Technologies' }],
  creator: 'MotoFin Technologies',
  publisher: 'MotoFin Technologies',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://motofin.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://motofin.in',
    siteName: 'MotoFin',
    title: 'Reduce Your Car EMI in 30 Seconds | MotoFin',
    description: 'Free car loan savings calculator. Compare rates from HDFC, ICICI, Axis & 6 more banks. Check top-up eligibility & approval chances instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MotoFin - Car Loan EMI Savings Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reduce Your Car EMI in 30 Seconds | MotoFin',
    description: 'Free car loan savings calculator. Compare rates from 9+ banks instantly.',
    images: ['/og-image.png'],
    creator: '@motofin_in',
  },
  verification: {
    google: 'GOOGLE_SITE_VERIFICATION_TOKEN',
  },
  category: 'finance',
};
```

### Per-Page Metadata

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'Car Loan EMI Savings Calculator - Free Instant Check | MotoFin',
  description: 'Calculate how much you can save by refinancing your car loan. Compare rates from HDFC, ICICI, Axis, Kotak & more. Check top-up eligibility. Free, no documents needed.',
  alternates: {
    canonical: 'https://motofin.in',
  },
};

// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About MotoFin - India\'s Car Loan Refinance Platform',
  description: 'MotoFin helps car owners save money by comparing refinance rates from 9+ partner banks. 50,000+ customers served. Free savings check.',
  alternates: {
    canonical: 'https://motofin.in/about',
  },
};

// app/faq/page.tsx
export const metadata: Metadata = {
  title: 'FAQ - Car Loan Refinancing Questions Answered | MotoFin',
  description: 'Frequently asked questions about car loan refinancing, balance transfer, top-up loans, EMI reduction, and the MotoFin process.',
  alternates: {
    canonical: 'https://motofin.in/faq',
  },
};

// app/privacy/page.tsx
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'MotoFin privacy policy. How we collect, use, and protect your personal information.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://motofin.in/privacy',
  },
};

// app/terms/page.tsx
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'MotoFin terms and conditions for using our car loan comparison platform.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://motofin.in/terms',
  },
};

// app/contact/page.tsx
export const metadata: Metadata = {
  title: 'Contact Us - MotoFin Support',
  description: 'Get in touch with MotoFin. Customer support for car loan refinancing queries. Available Mon-Sat, 9AM-7PM IST.',
  alternates: {
    canonical: 'https://motofin.in/contact',
  },
};
```

---


## 4. Structured Data (Schema.org)

### Organization Schema

```typescript
// components/seo/OrganizationSchema.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MotoFin Technologies',
    url: 'https://motofin.in',
    logo: 'https://motofin.in/logo.png',
    description: 'India\'s car loan refinance comparison platform. Compare rates from 9+ banks.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8000000000',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
    sameAs: [
      'https://twitter.com/motofin_in',
      'https://www.linkedin.com/company/motofin',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### FinancialService Schema

```typescript
// components/seo/FinancialServiceSchema.tsx
export function FinancialServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'MotoFin Car Loan Refinance Calculator',
    description: 'Free online calculator to check car loan refinancing savings. Compare rates from HDFC, ICICI, Axis, Kotak, IndusInd, and AU banks.',
    url: 'https://motofin.in',
    provider: {
      '@type': 'Organization',
      name: 'MotoFin Technologies',
    },
    serviceType: 'Loan Comparison',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free car loan savings calculation and comparison',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### FAQPage Schema

```typescript
// components/seo/FAQSchema.tsx
export function FAQSchema() {
  const faqs = [
    {
      question: 'What is car loan refinancing?',
      answer: 'Car loan refinancing is the process of transferring your existing car loan to another bank that offers a lower interest rate. This reduces your EMI and total interest paid over the loan tenure.',
    },
    {
      question: 'How much can I save by refinancing my car loan?',
      answer: 'Savings depend on the difference between your current rate and the new rate offered. On average, MotoFin customers save ₹2,000 to ₹5,000 per month by refinancing their car loans.',
    },
    {
      question: 'Which banks does MotoFin compare rates from?',
      answer: 'MotoFin compares rates from 9+ partner banks including HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, and AU Small Finance Bank.',
    },
    {
      question: 'Do I need to submit documents to check my savings?',
      answer: 'No. The initial savings check requires only your current EMI, outstanding amount, and interest rate. Documents are only needed if you decide to proceed with the refinance after seeing your results.',
    },
    {
      question: 'What is a top-up loan on a car loan?',
      answer: 'A top-up loan allows you to borrow additional money on top of your existing car loan when you refinance. This is available if your car has appreciated in value or you have sufficient equity.',
    },
    {
      question: 'How long does the car loan refinancing process take?',
      answer: 'The initial savings check takes 30 seconds. If you decide to proceed, the full refinancing process typically takes 5-7 working days, subject to bank processing and document verification.',
    },
    {
      question: 'Will car loan refinancing affect my credit score?',
      answer: 'The initial savings check on MotoFin does not affect your credit score. A formal application to a bank may result in a hard inquiry, which can have a minor temporary impact on your score.',
    },
    {
      question: 'Is my data safe on MotoFin?',
      answer: 'Yes. MotoFin uses 256-bit bank-grade encryption to protect your data. We never share your personal information without your consent. Your data is used only to calculate savings and connect you with partner banks.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### BreadcrumbList Schema

```typescript
// components/seo/BreadcrumbSchema.tsx
interface BreadcrumbProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Usage:
// <BreadcrumbSchema items={[
//   { name: 'Home', url: 'https://motofin.in' },
//   { name: 'FAQ', url: 'https://motofin.in/faq' },
// ]} />
```

### WebApplication Schema

```typescript
// components/seo/WebAppSchema.tsx
export function WebAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MotoFin EMI Savings Calculator',
    url: 'https://motofin.in',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: [
      'Car loan EMI savings calculation',
      'Multi-bank rate comparison',
      'Pre-approval probability estimation',
      'Top-up loan eligibility check',
      'Free callback from loan specialists',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---


## 5. Sitemap & Robots

### Sitemap (app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://motofin.in';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
```

### Robots (app/robots.ts)

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: 'https://motofin.in/sitemap.xml',
  };
}
```

---

## 6. URL Architecture

### Route Structure

```
motofin.in/                    → Homepage + Calculator (primary landing)
motofin.in/about               → About Us
motofin.in/faq                 → FAQ (SEO content)
motofin.in/contact             → Contact Us
motofin.in/privacy             → Privacy Policy
motofin.in/terms               → Terms of Service
motofin.in/results             → Shareable results page (future)
motofin.in/blog/               → Blog index (future)
motofin.in/blog/[slug]         → Blog posts (future)
```

### URL Best Practices

- All lowercase, hyphen-separated
- No trailing slashes (Next.js default)
- Canonical URLs on every page
- No query parameters for core pages
- Results page uses dynamic segment: `/results/[id]` (future, for shareable results)

---

## 7. Core Web Vitals Optimization

### LCP (Largest Contentful Paint) — Target: < 2.0s

| Strategy | Implementation |
|----------|----------------|
| Font preloading | `<link rel="preload" href="/fonts/inter-var.woff2" as="font">` |
| Critical CSS | Inline above-fold styles in `<head>` |
| Hero image optimization | SVG pattern (no image download needed) |
| Server-side rendering | Next.js SSR for initial HTML |
| Edge caching | Vercel Edge / CDN for static assets |
| No render-blocking JS | Defer non-critical scripts |

### CLS (Cumulative Layout Shift) — Target: < 0.05

| Strategy | Implementation |
|----------|----------------|
| Font fallback sizing | `size-adjust` in @font-face declaration |
| Explicit dimensions | Width/height on all images and embeds |
| Skeleton loaders | Reserve space during data fetching |
| No dynamic content injection | Above-fold content is static |
| Stable header | Fixed height (56px mobile, 64px desktop) |

### INP (Interaction to Next Paint) — Target: < 200ms

| Strategy | Implementation |
|----------|----------------|
| Minimal JS on initial load | Code split calculator logic |
| Event delegation | Efficient event listeners |
| requestAnimationFrame | For animations and visual updates |
| Web Workers | Heavy calculations off main thread (future) |
| Optimistic UI | Show loading states immediately on interaction |

### Performance Budget

| Resource | Budget |
|----------|--------|
| Total page weight (initial) | < 300KB |
| JavaScript (initial) | < 150KB gzipped |
| CSS (initial) | < 30KB gzipped |
| Fonts | < 50KB (Inter variable, subset) |
| Images (above fold) | < 50KB |
| Time to Interactive | < 3.0s (3G) |
| First Contentful Paint | < 1.5s |

---

## 8. Server-Side Rendering Strategy

### Page Rendering Modes

| Page | Rendering | Reason |
|------|-----------|--------|
| `/` (Homepage) | Static Generation (SSG) | Content rarely changes, maximum performance |
| `/about` | Static Generation | Static content |
| `/faq` | Static Generation | Semi-static, rebuild on content update |
| `/contact` | Static Generation | Static form |
| `/privacy` | Static Generation | Legal, rarely updated |
| `/terms` | Static Generation | Legal, rarely updated |
| `/results/[id]` | Server-Side Rendering (SSR) | Dynamic per-user results (future) |

### ISR (Incremental Static Regeneration)

```typescript
// For pages that need periodic updates
export const revalidate = 86400; // Revalidate every 24 hours

// For FAQ page (content may update)
export const revalidate = 3600; // Revalidate every hour
```

### Dynamic Metadata for Results Page (Future)

```typescript
// app/results/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Fetch result data
  const result = await getResult(params.id);
  
  return {
    title: `Save ₹${result.monthlySaving.toLocaleString('en-IN')}/month on Your Car Loan | MotoFin`,
    description: `Your car loan refinancing analysis: Save ₹${result.monthlySaving.toLocaleString('en-IN')} monthly by switching to ${result.recommendedBank}. Check your savings now.`,
    openGraph: {
      title: `I could save ₹${result.monthlySaving.toLocaleString('en-IN')}/month on my car loan!`,
      description: 'Check how much you could save on your car loan EMI. Free instant calculation.',
      images: [`/api/og-results/${params.id}`],
    },
  };
}
```

---


## 9. Open Graph & Social Sharing

### OG Image Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1200 x 630px                                               │
│                                                             │
│  Background: Gradient slate-900 → slate-800                 │
│                                                             │
│     [M] MotoFin                                            │
│                                                             │
│     Reduce Your Car EMI                                     │
│     in 30 Seconds                                           │
│                                                             │
│     Compare rates from 9+ banks                             │
│     Free · Instant · No documents                           │
│                                                             │
│     [HDFC] [ICICI] [Axis] [Kotak] [IndusInd] [AU]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dynamic OG Image (for shared results)

```typescript
// app/api/og-results/[id]/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await getResult(params.id);
  
  return new ImageResponse(
    (
      <div style={{ /* Dark gradient bg, white text */ }}>
        <div>MotoFin</div>
        <div>I could save ₹{result.monthlySaving.toLocaleString('en-IN')}/month</div>
        <div>on my car loan!</div>
        <div>Check your savings → motofin.in</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@motofin_in" />
<meta name="twitter:title" content="Reduce Your Car EMI in 30 Seconds | MotoFin" />
<meta name="twitter:description" content="Free car loan savings calculator. Compare rates from 9+ banks instantly." />
<meta name="twitter:image" content="https://motofin.in/og-image.png" />
```

---

## 10. Content SEO Strategy

### On-Page SEO Checklist (Every Page)

- [ ] Unique title tag (50-60 chars)
- [ ] Unique meta description (150-160 chars)
- [ ] H1 tag (one per page, includes primary keyword)
- [ ] H2-H3 hierarchy (logical, keyword-rich)
- [ ] Internal links (3-5 per page)
- [ ] Alt text on all images
- [ ] Canonical URL set
- [ ] Schema.org structured data
- [ ] Mobile-friendly (responsive)
- [ ] Core Web Vitals passing

### Homepage Content Structure (SEO)

```html
<h1>Car Loan EMI Savings Calculator</h1> <!-- Hidden visually, present for SEO -->
<!-- Visible headline: "Reduce Your Car EMI in 30 Seconds" -->

<h2>EMI Savings Calculator</h2>
<!-- Calculator form -->

<h2>Why Refinance Your Car Loan?</h2>
<h3>Save ₹2,000 – ₹5,000 Per Month</h3>
<h3>Get Top-Up on Existing Loan</h3>
<h3>Quick 30-Second Check</h3>
<h3>100% Safe & Confidential</h3>

<h2>How Car Loan Refinancing Works</h2>
<h3>Step 1: Enter Your Loan Details</h3>
<h3>Step 2: See Instant Savings</h3>
<h3>Step 3: Get Expert Callback</h3>

<h2>Frequently Asked Questions About Car Loan Refinancing</h2>
<h3>What is car loan refinancing?</h3>
<h3>How much can I save?</h3>
<!-- ... more FAQ items -->

<h2>Compare Rates From Top Banks</h2>
<!-- Bank logos + trust signals -->
```

### Semantic HTML for SEO

```html
<!-- Use semantic elements for better crawlability -->
<main>
  <article>
    <header><!-- Hero --></header>
    <section aria-label="Calculator"><!-- Calculator --></section>
    <section aria-label="Benefits"><!-- Benefits --></section>
    <section aria-label="Process"><!-- How it works --></section>
    <section aria-label="FAQ"><!-- FAQ --></section>
  </article>
</main>
<footer><!-- Footer --></footer>
```

---

## 11. Internal Linking Strategy

### Link Architecture

```
Homepage (/)
├── → /about (footer, "About" link)
├── → /faq (FAQ section "View all FAQs" link)
├── → /contact (footer, header support)
├── → /privacy (footer, lead form)
├── → /terms (footer, lead form)
└── → /blog/ (footer, future)

FAQ (/faq)
├── → / (CTA "Try Calculator")
├── → /about (contextual links)
└── → /contact (can't find answer? link)

About (/about)
├── → / (CTA)
├── → /faq (learn more)
└── → /contact (get in touch)
```

### Anchor Text Strategy

| Link | Anchor Text | Context |
|------|-------------|---------|
| / → /faq | "Learn more about refinancing" | Below benefits section |
| /faq → / | "Check your savings now" | After each FAQ answer |
| /about → / | "Try our free calculator" | CTA section |
| Footer → /privacy | "Privacy Policy" | Legal links |
| Lead form → /privacy | "Privacy Policy" | Inline consent text |

---

## 12. Technical Optimizations

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 412, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
};
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});
```

### Script Loading

```typescript
// Analytics & tracking — load after page is interactive
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>

// Non-critical third-party
<Script src="/scripts/exit-intent.js" strategy="lazyOnload" />
```

### Prefetching Strategy

```typescript
// Prefetch likely next pages
import Link from 'next/link';

// Next.js auto-prefetches <Link> components in viewport
<Link href="/faq" prefetch={true}>FAQ</Link>
<Link href="/about" prefetch={false}>About</Link> // Low-priority

// For programmatic navigation (after calculator)
import { useRouter } from 'next/navigation';
router.prefetch('/results');
```

---

## 13. Analytics & Tracking Setup

### Google Tag Manager Data Layer

```typescript
// lib/analytics.ts
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
}

// Conversion events
export const analytics = {
  heroCtaClick: () => trackEvent('hero_cta_click'),
  calculatorStart: () => trackEvent('calculator_start'),
  calculatorComplete: (savings: number) => trackEvent('calculator_complete', { monthly_savings: savings }),
  preApprovalView: (probability: number) => trackEvent('pre_approval_view', { approval_probability: probability }),
  leadFormStart: () => trackEvent('lead_form_start'),
  leadSubmit: (city: string) => trackEvent('lead_submit', { city }),
  exitIntentShown: () => trackEvent('exit_intent_shown'),
  exitIntentDismissed: () => trackEvent('exit_intent_dismissed'),
  faqExpand: (question: string) => trackEvent('faq_expand', { question }),
  scrollDepth: (percent: number) => trackEvent('scroll_depth', { percent }),
};
```

### Conversion Tracking

```typescript
// Google Ads conversion
export function trackConversion(conversionId: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value || 0,
      currency: 'INR',
    });
  }
}

// Facebook Pixel events
export function trackFBEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
}
```

---

## 14. Monitoring & Maintenance

### SEO Health Checks

| Check | Frequency | Tool |
|-------|-----------|------|
| Core Web Vitals | Weekly | Google Search Console, PageSpeed Insights |
| Crawl errors | Weekly | Google Search Console |
| Index coverage | Weekly | Google Search Console |
| Keyword rankings | Bi-weekly | Google Search Console |
| Broken links | Monthly | Screaming Frog / custom script |
| Schema validation | After changes | Google Rich Results Test |
| Mobile usability | Monthly | Google Search Console |
| Page speed regression | Per deployment | Lighthouse CI |

### Lighthouse CI Budget

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

---

## 15. Implementation Checklist

### Phase 1: Foundation
- [ ] Configure metadata in app/layout.tsx (global)
- [ ] Set per-page metadata for all routes
- [ ] Create sitemap.ts
- [ ] Create robots.ts
- [ ] Add canonical URLs to all pages
- [ ] Configure viewport meta
- [ ] Set up Google Search Console
- [ ] Submit sitemap

### Phase 2: Structured Data
- [ ] Add Organization schema (global)
- [ ] Add FinancialService schema (homepage)
- [ ] Add FAQPage schema (FAQ page)
- [ ] Add BreadcrumbList schema (all pages)
- [ ] Add WebApplication schema (homepage)
- [ ] Validate all schemas with Google Rich Results Test

### Phase 3: Performance
- [ ] Configure next/font for Inter
- [ ] Set up image optimization config
- [ ] Implement critical CSS strategy
- [ ] Add script loading strategy (afterInteractive, lazyOnload)
- [ ] Configure prefetching
- [ ] Set up Lighthouse CI in deployment pipeline
- [ ] Achieve Core Web Vitals "Good" rating

### Phase 4: Content & Social
- [ ] Create static OG image (1200x630)
- [ ] Set up dynamic OG image generation (results)
- [ ] Configure Twitter Cards
- [ ] Write SEO-optimized FAQ content (8 questions)
- [ ] Implement semantic HTML structure
- [ ] Add internal linking between pages
- [ ] Write alt text for all images

### Phase 5: Analytics
- [ ] Set up Google Tag Manager
- [ ] Implement data layer events
- [ ] Configure Google Analytics 4
- [ ] Set up conversion tracking (Google Ads)
- [ ] Implement scroll depth tracking
- [ ] Set up exit intent tracking
- [ ] Create conversion funnel in GA4
