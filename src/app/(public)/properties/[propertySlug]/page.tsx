import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Building2,
  ChevronRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  getConfigurationBySlug,
  getPublishedConfigurations,
  getProjectAmenities,
} from '@/lib/data';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/ui/badge';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export interface PropertyDetailPageProps {
  params: Promise<{
    propertySlug: string;
  }>;
}

export async function generateStaticParams() {
  const configs = await getPublishedConfigurations();
  return configs.map((c) => ({
    propertySlug: c.slug,
  }));
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { propertySlug } = await params;
  const config = await getConfigurationBySlug(propertySlug);

  if (!config) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: `${config.name} | ${config.project?.name || 'Gated Layout'}`,
    description:
      config.short_description ||
      `Explore specs for ${config.name} at ${config.project?.name} in ${config.project?.location?.name || 'Namakkal'}.`,
    alternates: {
      canonical: `${siteConfig.domain}/properties/${config.slug}`,
    },
    openGraph: {
      title: `${config.name} | ${siteConfig.name}`,
      description: config.short_description || undefined,
      url: `${siteConfig.domain}/properties/${config.slug}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { propertySlug } = await params;
  const config = await getConfigurationBySlug(propertySlug);

  if (!config) {
    notFound();
  }

  const amenities = config.project_id ? await getProjectAmenities(config.project_id) : [];

  const fallbackImage =
    config.hero_image_path ||
    config.project?.hero_image_path ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const featureList = Array.isArray(config.feature_list)
    ? (config.feature_list as string[])
    : [];

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
        name: 'Properties',
        item: `${siteConfig.domain}/properties`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.name,
        item: `${siteConfig.domain}/properties/${config.slug}`,
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
        {/* Header Hero */}
        <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image src={fallbackImage} alt={config.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/85" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/properties" className="hover:text-amber-400 transition-colors">
                Properties
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">{config.name}</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="gold">{config.property_type}</Badge>
              <Badge variant="emerald">{config.availability_status}</Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {config.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <Link
                href={`/projects/${config.project?.slug}`}
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                <Building2 className="w-4 h-4" /> Project: {config.project?.name}
              </Link>
              <Link
                href={`/locations/${config.project?.location?.slug}`}
                className="flex items-center gap-1 text-slate-300 hover:text-amber-400"
              >
                <MapPin className="w-4 h-4 text-amber-400" /> Location: {config.project?.location?.name}
              </Link>
            </div>
          </div>
        </section>

        {/* Specifications & Price Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Specs Column */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Compass className="w-6 h-6 text-amber-400" />
                  Key Specifications
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Property Type</span>
                    <span className="font-bold text-slate-100 text-sm">{config.property_type}</span>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Plot Dimensions</span>
                    <span className="font-bold text-slate-100 text-sm">{config.plot_area || 'Standard'}</span>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Total Area</span>
                    <span className="font-bold text-amber-400 text-sm">{config.built_up_area || config.plot_area || 'Standard'}</span>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Bedrooms / BHK</span>
                    <span className="font-bold text-slate-100 text-sm">{config.bhk > 0 ? `${config.bhk} BHK` : 'N/A Plot'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-white">Full Configuration Description</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {config.full_description || config.short_description ||
                    'Vasthu compliant planning with instant construction feasibility, road access, and utility connections.'}
                </p>
              </div>

              {/* Features List */}
              {featureList.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-xl font-bold text-white">Included Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {featureList.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Inquiry Sidebar */}
            <div className="lg:col-span-4">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 sticky top-24 shadow-2xl">
                <div className="space-y-1 border-b border-slate-800 pb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Pricing Mode: {config.price_display_mode}</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-serif">
                    {config.starting_price ? `₹${(config.starting_price / 100000).toFixed(2)} Lakhs*` : 'Price On Request'}
                  </div>
                  <span className="text-[11px] text-slate-500 block">*Excluding legal registration & stamp duty charges</span>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in inquiring about ${config.name} at ${config.project?.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-1 fill-current" /> Direct WhatsApp Inquiry
                  </a>

                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="block w-full text-center py-3 bg-slate-950 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-semibold"
                  >
                    <PhoneCall className="w-4 h-4 inline mr-1 text-emerald-400" /> Call Sales Advisor
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Inherited Project Amenities */}
          {amenities.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Amenities Inherited From {config.project?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((item) => (
                  <div key={item.amenity_id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200">{item.amenity?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <SiteVisitCTASection />
      </div>
    </>
  );
}
