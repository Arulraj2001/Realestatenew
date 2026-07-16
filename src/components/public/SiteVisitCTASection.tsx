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
}

export const SiteVisitCTASection: React.FC<SiteVisitCTASectionProps> = ({
  heading = 'Visit the Project Before You Decide',
  description = 'Tell us which location or property you are interested in, and our team will arrange a guided site visit.',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-[#0f2e21] via-slate-950 to-slate-950 text-slate-100 border-t border-emerald-900/40 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Chauffeured Pickup Available
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {heading}
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            variant="gold"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="font-bold px-8 py-4 text-base shadow-xl"
          >
            <Calendar className="w-5 h-5 mr-2" /> Schedule a Site Visit
          </Button>

          <a
            href={buildWhatsAppUrl({
              customMessage: 'Hi Your Choice Properties team, I would like to schedule a site visit to inspect your layouts.',
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-600/60 hover:bg-emerald-950 text-white bg-slate-900/60 font-bold px-8 py-4 text-base"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400 mr-2" /> Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* Dialog Modal for Booking Site Visit */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule a Guided Site Visit"
        description="Fill in your preferred date and contact details. Our team will coordinate."
      >
        <SiteVisitForm onSuccess={() => setIsModalOpen(false)} />
      </Dialog>
    </section>
  );
};
