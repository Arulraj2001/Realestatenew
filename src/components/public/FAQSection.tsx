'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';

export const FAQSection: React.FC = () => {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'Are all plots and villas DTCP & RERA approved?',
      content:
        'Yes, 100% of our layout developments in Namakkal and Paramathi Velur hold full DTCP and RERA statutory approvals. All planning permissions and title deeds are verified by senior legal advisors.',
    },
    {
      id: 'faq-2',
      title: 'How do I book a site visit?',
      content:
        'You can click "Schedule Site Visit" on our website or call +91 98765 43210. We provide free private car pickup and drop facilities for families anywhere in Namakkal, Tiruchengodu, or Paramathi Velur.',
    },
    {
      id: 'faq-3',
      title: 'Do you offer assistance with bank housing loans?',
      content:
        'Yes, our dedicated documentation team manages the complete bank loan application process. We are pre-approved with nationalized banks including State Bank of India, HDFC Bank, and Canara Bank.',
    },
    {
      id: 'faq-4',
      title: 'Can I request custom villa construction on my purchased plot?',
      content:
        'Absolutely. We offer complete turn-key villa construction services. Our architects will customize floor plans (2BHK, 3BHK, 4BHK) according to your family requirements and vastu preferences.',
    },
    {
      id: 'faq-5',
      title: 'What basic infrastructure is provided in the gated layouts?',
      content:
        'All townships are delivered with 30ft & 40ft blacktop asphalt roads, underground drainage network, individual water supply tap connections, street lighting, compound wall, and children park zones.',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Have Questions? We Have Answers.
          </h2>
          <p className="text-sm text-slate-400">
            Clear insights regarding legal verification, layout approval, site visits, and registration.
          </p>
        </div>

        <Accordion items={faqItems} />
      </div>
    </section>
  );
};
