'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-slate-100 last:border-b-0">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-slate-800 pr-4 text-sm md:text-base">
              {faq.question}
            </span>
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
  );
}
