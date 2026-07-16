'use client';

import React, { useState } from 'react';
import { Compass, MapPin, Navigation, ExternalLink, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface ProjectLocationMapPopupProps {
  projectName: string;
  address?: string | null;
  mapUrl?: string | null;
}

export const ProjectLocationMapPopup: React.FC<ProjectLocationMapPopupProps> = ({
  projectName,
  address,
  mapUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const fullAddress = address || `${projectName}, Namakkal District, Tamil Nadu`;

  // Construct Google Maps embed src query
  let embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  if (mapUrl) {
    if (mapUrl.includes('pb=') || mapUrl.includes('embed')) {
      embedSrc = mapUrl;
    } else if (mapUrl.includes('q=')) {
      const qMatch = mapUrl.match(/q=([^&]+)/);
      if (qMatch && qMatch[1]) {
        embedSrc = `https://maps.google.com/maps?q=${qMatch[1]}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      }
    }
  }

  const directMapLink = mapUrl || `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="location" className="scroll-mt-36 space-y-6 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mx-auto">
          <Compass className="w-3.5 h-3.5" /> Interactive Viewport
        </div>

        <h2 className="font-serif text-3xl font-bold text-white text-center">Project Location & Address</h2>

        {/* Centered Closed Preview Card */}
        <div
          onClick={() => setIsOpen(true)}
          className="group p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl hover:border-amber-500/50 cursor-pointer transition-all duration-300 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Physical Address
          </div>

          <p className="text-sm sm:text-base font-semibold text-white max-w-xl mx-auto">
            {fullAddress}
          </p>

          <div className="pt-2">
            <Button variant="gold" size="md" className="font-bold shadow-lg group-hover:scale-105 transition-all">
              <Maximize2 className="w-4 h-4 mr-2" /> Launch Live Interactive Google Map
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Google Map Modal Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${projectName} — Interactive Site Location & Map`}
        description={fullAddress}
      >
        <div className="space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <iframe
              title={`${projectName} Google Maps Location`}
              src={embedSrc}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <a href={directMapLink} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="sm" className="font-bold">
                <Navigation className="w-4 h-4 mr-1.5" /> Open Driving Directions <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </Button>
            </a>
          </div>
        </div>
      </Dialog>
    </section>
  );
};
