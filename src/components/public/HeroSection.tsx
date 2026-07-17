'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';

export interface HeroSectionProps {
  heroTitle?: string;
  heroDescription?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  secondaryCtaLabel?: string;
  mediaType?: 'video' | 'image';
  desktopVideo?: string;
  mobileVideo?: string;
  desktopImage?: string;
  mobileImage?: string;
  posterImage?: string;
  overlayOpacity?: number;
  heroBlur?: number;
  textAlignment?: 'left' | 'center' | 'right';
  heroEnabled?: boolean;
}

const getYoutubeId = (url?: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroTitle = 'Your Choice Properties – Trusted Plots, Villas and Houses in Namakkal and Paramathi Velur',
  heroDescription = 'Explore residential plots, gated-community villas and independent houses across our projects in Namakkal and Paramathi Velur.',
  primaryCtaLabel = 'Explore Projects',
  primaryCtaLink = '/projects',
  secondaryCtaLabel = 'Contact Us',
  mediaType = 'image',
  desktopVideo,
  mobileVideo,
  desktopImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
  mobileImage,
  posterImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  overlayOpacity = 70,
  heroBlur = 0,
  textAlignment = 'center',
  heroEnabled = true,
}) => {
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Dynamic fallback to intercept seeded value
  const displaySecondaryCta = secondaryCtaLabel === 'Schedule a Site Visit' ? 'Contact Us' : secondaryCtaLabel;

  if (heroEnabled === false) return null;

  // Safeguard against empty string database configurations
  const safeDesktopImage = desktopImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80';
  const safePosterImage = posterImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';

  // Safe clamping of opacity 0-100 & blur (0-100% maps to 0-25px blur)
  const safeOpacity = Math.max(0, Math.min(100, overlayOpacity)) / 100;
  const blurPx = (Math.max(0, Math.min(100, heroBlur)) / 100) * 20;
  const blurStyle: React.CSSProperties = blurPx > 0 ? { filter: `blur(${blurPx.toFixed(1)}px)`, transform: 'scale(1.05)' } : {};

  const alignClasses =
    textAlignment === 'left'
      ? 'text-left items-start'
      : textAlignment === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 pb-28 sm:pb-36">
      {/* Media Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden" style={blurStyle}>
        {mediaType === 'video' && (getYoutubeId(desktopVideo) || getYoutubeId(mobileVideo)) ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Desktop YouTube Embed */}
            {getYoutubeId(desktopVideo) && (
              <div className={`absolute inset-0 w-full h-full ${mobileVideo && getYoutubeId(mobileVideo) ? 'hidden md:block' : 'block'}`}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(desktopVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(desktopVideo)}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
                  style={{ minWidth: '100%', minHeight: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}
            {/* Mobile YouTube Embed */}
            {mobileVideo && getYoutubeId(mobileVideo) && (
              <div className="absolute inset-0 w-full h-full block md:hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(mobileVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(mobileVideo)}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
                  style={{ minWidth: '100%', minHeight: '100%', aspectRatio: '9/16', objectFit: 'cover' }}
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}
          </div>
        ) : mediaType === 'video' && desktopVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={safePosterImage || safeDesktopImage}
            className="w-full h-full object-cover"
          >
            <source src={desktopVideo} type="video/mp4" />
            {mobileVideo && <source src={mobileVideo} type="video/mp4" />}
          </video>
        ) : (
          <picture className="relative block w-full h-full">
            {mobileImage && <source media="(max-width: 640px)" srcSet={mobileImage} />}
            <Image
              src={safeDesktopImage || safePosterImage}
              alt="Your Choice Properties Banner"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </picture>
        )}

        {/* Dynamic Admin Controlled Dark Overlay Opacity */}
        <div
          className="absolute inset-0 bg-slate-950"
          style={{ opacity: safeOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className={`flex flex-col ${alignClasses} space-y-5`}>
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-xl">
            <Sparkles className="w-3.5 h-3.5" /> DTCP & RERA Approved Layouts
          </div>

          {/* H1 Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {heroTitle}
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-sm sm:text-lg max-w-3xl leading-relaxed font-normal drop-shadow-sm">
            {heroDescription}
          </p>

          {/* Compact Designed CTA Buttons with Mouse Hover Animations */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link href={primaryCtaLink} className="blob-btn blob-btn-explore">
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="blob-btn__inner">
                <span className="blob-btn__blobs">
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                </span>
              </span>
            </Link>

            <button
              onClick={() => setIsVisitModalOpen(true)}
              className="blob-btn blob-btn-contact"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{displaySecondaryCta}</span>
              <span className="blob-btn__inner">
                <span className="blob-btn__blobs">
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Site Visit Booking Modal */}
      <Dialog
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title="Request a Guided Site Visit"
        description="Provide your details below, and our team will get in touch to confirm layout availability and schedule your visit."
      >
        <SiteVisitForm onSuccess={() => setIsVisitModalOpen(false)} />
      </Dialog>

      {/* SVG gooey blob filter definitions */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
          </filter>
        </defs>
      </svg>
    </section>
  );
};
