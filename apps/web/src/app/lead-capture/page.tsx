import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { LeadCaptureForm } from '@/components/lead/LeadCaptureForm';
import { TrustBadges } from '@/components/lead/TrustBadges';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'Get Free Callback',
  description: 'Submit your details and our loan specialist will contact you with personalized refinance options within 30 minutes.',
  path: '/lead-capture',
  noIndex: true,
});

export default function LeadCapturePage() {
  return (
    <section className="section">
      <Container size="sm">
        <div className="text-center mb-8">
          <h1 className="text-h1 text-brand-primary mb-2">Get Your Personalized Report</h1>
          <p className="text-body text-brand-secondary">A MotoFin specialist will call you with the best refinance options.</p>
        </div>
        <LeadCaptureForm />
        <TrustBadges />
      </Container>
    </section>
  );
}
