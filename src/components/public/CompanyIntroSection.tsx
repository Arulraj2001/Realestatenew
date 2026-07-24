'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Landmark,
  Sparkles,
  MapPin,
  ZoomIn,
  X,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils/media';

export interface CompanyIntroSectionProps {
  introHeading?: string;
  introContent?: string;
  introImage?: string;
}

export const CompanyIntroSection: React.FC<CompanyIntroSectionProps> = ({
  introHeading,
  introContent,
  introImage,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const defaultHeading =
    'Find Approved Residential Plots & Dream Villas in Prime Locations';

  const defaultParagraphs = [
    'Looking for premier DTCP & RERA approved residential plots or your dream villa? Your Choice Properties is a trusted developer offering 100% legally verified land, gated community layouts, and luxury independent villas at honest, transparent prices.',
    'Our signature township layouts feature 40ft wide blacktop roads, underground utilities, street lighting, 24/7 security, and lush park reserves—backed by 100% clear title deeds and fast bank loan assistance.',
  ];

  const heading = introHeading || defaultHeading;
  const paragraphs = introContent
    ? introContent.split('\n\n').filter(Boolean)
    : defaultParagraphs;

  const imageSrc = getMediaUrl(introImage || '/certifivate.jpeg');

  const trustHighlights = [
    '100% Clear Title Deeds',
    'DTCP & RERA Approved',
    'Bank Loan Assistance (Up to 80%)',
    'Ready for Construction',
    '40ft Blacktop Roads',
    'Prime Growth Locations',
  ];

  return (
    <section className="company-intro-hero-overlap pt-8 pb-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Narrative Content & Trust Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Trusted Real Estate Developer
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {heading}
            </h2>

            <div className="space-y-3.5 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Keyword Feature Tags Grid */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {trustHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-blue-500/40 dark:hover:border-amber-500/40 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Official Certificate Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Certificate Card with Hover overlay and Click-to-Expand */}
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl group cursor-pointer"
              >
                <Image
                  src={imageSrc}
                  alt="Official Government DTCP & RERA Approval Certificate"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-contain p-2 bg-white transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Right Corner Badge: 100% Clear Title */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <div className="bg-[#091e3a] dark:bg-slate-950/90 backdrop-blur-md border border-emerald-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 dark:text-emerald-400 uppercase tracking-wider">
                      100% Clear Title
                    </span>
                  </div>
                </div>

                {/* Floating Click to Expand Badge on Hover — Dark Navy bg (#091e3a), Plain text without shadow effects */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="px-4 py-2.5 bg-[#091e3a] text-amber-400 border border-amber-400/80 text-xs font-bold flex items-center gap-2 shadow-xl rounded-full [text-shadow:none] drop-shadow-none">
                    <ZoomIn className="w-4 h-4 text-amber-400 shrink-0 [filter:none]" />
                    <span className="text-amber-400 [text-shadow:none] drop-shadow-none font-bold">Click to Expand Certificate</span>
                  </div>
                </div>

                {/* Integrated Bottom Panel — App Blue for subhead, Dark Navy for title in Light Mode */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3.5 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xl z-10">
                  <div>
                    <div className="flex items-center gap-1 text-[#2596be] dark:text-amber-400 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#2596be] dark:text-amber-400" /> Official Government Approval
                    </div>
                    <h4 className="text-[#091e3a] dark:text-white text-xs sm:text-sm font-bold mt-0.5 font-sans tracking-tight">
                      DTCP &amp; RERA Registration License
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-1.5 rounded-xl shrink-0">
                    <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stamp Badge */}
              <div className="absolute -bottom-3 -right-2 bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl shadow-xl border border-amber-300 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider z-20">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>Government Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Full-Screen Certificate Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Official DTCP &amp; RERA Government Approval Certificate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[70vh] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image
                src={imageSrc}
                alt="Full Resolution DTCP & RERA Approval Certificate"
                fill
                className="object-contain"
                quality={95}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
