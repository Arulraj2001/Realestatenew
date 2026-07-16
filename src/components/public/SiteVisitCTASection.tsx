'use client';

import React, { useState } from 'react';
import { Calendar, MessageSquare } from 'lucide-react';
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
      <section className="py-16 bg-slate-950 border-y border-emerald-500/30 relative overflow-hidden">
        {/* Dark Emerald Gradient Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold !text-white tracking-tight drop-shadow-lg">
            {heading}
          </h2>
          <p className="!text-white text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Button
              variant="gold"
              size="lg"
              onClick={() => setIsOpen(true)}
              className="font-extrabold w-full sm:w-auto shadow-2xl bg-amber-500 !text-slate-950 hover:bg-amber-400"
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
              <Button variant="outline" size="lg" className="font-bold w-full border-2 border-emerald-500/60 bg-slate-950/80 !text-emerald-400 hover:bg-emerald-950 shadow-xl">
                <MessageSquare className="w-5 h-5 mr-2 pointer-events-none" /> Chat on WhatsApp
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
