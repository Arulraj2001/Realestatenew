import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Building2, ChevronRight } from 'lucide-react';
import { getPublishedLocations } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
  title: 'Property Locations in Tamil Nadu',
  description:
    'Explore prime residential plots, gated layout townships, and custom luxury villas in Namakkal, Paramathi Velur, Salem, and Erode.',
  alternates: {
    canonical: `${siteConfig.domain}/locations`,
  },
};

export default async function LocationsListingPage() {
  const locations = await getPublishedLocations();

  const fallbackImages: Record<string, string> = {
    namakkal: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    'paramathi-velur': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  };

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header & Breadcrumbs */}
          <div className="space-y-4 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Locations</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Prime Property Hubs
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Select a location to discover ongoing DTCP layouts, gated villa communities, and investment land.
            </p>
          </div>

          {/* Grid */}
          {locations.length === 0 ? (
            <EmptyState
              title="No Locations Published"
              description="New township hubs will be listed here as soon as they are launched."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((loc) => {
                const imageSrc =
                  loc.hero_image_path ||
                  fallbackImages[loc.slug] ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={loc.id}
                    className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={loc.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge variant="gold" className="shadow-lg">
                            <Building2 className="w-3 h-3 mr-1" />
                            {loc.projectCount} {loc.projectCount === 1 ? 'Project' : 'Projects'}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{loc.address || 'Tamil Nadu'}</span>
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                          {loc.name}
                        </h2>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {loc.short_description ||
                            loc.full_description ||
                            'High-appreciation residential gated layouts and turnkey villa developments.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        href={`/locations/${loc.slug}`}
                        className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors"
                      >
                        <span>Explore {loc.name} Layouts</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
