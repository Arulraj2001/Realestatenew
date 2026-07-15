import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

export interface CompanyIntroSectionProps {
  heading?: string;
  body?: string;
}

export const CompanyIntroSection: React.FC<CompanyIntroSectionProps> = ({ heading, body }) => {
  const defaultHeading = heading || 'Building Trust, Delighting Homeowners across Tamil Nadu';
  const defaultBody =
    body ||
    `${siteConfig.name} is a premier real-estate development firm dedicated to crafting high-value gated townships, villa projects, and residential plot layouts across Namakkal, Paramathi Velur, and expanding regional hubs.`;

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Established Excellence
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {defaultHeading}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {defaultBody}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>100% Clear Legal Title Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>DTCP & RERA Approved Layouts</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Heavy Asphalt Roads & Drainage</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Instant Turnkey Villa Construction</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                alt="Your Choice Properties Layout Showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 p-4 bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl flex items-center gap-4 hidden sm:flex">
              <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-serif font-extrabold text-xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">Trusted Developer</span>
                <span className="block text-[11px] text-amber-400">1,200+ Satisfied Families</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
