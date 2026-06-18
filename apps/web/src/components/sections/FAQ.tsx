'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is car loan refinancing?',
    answer:
      'Car loan refinancing is the process of transferring your existing car loan to another bank that offers a lower interest rate. This reduces your EMI and total interest paid over the loan tenure.',
  },
  {
    question: 'How much can I save by refinancing my car loan?',
    answer:
      'Savings depend on the difference between your current rate and the new rate offered. On average, MotoFin customers save ₹2,000 to ₹5,000 per month by refinancing their car loans.',
  },
  {
    question: 'Which banks does MotoFin compare rates from?',
    answer:
      'MotoFin compares rates from 9+ partner banks including HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, and AU Small Finance Bank.',
  },
  {
    question: 'Do I need to submit documents to check my savings?',
    answer:
      'No. The initial savings check requires only your current EMI, outstanding amount, and interest rate. Documents are only needed if you decide to proceed with the refinance.',
  },
  {
    question: 'What is a top-up loan on a car loan?',
    answer:
      'A top-up loan allows you to borrow additional money on top of your existing car loan when you refinance. This is available if your car has sufficient equity.',
  },
  {
    question: 'How long does the car loan refinancing process take?',
    answer:
      'The initial savings check takes 30 seconds. If you decide to proceed, the full refinancing process typically takes 5-7 working days.',
  },
  {
    question: 'Will car loan refinancing affect my credit score?',
    answer:
      'The initial savings check on MotoFin does not affect your credit score. A formal application may result in a hard inquiry with a minor temporary impact.',
  },
  {
    question: 'Is my data safe on MotoFin?',
    answer:
      'Yes. MotoFin uses 256-bit bank-grade encryption. We never share your personal information without your consent.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-0 bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-slate-800 pr-4">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
}
