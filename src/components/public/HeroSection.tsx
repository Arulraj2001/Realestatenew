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
  heroH1Alignment?: 'left' | 'center' | 'right';
  heroH1ColorLight?: string;
  heroH1ColorDark?: string;
  heroH1Size?: 'normal' | 'large' | 'xlarge' | string;
  heroH1Transform?: 'none' | 'uppercase' | 'capitalize' | string;
  heroSubtitleAlignment?: 'left' | 'center' | 'right';
  heroSubColorLight?: string;
  heroSubColorDark?: string;
  heroSubSize?: 'small' | 'normal' | 'large' | string;
  headerLightTextColor?: string;
  headerDarkTextColor?: string;
  heroVerticalPosition?: 'center' | 'top' | 'bottom' | string;
  heroContentWidth?: '5xl' | '3xl' | '7xl' | string;
  heroH1MarginTop?: 'normal' | 'none' | 'small' | 'large' | string;
  heroSubMarginTop?: 'normal' | 'none' | 'small' | 'large' | string;
  heroBoxPosition?: string;
  heroOffsetX?: number;
  heroOffsetY?: number;
  heroBadgeText?: string;
  heroBadgeVisible?: boolean;
  heroBadgeAlignment?: 'left' | 'center' | 'right';
  heroBadgeColorLight?: string;
  heroBadgeColorDark?: string;
  heroBadgeSize?: 'small' | 'normal' | 'large' | string;
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
  heroH1Alignment,
  heroH1ColorLight,
  heroH1ColorDark,
  heroH1Size,
  heroH1Transform,
  heroSubtitleAlignment,
  heroSubColorLight,
  heroSubColorDark,
  heroSubSize,
  headerLightTextColor,
  headerDarkTextColor,
  heroVerticalPosition = 'center',
  heroContentWidth = '5xl',
  heroH1MarginTop = 'normal',
  heroSubMarginTop = 'normal',
  heroBoxPosition = 'center',
  heroOffsetX = 0,
  heroOffsetY = 0,
  heroBadgeText = 'DTCP & RERA Approved Layouts',
  heroBadgeVisible = true,
  heroBadgeAlignment,
  heroBadgeColorLight,
  heroBadgeColorDark,
  heroBadgeSize,
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

  const effectiveH1Align = heroH1Alignment || textAlignment;
  const effectiveSubAlign = heroSubtitleAlignment || textAlignment;

  const alignClasses =
    textAlignment === 'left'
      ? 'text-left items-start'
      : textAlignment === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  const h1FlexAlign =
    effectiveH1Align === 'left'
      ? 'justify-start text-left'
      : effectiveH1Align === 'right'
      ? 'justify-end text-right'
      : 'justify-center text-center';

  const subFlexAlign =
    effectiveSubAlign === 'left'
      ? 'justify-start text-left'
      : effectiveSubAlign === 'right'
      ? 'justify-end text-right'
      : 'justify-center text-center';

  const h1CustomColor = theme === 'light' ? (heroH1ColorLight || headerLightTextColor) : (heroH1ColorDark || headerDarkTextColor);
  const subCustomColor = theme === 'light' ? (heroSubColorLight || headerLightTextColor) : (heroSubColorDark || headerDarkTextColor);

  const h1Style: React.CSSProperties = {
    ...(h1CustomColor ? { color: h1CustomColor } : {}),
    ...(heroH1Transform && heroH1Transform !== 'none' ? { textTransform: heroH1Transform as React.CSSProperties['textTransform'] } : {}),
  };

  const subStyle: React.CSSProperties = {
    ...(subCustomColor ? { color: subCustomColor } : {}),
  };

  const h1SizeClass =
    heroH1Size === 'large'
      ? 'text-4xl sm:text-6xl'
      : heroH1Size === 'xlarge'
      ? 'text-5xl sm:text-7xl'
      : 'text-3xl sm:text-5xl';

  const subSizeClass =
    heroSubSize === 'small'
      ? 'text-xs sm:text-base'
      : heroSubSize === 'large'
      ? 'text-base sm:text-xl'
      : 'text-sm sm:text-lg';

  const verticalJustifyClass =
    heroVerticalPosition === 'top'
      ? 'justify-start pt-20 sm:pt-28 pb-12'
      : heroVerticalPosition === 'bottom'
      ? 'justify-end pt-12 pb-24 sm:pb-32'
      : 'justify-center pt-16 sm:pt-24 pb-12';

  const containerWidthClass =
    heroContentWidth === '3xl'
      ? 'max-w-3xl'
      : heroContentWidth === '7xl'
      ? 'max-w-7xl'
      : 'max-w-5xl';

  const h1MarginTopClass =
    heroH1MarginTop === 'none'
      ? 'mt-0'
      : heroH1MarginTop === 'small'
      ? 'mt-1'
      : heroH1MarginTop === 'large'
      ? 'mt-5'
      : '';

  const subMarginTopClass =
    heroSubMarginTop === 'none'
      ? 'mt-0'
      : heroSubMarginTop === 'small'
      ? 'mt-1'
      : heroSubMarginTop === 'large'
      ? 'mt-5'
      : '';

  // 9-Point Box Position alignment mapping
  const boxPosLayout = (() => {
    switch (heroBoxPosition) {
      case 'top-left':
        return { justify: 'justify-start pt-16 sm:pt-20 pb-8', align: 'items-start text-left' };
      case 'top-center':
        return { justify: 'justify-start pt-16 sm:pt-20 pb-8', align: 'items-center text-center' };
      case 'top-right':
        return { justify: 'justify-start pt-16 sm:pt-20 pb-8', align: 'items-end text-right' };
      case 'center-left':
        return { justify: 'justify-center pt-12 pb-12', align: 'items-start text-left' };
      case 'center-right':
        return { justify: 'justify-center pt-12 pb-12', align: 'items-end text-right' };
      case 'bottom-left':
        return { justify: 'justify-end pt-8 pb-24 sm:pb-32', align: 'items-start text-left' };
      case 'bottom-center':
        return { justify: 'justify-end pt-8 pb-24 sm:pb-32', align: 'items-center text-center' };
      case 'bottom-right':
        return { justify: 'justify-end pt-8 pb-24 sm:pb-32', align: 'items-end text-right' };
      case 'center':
      default:
        return {
          justify:
            heroVerticalPosition === 'top'
              ? 'justify-start pt-20 sm:pt-28 pb-12'
              : heroVerticalPosition === 'bottom'
              ? 'justify-end pt-12 pb-24 sm:pb-32'
              : 'justify-center pt-16 sm:pt-24 pb-12',
          align: alignClasses,
        };
    }
  })();

  const badgeCustomColor = theme === 'light' ? heroBadgeColorLight : heroBadgeColorDark;
  const badgeStyle: React.CSSProperties = badgeCustomColor
    ? { color: badgeCustomColor, borderColor: `${badgeCustomColor}60`, backgroundColor: `${badgeCustomColor}15` }
    : {};

  const badgeTextColorClass = badgeCustomColor ? '' : 'text-amber-400';
  const badgeBorderColorClass = badgeCustomColor ? '' : 'border-amber-500/30';
  const badgeBgColorClass = badgeCustomColor ? '' : 'bg-amber-500/10';

  const badgeSizeClass =
    heroBadgeSize === 'small'
      ? 'text-[10px] px-2.5 py-0.5'
      : heroBadgeSize === 'large'
      ? 'text-sm px-4 py-1.5'
      : 'text-xs px-3.5 py-1';

  const badgeAlignClass =
    (heroBadgeAlignment || textAlignment) === 'left'
      ? 'self-start'
      : (heroBadgeAlignment || textAlignment) === 'right'
      ? 'self-end'
      : 'self-center';

  const offsetTransformStyle: React.CSSProperties =
    heroOffsetX || heroOffsetY
      ? { transform: `translate3d(${heroOffsetX || 0}px, ${heroOffsetY || 0}px, 0px)` }
      : {};

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
      <div className={`relative z-10 ${containerWidthClass} mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col ${boxPosLayout.justify}`}>
        <div className={`flex flex-col ${boxPosLayout.align} space-y-5`} style={offsetTransformStyle}>
          {/* Badge Tag */}
          {heroBadgeVisible !== false && (
            <div
              style={badgeStyle}
              className={`hero-animate-badge ${badgeAlignClass} inline-flex items-center gap-2 ${badgeSizeClass} ${badgeBgColorClass} ${badgeBorderColorClass} border rounded-full ${badgeTextColorClass} font-bold uppercase tracking-widest backdrop-blur-md shadow-xl`}
            >
              <Sparkles className="w-3.5 h-3.5" style={badgeCustomColor ? { color: badgeCustomColor } : undefined} /> {heroBadgeText || 'DTCP & RERA Approved Layouts'}
            </div>
          )}

          {/* H1 Heading */}
          <h1
            style={h1Style}
            className={`font-serif ${h1SizeClass} ${h1MarginTopClass} font-extrabold tracking-tight leading-tight max-w-4xl drop-shadow-md flex flex-wrap ${h1FlexAlign} gap-x-[0.25em] gap-y-1`}
          >
            {heroTitle.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="hero-word-left inline-block"
                style={{ ...h1Style, animationDelay: `${0.5 + idx * 0.045}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            style={subStyle}
            className={`${subSizeClass} ${subMarginTopClass} max-w-3xl leading-relaxed font-normal drop-shadow-sm flex flex-wrap ${subFlexAlign} gap-x-[0.22em] gap-y-1`}
          >
            {heroDescription.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="hero-word-right inline-block"
                style={{ ...subStyle, animationDelay: `${0.9 + idx * 0.035}s` }}
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
