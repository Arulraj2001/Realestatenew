'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { buildWhatsAppUrl, buildCallUrl } from '@/lib/utils/whatsapp';
import { trackConversionEvent } from '@/lib/utils/analytics';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';

export const StickyActionBar: React.FC = () => {
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f2e21] border-t border-amber-500/30 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-lg">
        <a
          href={buildCallUrl()}
          onClick={() => trackConversionEvent('call_clicked', { source: 'mobile_sticky_bar' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-100 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call</span>
        </a>

        <a
          href={buildWhatsAppUrl({ customMessage: 'Hi, I am interested in property details.' })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversionEvent('whatsapp_clicked', { source: 'mobile_sticky_bar' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => setIsSiteVisitOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold active:scale-95 transition-transform cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Site Visit</span>
        </button>
      </div>

      {/* Quick Site Visit Dialog */}
      <Dialog
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        title="Book Free Site Visit"
        description="Pick-up and drop facility available across Namakkal and Paramathi Velur."
      >
        <SiteVisitForm onSuccess={() => setIsSiteVisitOpen(false)} />
      </Dialog>
    </>
  );
};
