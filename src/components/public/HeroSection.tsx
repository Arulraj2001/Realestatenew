'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { useTheme } from '@/components/layout/ThemeProvider';

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
  videoSpeed?: number;
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
  videoSpeed = 0.75,
}) => {
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && typeof videoSpeed === 'number') {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed]);

  const secondaryLabel = secondaryCtaLabel || 'Schedule a Site Visit';
  const isContactAction = secondaryLabel.toLowerCase().includes('contact');

  if (heroEnabled === false) return null;

  // Safeguard against empty string database configurations
  const safeDesktopImage = desktopImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80';
  const safePosterImage = posterImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';

  // Derive YouTube thumbnail for video poster when explicit poster image is not configured
  const videoPosterUrl = (() => {
    if (posterImage) return posterImage;
    const ytId = getYoutubeId(desktopVideo) || getYoutubeId(mobileVideo);
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return undefined;
  })();

  // Safe clamping of opacity 0-100 & blur (0-100% maps to 0-25px blur)
  const safeOpacity = Math.max(0, Math.min(100, overlayOpacity)) / 100;
  const blurPx = mediaType === 'video' ? 0 : (Math.max(0, Math.min(100, heroBlur)) / 100) * 20;
  const blurStyle: React.CSSProperties = blurPx > 0 ? { filter: `blur(${blurPx.toFixed(1)}px)`, transform: 'scale(1.05)' } : {};

  const alignClasses =
    textAlignment === 'left'
      ? 'text-left items-start'
      : textAlignment === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 pb-28 sm:pb-36">
      {/* Media Background Layer (Pure container, clips all rendering issues) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Blur/Scale Wrapper */}
        <div className="w-full h-full overflow-hidden" style={blurStyle}>
          {mediaType === 'video' && (getYoutubeId(desktopVideo) || getYoutubeId(mobileVideo)) ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              {/* Optional Poster image shown while YouTube iframe initializes */}
              {videoPosterUrl && (
                <Image
                  src={videoPosterUrl}
                  alt="Your Choice Properties Banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover pointer-events-none z-0"
                />
              )}
              {/* Desktop YouTube Embed — immediate loading */}
              {getYoutubeId(desktopVideo) && (
                <div className={`absolute inset-0 w-full h-full overflow-hidden z-10 ${mobileVideo && getYoutubeId(mobileVideo) ? 'hidden md:block' : 'block'}`}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(desktopVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(desktopVideo)}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                    className="absolute top-1/2 left-1/2 pointer-events-none border-0"
                    style={{
                      width: '100vw',
                      height: '56.25vw',
                      minWidth: '177.78vh',
                      minHeight: '100vh',
                      transform: 'translate(-50%, -50%) scale(1.5)'
                    }}
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
              {/* Mobile YouTube Embed — immediate loading */}
              {mobileVideo && getYoutubeId(mobileVideo) && (
                <div className="absolute inset-0 w-full h-full overflow-hidden z-10 block md:hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(mobileVideo)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(mobileVideo)}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                    className="absolute top-1/2 left-1/2 pointer-events-none border-0"
                    style={{
                      width: '100vw',
                      height: '177.78vw',
                      minWidth: '56.25vh',
                      minHeight: '100vh',
                      transform: 'translate(-50%, -50%) scale(1.5)'
                    }}
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
            </div>
          ) : mediaType === 'video' && desktopVideo ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={posterImage || undefined}
              className="w-full h-full object-cover origin-center"
              style={{
                transform: 'scale(1.35)'
              }}
            >
              <source src={desktopVideo} type="video/mp4" />
              {mobileVideo && mobileVideo !== desktopVideo && <source src={mobileVideo} type="video/mp4" />}
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
        </div>

        {/* Dynamic Admin Controlled Dark Overlay Opacity (Unblurred, perfectly aligned, only shown for static images) */}
        {mediaType !== 'video' && (
          <>
            <div
              className="absolute inset-0 bg-slate-950"
              style={{ opacity: safeOpacity }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
          </>
        )}
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className={`flex flex-col ${alignClasses} space-y-5`}>
          {/* Badge Tag */}
          <div className="hero-animate-badge inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-xl">
            <Sparkles className="w-3.5 h-3.5" /> DTCP & RERA Approved Layouts
          </div>

          {/* H1 Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md flex flex-wrap justify-center gap-x-[0.25em] gap-y-1">
            {heroTitle.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="hero-word-left inline-block"
                style={{ animationDelay: `${0.5 + idx * 0.045}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-sm sm:text-lg max-w-3xl leading-relaxed font-normal drop-shadow-sm flex flex-wrap justify-center gap-x-[0.22em] gap-y-1">
            {heroDescription.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="hero-word-right inline-block"
                style={{ animationDelay: `${0.9 + idx * 0.035}s` }}
              >
                {word}
              </span>
            ))}
          </p>

          {/* Compact Designed CTA Buttons with Mouse Hover Animations */}
          <div className="hero-animate-cta flex flex-wrap items-center justify-center gap-4 pt-3">
            {theme === 'light' ? (
              <>
                <Link href={primaryCtaLink} className="group">
                  <Button
                    variant="gold"
                    size="sm"
                    className="font-bold px-5 py-2.5 text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 hover:shadow-amber-500/35 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>{primaryCtaLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 pointer-events-none" />
                  </Button>
                </Link>

                {isContactAction ? (
                  <Link href="/contact-us">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group border-slate-400 hover:border-amber-400 text-slate-100 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md font-bold px-5 py-2.5 text-xs sm:text-sm rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <Calendar className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300 pointer-events-none" />
                      <span>{secondaryLabel}</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisitModalOpen(true)}
                    className="group border-slate-400 hover:border-amber-400 text-slate-100 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md font-bold px-5 py-2.5 text-xs sm:text-sm rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <Calendar className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300 pointer-events-none" />
                    <span>{secondaryLabel}</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Link href={primaryCtaLink} className="blob-btn blob-btn-explore">
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 pointer-events-none" />
                  <span className="blob-btn__inner">
                    <span className="blob-btn__blobs">
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                    </span>
                  </span>
                </Link>

                {isContactAction ? (
                  <Link href="/contact-us" className="blob-btn blob-btn-contact">
                    <Calendar className="w-4 h-4 shrink-0 pointer-events-none" />
                    <span>{secondaryLabel}</span>
                    <span className="blob-btn__inner">
                      <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                      </span>
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsVisitModalOpen(true)}
                    className="blob-btn blob-btn-contact"
                  >
                    <Calendar className="w-4 h-4 shrink-0 pointer-events-none" />
                    <span>{secondaryLabel}</span>
                    <span className="blob-btn__inner">
                      <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                      </span>
                    </span>
                  </button>
                )}
              </>
            )}
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
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
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
