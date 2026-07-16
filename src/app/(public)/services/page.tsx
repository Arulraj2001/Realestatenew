import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  Maximize,
  Building2,
  Car,
  FileCheck,
  Landmark,
  ArrowRight,
} from 'lucide-react';
import { getContentPage } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export const metadata: Metadata = {
  title: 'Our Services | Plots, Villas and Houses in Namakkal',
  description:
    'Explore plot sales, villa and house sales, site visits, documentation support and home-loan guidance from Your Choice Properties in Namakkal and Paramathi Velur.',
  alternates: {
    canonical: `${siteConfig.domain}/services`,
  },
};

export interface ServiceItem {
  id: string;
  title: string;
  icon?: string;
  content: string;
}

export default async function ServicesPage() {
  const contentRecord = await getContentPage('services');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentJson = (contentRecord?.content as Record<string, any>) || {};

  const defaultServices: ServiceItem[] = [
    {
      id: 'srv-1',
      title: 'Residential Plot Sales',
      icon: 'Maximize',
      content:
        'We offer DTCP-approved residential plots in Namakkal and Paramathi Velur for buyers who want to build a home or invest in land. Our team explains the location, available plot sizes, documents and current price before you decide.',
    },
    {
      id: 'srv-2',
      title: 'Villa and House Sales — 2BHK, 3BHK and 4BHK',
      icon: 'Building2',
      content:
        'We help families explore 2BHK, 3BHK and 4BHK villas and independent houses across Rasi Garden, Kongu Nagar and Kongu Garden. Available choices depend on the project and current construction status.',
    },
    {
      id: 'srv-3',
      title: 'Site Visits and Consultation',
      icon: 'Car',
      content:
        'Our local team arranges guided site visits so you can compare the location, roads, layout, villa design and nearby facilities before making a decision.',
    },
    {
      id: 'srv-4',
      title: 'Documentation and Registration Support',
      icon: 'FileCheck',
      content:
        'We guide buyers through available title documents, patta-related information, booking paperwork and registration. Buyers should independently verify all legal documents before purchase.',
    },
    {
      id: 'srv-5',
      title: 'Home-Loan Assistance',
      icon: 'Landmark',
      content:
        'We guide eligible buyers in understanding available loan and financing options. Final approval, interest rates and terms are decided by the bank or financial institution.',
    },
  ];

  const servicesList: ServiceItem[] = contentJson.services_list || defaultServices;

  const iconsMap: Record<string, React.ReactNode> = {
    Maximize: <Maximize className="w-6 h-6 text-amber-400" />,
    Building2: <Building2 className="w-6 h-6 text-emerald-400" />,
    Car: <Car className="w-6 h-6 text-blue-400" />,
    FileCheck: <FileCheck className="w-6 h-6 text-amber-500" />,
    Landmark: <Landmark className="w-6 h-6 text-emerald-500" />,
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" /> End-to-End Real Estate Support
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          {contentJson.services_h1 || 'Our Real Estate Services in Namakkal and Paramathi Velur'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-3 leading-relaxed">
          {contentJson.services_intro ||
            'Our team helps you choose the right plot or villa and supports you from your first enquiry through site visit, documentation and registration.'}
        </p>
      </div>

      {/* 5 Service Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesList.map((srv, idx) => (
          <div
            key={srv.id || idx}
            className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                {iconsMap[srv.icon || 'Maximize'] || <Maximize className="w-6 h-6 text-amber-400" />}
              </div>
              <h2 className="font-serif text-xl font-bold text-white leading-snug">{srv.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{srv.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link href="/contact-us" className="text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>Enquire About Service</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA Section */}
      <SiteVisitCTASection
        heading={contentJson.cta_heading || 'Need Help Choosing the Right Plot or Villa?'}
        description={
          contentJson.cta_description ||
          'Talk to our team and explore suitable property options in Namakkal and Paramathi Velur.'
        }
      />
    </div>
  );
}
