'use client';

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';

export interface HeroSectionProps {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroTitle,
  heroSubtitle,
  heroVideoUrl,
  heroPosterUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultTitle =
    heroTitle || 'Premium DTCP Approved Villa Plots & Luxury Homes in Namakkal';
  const defaultSubtitle =
    heroSubtitle ||
    'Discover 100% clear-title residential communities, paved avenues, and custom villa designs in prime Tamil Nadu hubs.';

  const defaultPoster =
    heroPosterUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Background Media */}
      {heroVideoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={defaultPoster}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${defaultPoster}')` }}
        />
      )}

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>100% DTCP & RERA Approved Layouts</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          {defaultTitle}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
          {defaultSubtitle}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#featured-projects">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto border-slate-600 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 text-white"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Schedule Free Site Visit</span>
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap justify-center items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> Key Hubs:
          </span>
          <span className="px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800 text-slate-200">
            Namakkal
          </span>
          <span className="px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800 text-slate-200">
            Paramathi Velur
          </span>
          <span className="px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800 text-slate-400 opacity-60">
            Salem (Upcoming)
          </span>
        </div>
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Free Site Visit"
        description="Pick-up & drop facility available across Namakkal and surrounding regions."
      >
        <SiteVisitForm onSuccess={() => setIsModalOpen(false)} />
      </Dialog>
    </section>
  );
};
