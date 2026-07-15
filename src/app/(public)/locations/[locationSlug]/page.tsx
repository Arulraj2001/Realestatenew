import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, ChevronRight, Compass, ShieldCheck } from 'lucide-react';
import { getLocationBySlug, getPublishedProjects, getPublishedConfigurations, getPublishedLocations } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/ui/badge';
import { FeaturedProjectsSection } from '@/components/public/FeaturedProjectsSection';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export interface LocationDetailPageProps {
  params: Promise<{
    locationSlug: string;
  }>;
}

export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  return locations.map((loc) => ({
    locationSlug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);

  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  return {
    title: `${location.name} Real Estate & Villa Plots`,
    description: location.short_description || `Explore DTCP approved plots and villas in ${location.name}.`,
    alternates: {
      canonical: `${siteConfig.domain}/locations/${location.slug}`,
    },
    openGraph: {
      title: `${location.name} Properties | ${siteConfig.name}`,
      description: location.short_description || undefined,
      url: `${siteConfig.domain}/locations/${location.slug}`,
    },
  };
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { locationSlug } = await params;
  const location = await getLocationBySlug(locationSlug);

  if (!location) {
    notFound();
  }

  // Fetch projects and configurations belonging to this location
  const [projects, configurations] = await Promise.all([
    getPublishedProjects({ locationId: location.id }),
    getPublishedConfigurations({ locationId: location.id }),
  ]);

  const fallbackImage =
    location.hero_image_path ||
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80';

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
        name: 'Locations',
        item: `${siteConfig.domain}/locations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: location.name,
        item: `${siteConfig.domain}/locations/${location.slug}`,
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
        {/* Location Hero Header */}
        <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image src={fallbackImage} alt={location.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/locations" className="hover:text-amber-400 transition-colors">
                Locations
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">{location.name}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> {location.address || 'Tamil Nadu'}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Properties & Townships in {location.name}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {location.full_description || location.short_description ||
                `${location.name} offers rapid infrastructure growth, high resale appreciation, and strategic access to schools, hospitals, and national highways.`}
            </p>
          </div>
        </section>

        {/* Location Projects Section */}
        <FeaturedProjectsSection projects={projects} />

        {/* Configurations Breakdown */}
        {configurations.length > 0 && (
          <section className="py-16 bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  Available Property Configurations in {location.name}
                </h2>
                <Badge variant="gold">{configurations.length} Options</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {configurations.map((config) => (
                  <div key={config.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                      <span>{config.property_type}</span>
                      <Badge variant="emerald">{config.availability_status}</Badge>
                    </div>
                    <h3 className="font-serif font-bold text-white text-lg">{config.name}</h3>
                    <p className="text-xs text-slate-400">{config.short_description || 'DTCP approved setup with road clearance.'}</p>
                    <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Area: {config.plot_area || config.built_up_area || 'Standard Plot'}</span>
                      <Link href={`/properties/${config.slug}`} className="text-amber-400 hover:underline">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Map Embed Section if Map URL exists */}
        {location.map_url && (
          <section className="py-16 bg-slate-900/60 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Location & Map Accessibility
              </h2>
              <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <iframe
                  src={location.map_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        )}

        <SiteVisitCTASection />
      </div>
    </>
  );
}
