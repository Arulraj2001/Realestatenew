import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import {
  Info,
  Award,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Landmark,
  FileCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getContentPage } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export const metadata: Metadata = {
  title: 'About Your Choice Properties | Real Estate Company in Namakkal',
  description:
    'Learn about Your Choice Properties, our honest approach and our experience in residential plots and villa development across Namakkal and Paramathi Velur.',
  alternates: {
    canonical: `${siteConfig.domain}/about-us`,
  },
};

export interface WhyChoiceItem {
  title: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
}

export default async function AboutUsPage() {
  const contentRecord = await getContentPage('about');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentJson = (contentRecord?.content as Record<string, any>) || {};

  const defaultWhyItems: WhyChoiceItem[] = [
    {
      title: 'Prime Location',
      description: 'Projects in fast-growing areas with excellent connectivity and appreciation potential.',
    },
    {
      title: 'DTCP Approved',
      description: 'Legally approved plots and villas for secure property ownership.',
    },
    {
      title: 'Loan Assistance',
      description: 'End-to-end support for hassle-free home loan processing.',
    },
    {
      title: 'Clear Documentation',
      description: 'Transparent legal documentation with no hidden complications.',
    },
    {
      title: 'High Growth Potential',
      description: 'Carefully selected locations ideal for long-term investment.',
    },
    {
      title: 'Trusted Support',
      description: 'Personalized guidance from site visit to registration.',
    },
  ];

  const defaultStats: StatItem[] = [
    { label: 'Years of Experience', value: '13+' },
    { label: 'Successful Projects', value: '5' },
    { label: 'Happy Customers', value: '135+' },
    { label: 'Plots Sold', value: '120+' },
    { label: 'Villas Sold', value: '15+' },
  ];

  const timelineMilestones: TimelineMilestone[] = [
    {
      year: '2011',
      title: 'Foundational Real Estate Mastery',
      subtitle: 'Land Acquisition & Legal Due Diligence',
      description:
        'Key leadership entered real estate development in Tamil Nadu, establishing rigorous 100% title clearance standards and sub-registrar document verification procedures.',
      badge: 'Foundation',
    },
    {
      year: '2018',
      title: 'Township Infrastructure Expansion',
      subtitle: 'Gated Layout & Blacktop Road Engineering',
      description:
        'Spearheaded major residential layout planning across Namakkal and Salem highway corridors, installing 40ft blacktop avenues, underground drainage, and street lighting.',
      badge: 'Growth Era',
    },
    {
      year: '2023',
      title: 'DTCP & RERA Sanctioned Projects',
      subtitle: 'Flagship Namakkal & Paramathi Velur Hubs',
      description:
        'Launched premier layout townships with statutory DTCP and RERA approvals, introducing custom 2BHK, 3BHK, and 4BHK villa construction capabilities for homebuyers.',
      badge: 'Approval Milestone',
    },
    {
      year: '2024',
      title: 'Establishment of Your Choice Properties',
      subtitle: 'Dedicated Customer-Centric Brand',
      description:
        'Formally established Your Choice Properties as a dedicated real-estate brand to deliver plot layouts (Rasi Garden, Kongu Nagar, Kongu Garden) with end-to-end customer support.',
      badge: 'Brand Establishment',
    },
    {
      year: 'Present & Future',
      title: 'Turnkey Luxury Villa & Township Ecosystems',
      subtitle: 'Continued Legacy & Regional Leadership',
      description:
        'Expanding sustainable gated layouts and turn-key custom villa communities across Tamil Nadu with complementary site-visit transport and bank loan assistance.',
      badge: 'Current Vision',
    },
  ];

  const whyItems: WhyChoiceItem[] = contentJson.why_choice_items || defaultWhyItems;
  const statsList: StatItem[] = contentJson.stats_list || defaultStats;
  const isStatsVisible = contentJson.stats_visible !== false;

  const defaultFounderParagraphs = [
    'Your Choice Properties is led by Thennarasu Sambathkumar, who has more than 13 years of experience in land development, villa construction and residential property sales in Tamil Nadu.',
    'Before starting Your Choice Properties in 2024, he worked for six years as a Director at VIP Housing and Properties and another six years as a Director at MG Properties. This experience helped him understand land selection, layout planning, villa construction and the practical needs of property buyers.',
    'His approach is simple: “We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.”',
  ];

  const founderParagraphs = contentJson.founder_content
    ? contentJson.founder_content.split('\n\n').filter(Boolean)
    : defaultFounderParagraphs;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Modern Glassmorphism Company Profile Hero Header */}
      <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-emerald-900/60 bg-gradient-to-br from-[#0f2e21] via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> Company Profile &amp; Integrity
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {contentJson.about_h1 || 'Your Trusted Real Estate Partner in Namakkal and Paramathi Velur'}
          </h1>

          <div className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed space-y-4 pt-2">
            <p>
              Your Choice Properties was established with a clear commitment: to bring transparency, legal clarity, and structural excellence to residential land and villa development across Namakkal and Paramathi Velur.
            </p>
            <p>
              Every layout in our portfolio—including Rasi Garden, Kongu Nagar, and Kongu Garden—is planned with DTCP/RERA approvals, asphalt road infrastructure, potable water lines, and clear title documentation before being offered to home buyers.
            </p>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-900/40">
            <div className="p-4 bg-slate-950/60 border border-emerald-800/40 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-xs block">100% Title Cleared</span>
                <span className="text-[11px] text-slate-400 block">Verified Deed Search</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-emerald-800/40 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <Building2 className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-xs block">DTCP &amp; RERA Sanctioned</span>
                <span className="text-[11px] text-slate-400 block">Approved Layouts</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-emerald-800/40 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <MapPin className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-xs block">Prime Highway Corridors</span>
                <span className="text-[11px] text-slate-400 block">Namakkal &amp; Velur</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Vision Founder Section */}
      <section className="max-w-7xl mx-auto py-12 px-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Founder Image / Emblem Badge */}
          <div className="lg:col-span-4 flex justify-center">
            {contentJson.founder_image ? (
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
                <Image src={contentJson.founder_image} alt={contentJson.founder_name || 'Thennarasu Sambathkumar'} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-64 h-80 rounded-2xl bg-slate-950 border-2 border-amber-500/40 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-2xl">
                <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center font-serif font-extrabold text-slate-950 text-3xl shadow-xl">
                  YCP
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-lg">{contentJson.founder_name || 'Thennarasu Sambathkumar'}</h4>
                  <span className="text-xs font-bold text-amber-400 block mt-0.5">{contentJson.founder_role || 'Managing Director'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Founder Bio */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" /> Leadership & Vision
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">Our Founder</h2>
              <h3 className="text-xl font-semibold text-amber-400 mt-1">
                {contentJson.founder_name || 'Thennarasu Sambathkumar'}{' '}
                <span className="text-xs text-slate-400 font-normal">({contentJson.founder_role || 'Managing Director'})</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {founderParagraphs.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Founder Quote Card */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs italic text-amber-300">
              <Quote className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <span>
                &ldquo;{contentJson.founder_quote || 'We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.'}&rdquo;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Company Journey & History Timeline Section */}
      <section className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Milestones &amp; History
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Journey &amp; Growth Timeline
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Over a decade of hands-on real estate leadership, continuous layout delivery, and satisfied families across Tamil Nadu.
          </p>
        </div>

        <div className="relative border-l-2 border-emerald-800/60 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
          {timelineMilestones.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Connected Year Node Marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:border-emerald-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-emerald-400 transition-colors" />
              </div>

              {/* Desktop Floating Year Tag */}
              <div className="hidden sm:block absolute -left-[140px] top-1 text-right w-24">
                <span className="font-serif font-extrabold text-amber-400 text-lg block">{item.year}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.badge}</span>
              </div>

              {/* Timeline Card */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-2 hover:border-amber-500/40 transition-all duration-300">
                <div className="sm:hidden flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="font-serif font-extrabold text-amber-400 text-base">{item.year}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">{item.badge}</span>
                </div>
                <h3 className="font-serif font-bold text-white text-lg sm:text-xl">{item.title}</h3>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{item.subtitle}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why We’re the Right Choice Section — Left & Right Visual Split */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">Core Advantages</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1">
            {contentJson.why_choice_heading || 'Why We’re the Right Choice'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Visual Highlight Card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-2xl flex flex-col justify-between space-y-6 group hover:border-amber-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white leading-snug">
                Your Preferred Real Estate Developer
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We combine DTCP regulatory compliance, transparent sub-registrar documentation, and strategic layout locations to protect your capital and build genuine long-term value.
              </p>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Verified Legal Documents</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees or Charges</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guided Private Site Visit Transport</span>
              </div>
            </div>
          </div>

          {/* Right Visual 2-Column Feature Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyItems.map((item, idx) => {
              const iconList = [
                <MapPin className="w-5 h-5 text-amber-400" key="1" />,
                <ShieldCheck className="w-5 h-5 text-emerald-400" key="2" />,
                <Landmark className="w-5 h-5 text-blue-400" key="3" />,
                <FileCheck className="w-5 h-5 text-amber-400" key="4" />,
                <TrendingUp className="w-5 h-5 text-emerald-400" key="5" />,
                <Users className="w-5 h-5 text-blue-400" key="6" />,
              ];

              return (
                <div
                  key={idx}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        {iconList[idx % iconList.length]}
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500">0{idx + 1}</span>
                    </div>

                    <h3 className="font-serif font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section (Only rendered if published/visible) */}
      {isStatsVisible && (
        <section className="max-w-7xl mx-auto py-10 bg-slate-900/60 border-y border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {statsList.map((stat, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="font-serif font-extrabold text-3xl text-amber-400 block">{stat.value}</span>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <SiteVisitCTASection
        heading={contentJson.cta_heading || 'Let Us Help You Find the Right Property'}
        description={
          contentJson.cta_description ||
          'Talk to our team or schedule a visit to one of our projects in Namakkal or Paramathi Velur.'
        }
      />
    </div>
  );
}
