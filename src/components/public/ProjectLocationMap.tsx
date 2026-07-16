'use client';

import React from 'react';
import { MapPin, Compass, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProjectLocationMapProps {
  projectName: string;
  address?: string | null;
  mapUrl?: string | null;
}

export const ProjectLocationMap: React.FC<ProjectLocationMapProps> = ({
  projectName,
  address,
  mapUrl,
}) => {
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
    <div className="space-y-6">
      {/* Address Bar Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Official Project Address
          </div>
          <p className="text-white font-semibold text-sm sm:text-base">{fullAddress}</p>
        </div>

        <a href={directMapLink} target="_blank" rel="noopener noreferrer">
          <Button variant="gold" size="sm" className="font-bold whitespace-nowrap shadow-md hover:scale-105 transition-all">
            <Navigation className="w-4 h-4 mr-1.5" /> Get Driving Directions <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </Button>
        </a>
      </div>

      {/* Real Interactive Embedded Google Maps Iframe */}
      <div className="relative aspect-[16/9] max-h-[480px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <iframe
          title={`${projectName} Google Maps Location`}
          src={embedSrc}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Accent Badge */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="px-3 py-1 bg-slate-950/90 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" /> Interactive Site Location
          </span>
        </div>
      </div>
    </div>
  );
};
