import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
  description:
    'Check how much you could save on your existing car loan in under 30 seconds. Compare refinance rates from 9+ banks. Free, instant results.',
  keywords: [
    'car loan refinance',
    'vehicle loan balance transfer',
    'reduce car EMI',
    'car loan top-up',
    'EMI savings calculator',
    'car loan interest rate',
  ],
  authors: [{ name: 'MotoFin Technologies' }],
  creator: 'MotoFin Technologies',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://motofin.in' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://motofin.in',
    siteName: 'MotoFin',
    title: 'Reduce Your Car EMI in 30 Seconds | MotoFin',
    description:
      'Free car loan savings calculator. Compare rates from HDFC, ICICI, Axis & 6 more banks instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reduce Your Car EMI in 30 Seconds | MotoFin',
    description: 'Free car loan savings calculator. Compare rates from 9+ banks instantly.',
  },
  category: 'finance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
