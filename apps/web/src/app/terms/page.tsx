import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'MotoFin Technologies terms of service. Read our terms and conditions for using the platform.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <section className="section">
      <Container size="sm">
        <h1 className="text-h1 text-brand-primary mb-6">Terms of Service</h1>
        <div className="space-y-6 text-body text-brand-secondary">
          <p>Last updated: June 2026</p>
          <h2 className="text-h2 text-brand-primary">Service Description</h2>
          <p>MotoFin provides a vehicle finance comparison platform that connects borrowers with banking partners for loan refinancing opportunities.</p>
          <h2 className="text-h2 text-brand-primary">Disclaimer</h2>
          <p>All savings estimates, pre-approval indications, and interest rates displayed on our platform are indicative only. Final rates and approvals are subject to bank verification and documentation.</p>
          <h2 className="text-h2 text-brand-primary">User Responsibilities</h2>
          <p>You agree to provide accurate information when using our services. Providing false information may result in service termination.</p>
          <h2 className="text-h2 text-brand-primary">Limitation of Liability</h2>
          <p>MotoFin acts as an intermediary connecting borrowers with banks. We are not responsible for final loan decisions made by our banking partners.</p>
        </div>
      </Container>
    </section>
  );
}
