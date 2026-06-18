import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MotoFin - Reduce Your Car EMI | Free Savings Calculator',
  description: 'Check how much you could save on your existing car loan in under 30 seconds. Compare rates from 9 top banks. Free, instant results.',
  keywords: 'car loan refinance, vehicle loan balance transfer, EMI savings calculator, car loan interest rate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 to-white antialiased">
        {children}
      </body>
    </html>
  );
}
