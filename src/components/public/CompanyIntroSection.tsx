import React from 'react';
import Image from 'next/image';
import {
  Building2,
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Landmark,
  Sparkles,
  MapPin,
} from 'lucide-react';

export interface CompanyIntroSectionProps {
  introHeading?: string;
  introContent?: string;
}

export const CompanyIntroSection: React.FC<CompanyIntroSectionProps> = ({
  introHeading,
  introContent,
}) => {
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
          {/* LEFT COLUMN: Concise Narrative Content & Feature Highlights */}
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

          {/* RIGHT COLUMN: Sleek Single-Card Modern Property Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Single Modern Glassmorphic Property Visual Card */}
              <div className="relative aspect-[16/12] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700/60 bg-slate-900 dark:bg-slate-950 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                  alt="DTCP Approved Certified Villa Property"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />

                {/* Top Badges Bar */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  {/* DTCP Certified Badge - Blue in light mode, Yellow in dark mode */}
                  <div className="bg-white/95 dark:bg-slate-950/85 dark:backdrop-blur-md border border-blue-500/30 dark:border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
                    <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-amber-400 leading-tight">
                        DTCP & RERA APPROVED
                      </p>
                    </div>
                  </div>

                  {/* Verified Title Seal */}
                  <div className="bg-white/95 dark:bg-slate-950/85 dark:backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      100% Clear Title
                    </span>
                  </div>
                </div>

                {/* Integrated Bottom Panel - Blue/Navy in light mode, Amber/White in dark mode */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3.5 bg-white/95 dark:bg-slate-950/85 dark:backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xl">
                  <div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-amber-400 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" /> Prime Residential Townships
                    </div>
                    <h4 className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold font-serif mt-0.5">
                      Approved Gated Community Layouts
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-1.5 rounded-xl shrink-0">
                    <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      Bank Loan Ready
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Stamp Badge */}
              <div className="absolute -bottom-3 -right-2 bg-[#2596be] dark:bg-gradient-to-r dark:from-amber-500 dark:to-amber-600 px-3.5 py-1.5 rounded-xl shadow-xl border border-[#1d7b9d] dark:border-amber-300/40 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transform rotate-1 hover:rotate-0 transition-transform z-20">
                <Sparkles className="w-3.5 h-3.5 fill-white dark:fill-slate-950 text-white dark:text-slate-950" />
                <span className="text-white dark:text-slate-950">Verified Property Developer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};





