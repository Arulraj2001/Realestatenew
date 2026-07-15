'use client';

import React, { useState } from 'react';
import { Calendar, PhoneCall, MessageSquare, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl, buildCallUrl } from '@/lib/utils/whatsapp';
import { trackConversionEvent } from '@/lib/utils/analytics';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { siteConfig } from '@/config/site';

export const SiteVisitCTASection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-[#0f2e21] via-slate-900 to-slate-950 border-t border-emerald-900/60 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Complimentary Transport Facility Available</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to Find Your Ideal Plot or Villa in Namakkal?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience our layouts first-hand. Schedule a free site visit today with our property advisors. Pick-up and drop options provided.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto font-bold shadow-xl"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>Book Free Site Visit Now</span>
            </Button>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversionEvent('whatsapp_clicked', { source: 'site_visit_cta_banner' })}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-emerald-600 text-emerald-400 hover:bg-emerald-950">
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp</span>
              </Button>
            </a>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Or call us directly at{' '}
            <a
              href={buildCallUrl()}
              onClick={() => trackConversionEvent('call_clicked', { source: 'site_visit_cta_banner' })}
              className="text-amber-400 font-bold hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5 inline mr-1" />
              {siteConfig.contact.phone}
            </a>
          </p>
        </div>
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Site Visit"
        description="Fill out the details below and our coordinator will confirm your pickup timing."
      >
        <SiteVisitForm onSuccess={() => setIsModalOpen(false)} />
      </Dialog>
    </section>
  );
};
