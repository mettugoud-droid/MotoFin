import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Building2, ShieldCheck, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About MotoFin - India\'s Car Loan Refinance Platform',
  description:
    'MotoFin helps car owners save money by comparing refinance rates from 9+ partner banks. 50,000+ customers served.',
  alternates: { canonical: 'https://motofin.in/about' },
};

const stats = [
  { value: '50,000+', label: 'Happy Customers' },
  { value: '9+', label: 'Partner Banks' },
  { value: '₹3,200', label: 'Avg Monthly Savings' },
  { value: '30s', label: 'To Check Savings' },
];

const values = [
  {
    icon: Users,
    title: 'Customer First',
    description: 'Every decision we make starts with the question: does this help our customers save more?',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    description: 'We show real rates, include disclaimers, and never share data without consent.',
  },
  {
    icon: TrendingDown,
    title: 'Maximum Savings',
    description: 'We negotiate with banks to get you the best possible rates on your car loan.',
  },
  {
    icon: Building2,
    title: 'Bank Partnerships',
    description: 'We partner with India\'s top banks to offer you verified, competitive rates.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About MotoFin</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We&apos;re building India&apos;s most trusted platform for car loan refinancing.
            Our mission is to help every car owner get the lowest possible EMI.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-slate-800 tabular-nums">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              MotoFin was born from a simple observation: millions of Indian car owners are
              paying more interest than they need to. With interest rates varying significantly
              across banks, and most borrowers never reconsidering their loan terms after the
              initial purchase, there&apos;s an enormous savings opportunity being left on the table.
            </p>
            <p>
              We built MotoFin to make car loan refinancing accessible, transparent, and instant.
              In just 30 seconds, you can see exactly how much you could save by switching to a
              lower-rate bank — no documents required for the initial check.
            </p>
            <p>
              Today, we partner with 9+ of India&apos;s leading banks including HDFC, ICICI, Axis,
              Kotak, IndusInd, and AU Small Finance Bank. Our platform has helped over 50,000
              customers save an average of ₹3,200 per month on their car loans.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Ready to Save on Your Car Loan?
          </h2>
          <p className="text-slate-500 mb-6">
            Check your savings in 30 seconds — it&apos;s free and no documents are needed.
          </p>
          <Link href="/#calculator">
            <Button size="lg">
              Try Our Free Calculator <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
