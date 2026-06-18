import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FAQAccordion } from './FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ - Car Loan Refinancing Questions Answered',
  description:
    'Frequently asked questions about car loan refinancing, balance transfer, top-up loans, EMI reduction, and the MotoFin process.',
  alternates: { canonical: 'https://motofin.in/faq' },
};

const faqs = [
  {
    question: 'What is car loan refinancing?',
    answer:
      'Car loan refinancing is the process of transferring your existing car loan to another bank that offers a lower interest rate. This reduces your EMI and the total interest you pay over the remaining loan tenure. The new bank pays off your existing loan, and you continue paying a lower EMI to the new bank.',
  },
  {
    question: 'How much can I save by refinancing my car loan?',
    answer:
      'Savings depend on the difference between your current interest rate and the new rate offered. On average, MotoFin customers save between ₹2,000 to ₹5,000 per month. For a loan of ₹8,00,000 with a 4% rate reduction, you could save over ₹1,16,000 in total interest.',
  },
  {
    question: 'Which banks does MotoFin compare rates from?',
    answer:
      'MotoFin compares rates from 9+ partner banks including HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, and AU Small Finance Bank. We continuously add new partners to give you the most competitive rates available.',
  },
  {
    question: 'Do I need to submit documents to check my savings?',
    answer:
      'No. The initial savings check on MotoFin requires only basic details: your current EMI, outstanding loan amount, and interest rate. No documents are needed to see your potential savings. Documents are only required if you decide to proceed with the actual refinance application.',
  },
  {
    question: 'What is a top-up loan on a car loan?',
    answer:
      'A top-up loan allows you to borrow additional money on top of your existing car loan balance when you refinance. This is available if your car\'s current value exceeds your outstanding loan — meaning you have equity in the vehicle. Top-up amounts typically range from ₹50,000 to ₹5,00,000.',
  },
  {
    question: 'How long does the car loan refinancing process take?',
    answer:
      'The initial savings check takes just 30 seconds. If you decide to proceed, the full refinancing process typically takes 5-7 working days. This includes application review, document verification, and loan disbursement by the new bank.',
  },
  {
    question: 'Will car loan refinancing affect my credit score?',
    answer:
      'The initial savings check on MotoFin does NOT affect your credit score — it\'s a soft inquiry only. If you proceed with a formal application to a bank, there will be a hard inquiry which may have a minor (2-5 point) temporary impact. This typically recovers within 2-3 months.',
  },
  {
    question: 'Is my data safe on MotoFin?',
    answer:
      'Absolutely. MotoFin uses 256-bit bank-grade encryption (the same standard used by banks) to protect all your data. We are GDPR-compliant and never share your personal information with third parties without your explicit consent. Your data is used only to calculate savings and connect you with partner banks if you choose to proceed.',
  },
  {
    question: 'Can I refinance if I have missed EMI payments?',
    answer:
      'It depends on the number and recency of missed payments. Generally, banks prefer borrowers with no missed payments in the last 6-12 months. However, some partner banks may still offer refinancing if your overall credit profile is strong. Use our calculator to check your pre-approval probability.',
  },
  {
    question: 'Is there a minimum loan amount required for refinancing?',
    answer:
      'Most banks require a minimum outstanding balance of ₹2,00,000 to ₹3,00,000 for car loan refinancing to be economically viable. If your outstanding amount is below ₹1,00,000, the processing fees may offset the interest savings.',
  },
  {
    question: 'Do I need to pay any foreclosure charges to my current bank?',
    answer:
      'RBI guidelines prohibit prepayment penalties on floating-rate loans for individual borrowers. For fixed-rate loans, your bank may charge 2-5% of the outstanding amount as foreclosure charges. Check your loan agreement or contact your bank for specific details.',
  },
  {
    question: 'What happens after I submit the callback request?',
    answer:
      'After you submit the form, a MotoFin loan specialist will call you within 30 minutes (during business hours: Mon-Sat, 9 AM - 7 PM). They will discuss your personalized results, answer questions, and help you proceed with the refinance application if you choose to.',
  },
];

export default function FAQPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-300">
            Everything you need to know about car loan refinancing
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Still have questions?</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Try our free calculator or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/#calculator">
              <Button size="md">
                Check Your Savings <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </div>
  );
}
