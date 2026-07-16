import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import {
  Info,
  Award,
  Quote,
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

export default async function AboutUsPage() {
  const contentRecord = await getContentPage('about');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentJson = (contentRecord?.content as Record<string, any>) || {};

  const defaultWhyItems: WhyChoiceItem[] = [
    {
      title: 'Prime Location',
      description: 'Projects in growing areas with useful road access and future development potential.',
    },
    {
      title: 'DTCP Approved',
      description: 'Residential plots and projects presented with the required approvals and available documents.',
    },
    {
      title: 'Loan Assistance',
      description: 'Guidance for eligible buyers who want to understand available home-loan options.',
    },
    {
      title: 'Clear Documentation',
      description: 'We explain the available property documents and registration process clearly.',
    },
    {
      title: 'Growth Potential',
      description: 'Projects selected for residential use and long-term property value.',
    },
    {
      title: 'Trusted Support',
      description: 'Personal support from site visit through booking and registration.',
    },
  ];

  const defaultStats: StatItem[] = [
    { label: 'Years of Experience', value: '13+' },
    { label: 'Successful Projects', value: '5' },
    { label: 'Happy Customers', value: '135+' },
    { label: 'Plots Sold', value: '120+' },
    { label: 'Villas Sold', value: '15+' },
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
      {/* Header Section with Single H1 */}
      <div className="max-w-7xl mx-auto border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Info className="w-3.5 h-3.5" /> Company Profile
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          {contentJson.about_h1 || 'Your Trusted Real Estate Partner in Namakkal and Paramathi Velur'}
        </h1>
        <div className="text-slate-300 text-sm sm:text-base max-w-3xl mt-4 leading-relaxed space-y-3">
          <p>
            Your Choice Properties was started with a simple promise: honest property guidance for families in Namakkal and Paramathi Velur.
          </p>
          <p>
            We understand that buying a plot or home is an important life decision. That is why our projects—Rasi Garden, Kongu Nagar and Kongu Garden—are developed with a focus on clear communication, useful locations, planned layouts and genuine value.
          </p>
          <p>
            Our team helps customers understand the property, arrange site visits and complete the buying process with proper support.
          </p>
        </div>
      </div>

      {/* Why We Are the Right Choice Section */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">Core Values</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            {contentJson.why_choice_heading || 'Why We Are the Right Choice'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyItems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="font-serif font-bold text-white text-lg">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
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
