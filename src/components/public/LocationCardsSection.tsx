import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Location } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export interface LocationCardsSectionProps {
  locations: Location[];
}

export const LocationCardsSection: React.FC<LocationCardsSectionProps> = ({ locations }) => {
  const fallbackImages: Record<string, string> = {
    namakkal: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80',
    'paramathi-velur': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
  };

  return (
    <section id="locations-section" className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800/80 pb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-lg shadow-amber-500/5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Prime Real Estate Hubs
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Explore Townships by Location
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
            Discover strategically chosen layout locations near educational institutes, bypass corridors, and peaceful riverfront zones across Namakkal and Paramathi Velur.
          </p>
        </div>

        {/* Dynamic Animated Hub Cards Grid */}
        {locations.length === 0 ? (
          <EmptyState
            title="No Published Locations"
            description="Active township locations will be displayed here as they are published."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => {
              const imageSrc =
                loc.hero_image_path ||
                fallbackImages[loc.slug] ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';

              return (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.slug}`}
                  className="group relative rounded-3xl overflow-hidden bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
                >
                  {/* Card Image Banner with Hover Scale Effect */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradient Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      {loc.featured ? (
                        <Badge variant="gold" className="shadow-lg backdrop-blur-md bg-amber-500/90 text-slate-950 font-bold border-amber-300">
                          <Sparkles className="w-3 h-3 mr-1" /> Key Hub
                        </Badge>
                      ) : (
                        <span />
                      )}

                      <span className="px-2.5 py-1 bg-slate-950/70 border border-slate-700/60 rounded-full text-[11px] font-mono text-amber-400 backdrop-blur-md flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Published Township
                      </span>
                    </div>

                    {/* Floating Title on Image */}
                    <div className="absolute bottom-4 left-6 right-6 z-10">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.address || 'Tamil Nadu'}</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-md">
                        {loc.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Description & CTA Footer */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {loc.short_description ||
                        `Explore premium DTCP approved house sites, gated villa plots, and commercial layout opportunities in ${loc.name}.`}
                    </p>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                      <span className="flex items-center gap-1">
                        View Projects in {loc.name}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 border border-amber-500/30 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
