import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ShieldCheck, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { getContentPage } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { StatsSection } from '@/components/public/StatsSection';
import { WhyChooseUsSection } from '@/components/public/WhyChooseUsSection';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export const metadata: Metadata = {
  title: 'About Us | Premier Real Estate Developer in Tamil Nadu',
  description:
    'Learn about Your Choice Properties, our founder, legal title commitment, and history of delivering DTCP approved layouts.',
  alternates: {
    canonical: `${siteConfig.domain}/about-us`,
  },
};

export default async function AboutUsPage() {
  const pageContent = await getContentPage('about');
  const contentJson = (pageContent?.content as Record<string, string>) || {};

  const heading = pageContent?.title || contentJson.heading || 'Building Trust across Tamil Nadu';
  const body =
    contentJson.body ||
    `${siteConfig.name} is dedicated to providing homebuyers and investors with 100% legal title-cleared residential plots, gated layout townships, and turnkey custom villas.`;

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
        name: 'About Us',
        item: `${siteConfig.domain}/about-us`,
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
        {/* Hero Banner */}
        <section className="relative py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">About Us</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Pioneer Property Developer
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
              {heading}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {body}
            </p>
          </div>
        </section>

        {/* Company History & Founder Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                alt="Your Choice Properties Management"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" /> Leadership & Vision
              </div>

              <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
                Our Foundational Promise
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Founded with a vision to redefine real-estate transparency in Namakkal and Paramathi Velur, {siteConfig.name} focuses exclusively on DTCP approved layouts with verified documentation and end-to-end customer support.
              </p>

              <div className="space-y-3 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Transparent legal title search before layout launch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>On-time layout infrastructure completion guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Long-term post-purchase layout maintenance support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatsSection />
        <WhyChooseUsSection />
        <SiteVisitCTASection />
      </div>
    </>
  );
}
