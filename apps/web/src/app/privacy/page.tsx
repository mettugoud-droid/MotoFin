import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'MotoFin Technologies privacy policy. Learn how we collect, use, and protect your personal information.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <section className="section">
      <Container size="sm">
        <h1 className="text-h1 text-brand-primary mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-body text-brand-secondary">
          <p>Last updated: June 2026</p>
          <h2 className="text-h2 text-brand-primary">Information We Collect</h2>
          <p>We collect information you provide directly, including your name, mobile number, city, and loan details when you use our calculator and request a callback.</p>
          <h2 className="text-h2 text-brand-primary">How We Use Your Information</h2>
          <p>We use your information to provide personalized refinance recommendations, connect you with banking partners, and improve our services.</p>
          <h2 className="text-h2 text-brand-primary">Data Security</h2>
          <p>We use industry-standard 256-bit encryption to protect your data. Your information is stored securely and never shared without your consent.</p>
          <h2 className="text-h2 text-brand-primary">Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at support@motofin.in for any privacy-related requests.</p>
        </div>
      </Container>
    </section>
  );
}
