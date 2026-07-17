'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

export interface SiteVisitCTASectionProps {
  heading?: string;
  description?: string;
  locationId?: string;
  projectId?: string;
}

export const SiteVisitCTASection: React.FC<SiteVisitCTASectionProps> = ({
  heading = 'Contact Our Sales Team',
  description = 'Tell us which location or property you are interested in, and our team will arrange a guided site visit.',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="site-visit-cta-section py-14 relative overflow-hidden">

        {/* ── Decorative Background Shapes ── */}

        {/* Large ring top-left */}
        <svg
          className="cta-deco-shape pointer-events-none absolute -top-16 -left-16 w-72 h-72 opacity-10"
          viewBox="0 0 288 288" fill="none"
          aria-hidden="true"
        >
          <circle cx="144" cy="144" r="128" stroke="currentColor" strokeWidth="20" />
          <circle cx="144" cy="144" r="80" stroke="currentColor" strokeWidth="8" strokeDasharray="16 12" />
        </svg>

        {/* Filled blob top-right */}
        <svg
          className="cta-deco-shape pointer-events-none absolute -top-10 -right-10 w-64 h-64 opacity-[0.07]"
          viewBox="0 0 256 256" fill="currentColor"
          aria-hidden="true"
        >
          <ellipse cx="128" cy="100" rx="110" ry="80" />
        </svg>

        {/* Diagonal accent line strip bottom-right */}
        <svg
          className="cta-deco-shape pointer-events-none absolute bottom-0 right-0 w-80 h-40 opacity-10"
          viewBox="0 0 320 160" fill="none"
          aria-hidden="true"
        >
          <line x1="320" y1="0" x2="0" y2="160" stroke="currentColor" strokeWidth="2" />
          <line x1="340" y1="0" x2="20" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="8 6" />
          <line x1="360" y1="0" x2="40" y2="160" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Small dot grid bottom-left */}
        <svg
          className="cta-deco-shape pointer-events-none absolute bottom-4 left-6 w-40 h-28 opacity-[0.12]"
          viewBox="0 0 160 112" fill="currentColor"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 22 + 10} r="2.5" />
            ))
          )}
        </svg>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="cta-heading font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
            {heading}
          </h2>
          <p className="cta-description text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Button
              variant="gold"
              size="lg"
              onClick={() => setIsOpen(true)}
              className="cta-primary-btn font-extrabold w-full sm:w-auto shadow-2xl"
            >
              <Calendar className="w-5 h-5 mr-2 pointer-events-none" /> Contact Us
            </Button>

            <a
              href={buildWhatsAppUrl({
                customMessage: 'Hi Your Choice Properties team, I would like to contact your sales team regarding your layouts.',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="cta-whatsapp-btn font-bold w-full border-2 shadow-xl"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2 pointer-events-none" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Us"
        description="Our sales team will assist you with layout maps, pricing sheets, and site visits."
      >
        <SiteVisitForm onSuccess={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};
