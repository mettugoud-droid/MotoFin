import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with MotoFin Technologies. We\'re here to help with your vehicle refinance questions.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <section className="section">
      <Container size="sm">
        <h1 className="text-h1 text-brand-primary mb-6">Contact Us</h1>
        <div className="space-y-6">
          <p className="text-body text-brand-secondary">
            Have questions about vehicle loan refinancing? Our team is here to help.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">📧</span>
              <div>
                <p className="text-body-sm font-medium text-brand-primary">Email</p>
                <p className="text-body text-brand-secondary">support@motofin.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">📞</span>
              <div>
                <p className="text-body-sm font-medium text-brand-primary">Phone</p>
                <p className="text-body text-brand-secondary">+91 80-XXXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">📍</span>
              <div>
                <p className="text-body-sm font-medium text-brand-primary">Office</p>
                <p className="text-body text-brand-secondary">Hyderabad, Telangana, India</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
