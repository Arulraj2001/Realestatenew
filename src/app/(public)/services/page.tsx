import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Home, Car, FileCheck, Landmark, Layers, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export const metadata: Metadata = {
  title: 'Real Estate & Property Development Services',
  description:
    'Explore plot sales, custom villa construction, legal title verification, free site visits, and bank housing loan assistance.',
  alternates: {
    canonical: `${siteConfig.domain}/services`,
  },
};

export default async function ServicesPage() {
  const services = [
    {
      title: 'Residential Plot & Land Sales',
      description:
        'DTCP approved gated layout plots with 30ft/40ft blacktop roads, underground water lines, electricity, and 100% legal title clearance.',
      icon: <Compass className="w-8 h-8 text-amber-400" />,
    },
    {
      title: 'Custom Villa Construction & Sales',
      description:
        'Architectural design and turnkey villa construction (2BHK, 3BHK, 4BHK) tailored to family vastu preferences and budget.',
      icon: <Home className="w-8 h-8 text-emerald-400" />,
    },
    {
      title: 'Complimentary Site Visit Pick & Drop',
      description:
        'Free chauffeured private car transport facility for buyers and families to visit layouts in Namakkal and Paramathi Velur.',
      icon: <Car className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Legal Title Verification & Registration',
      description:
        'Complete end-to-end guidance from title search verification to sub-registrar deed registration and encumbrance certificate (EC) issuance.',
      icon: <FileCheck className="w-8 h-8 text-blue-400" />,
    },
    {
      title: 'Housing Loan Assistance',
      description:
        'Hassle-free housing loan processing with leading nationalized banks (SBI, HDFC, Canara Bank) with minimal documentation.',
      icon: <Landmark className="w-8 h-8 text-amber-400" />,
    },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${siteConfig.domain}/services`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Banner Header */}
        <section className="py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Services</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" /> Full Spectrum Solutions
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Real-Estate Services
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              From layout planning and plot purchasing to custom villa construction and legal deed registration.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit">
                    {service.icon}
                  </div>
                  <h2 className="font-serif text-xl font-bold text-white">{service.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SiteVisitCTASection />
      </div>
    </>
  );
}
