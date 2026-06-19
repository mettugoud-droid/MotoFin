import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us',
  description: 'MotoFin Technologies is India\'s smart vehicle finance comparison platform. We help car owners find the best refinance rates from 9+ banks.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <section className="section">
      <Container size="sm">
        <h1 className="text-h1 text-brand-primary mb-6">About MotoFin</h1>
        <div className="prose prose-slate max-w-none space-y-4">
          <p className="text-body text-brand-secondary">
            MotoFin Technologies is India&apos;s smart vehicle finance comparison platform. We help car and vehicle owners discover better loan rates and reduce their monthly EMI.
          </p>
          <p className="text-body text-brand-secondary">
            Our platform compares offers from 9+ leading banks and NBFCs including HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, and AU Small Finance Bank to find you the best refinance deal.
          </p>
          <h2 className="text-h2 text-brand-primary mt-8 mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-body text-brand-secondary">
            <li>Enter your current loan details in our free calculator</li>
            <li>Instantly see your potential monthly savings</li>
            <li>Get a pre-approval indication with confidence level</li>
            <li>Request a free callback from our loan specialist</li>
          </ol>
          <h2 className="text-h2 text-brand-primary mt-8 mb-4">Our Mission</h2>
          <p className="text-body text-brand-secondary">
            We believe every vehicle owner deserves access to the best financing options. Our technology-driven approach eliminates the guesswork from loan refinancing, saving our customers thousands in interest payments.
          </p>
        </div>
      </Container>
    </section>
  );
}
