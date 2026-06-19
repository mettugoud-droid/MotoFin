import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SkipToMain, Header, Footer } from '@/components/layout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://motofin.in'),
  title: {
    default: 'MotoFin - Reduce Your Car EMI | Free Savings Calculator',
    template: '%s | MotoFin',
  },
  description: 'Check how much you could save on your car loan in 30 seconds. Compare rates from 9+ banks. Free, instant results.',
  keywords: [
    'car loan refinance',
    'vehicle loan balance transfer',
    'EMI savings calculator',
    'car loan interest rate',
    'reduce car EMI',
    'car loan top-up',
  ],
  openGraph: {
    type: 'website',
    siteName: 'MotoFin Technologies',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');`,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-offWhite text-brand-primary font-sans antialiased flex flex-col">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        <SkipToMain />
        <Header />
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
