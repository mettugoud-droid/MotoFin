import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout';

export const metadata: Metadata = generatePageMetadata({
  title: 'FAQ - Car Loan Refinance Questions',
  description: 'Frequently asked questions about car loan refinancing, balance transfer, and EMI savings with MotoFin.',
  path: '/faq',
  keywords: ['car loan FAQ', 'refinance questions', 'EMI calculator help'],
});

const faqs = [
  { q: 'What is car loan refinancing?', a: 'Car loan refinancing means transferring your existing car loan to another bank at a lower interest rate, reducing your monthly EMI and total interest paid.' },
  { q: 'How much can I save by refinancing?', a: 'Savings depend on the difference between your current rate and the new rate. On average, our customers save ₹2,000-5,000 per month on their car loan EMI.' },
  { q: 'Is there any fee for using MotoFin?', a: 'No, MotoFin is completely free for customers. We earn a referral fee from our banking partners when a loan is successfully transferred.' },
  { q: 'What documents do I need?', a: 'Typically, you need your existing loan statement, KYC documents (Aadhaar, PAN), income proof, and vehicle RC copy. Our specialist will guide you through the exact requirements.' },
  { q: 'How long does the refinance process take?', a: 'The entire process typically takes 7-14 working days from application to disbursement, depending on the bank and documentation.' },
  { q: 'Will refinancing affect my credit score?', a: 'A balance transfer involves a hard inquiry which may temporarily lower your score by a few points. However, lower EMI payments improve your long-term credit health.' },
  { q: 'What is top-up eligibility?', a: 'If your vehicle has appreciated or you have a good repayment track record, you may be eligible for additional funding (top-up) along with your refinance at the new lower rate.' },
];

export default function FAQPage() {
  return (
    <section className="section">
      <Container size="sm">
        <h1 className="text-h1 text-brand-primary mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-surface-border pb-6 last:border-0">
              <h2 className="text-h3 text-brand-primary mb-2">{faq.q}</h2>
              <p className="text-body text-brand-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
