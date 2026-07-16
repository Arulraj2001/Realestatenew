import React from 'react';
import { Building2, FileText, Compass } from 'lucide-react';

export interface CompanyIntroSectionProps {
  introHeading?: string;
  introContent?: string;
}

export const CompanyIntroSection: React.FC<CompanyIntroSectionProps> = ({
  introHeading = 'Find Residential Plots and Dream Villas in Namakkal and Paramathi Velur',
  introContent,
}) => {
  const defaultParagraphs = [
    'Looking for residential plots for sale in Namakkal or a dream villa in Namakkal or Paramathi Velur?',
    'Your Choice Properties is a trusted name for families looking to buy residential land, villas and independent houses at honest prices. Across our three main projects—Rasi Garden, Kongu Nagar and Kongu Garden—we offer investment-ready residential plots and thoughtfully planned 2BHK, 3BHK and 4BHK villas.',
    'Whether you are buying your first home, investing from abroad or looking for a larger family home, our team helps you understand the location, layout, documents and available property choices before you decide.',
  ];

  const paragraphs = introContent ? introContent.split('\n\n').filter(Boolean) : defaultParagraphs;

  return (
    <section className="company-intro-hero-overlap pt-10 pb-16 bg-slate-900 border-b border-slate-800 text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Trusted Real Estate Developer
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {introHeading}
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right Highlights Card Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">Clear DTCP Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Legally verified layouts with transparent title deeds ready for bank approval.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">Prime Highway Hubs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selected for residential growth, school proximity, and highway connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
