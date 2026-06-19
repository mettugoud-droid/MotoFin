import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { SuccessConfirmation } from '@/components/success/SuccessConfirmation';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'Request Submitted',
  description: 'Your callback request has been received. Our specialist will contact you within 30 minutes.',
  path: '/success',
  noIndex: true,
});

export default function SuccessPage() {
  return (
    <section className="section">
      <Container size="sm">
        <SuccessConfirmation />
      </Container>
    </section>
  );
}
