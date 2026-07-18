import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Location } from '@/types/database';

export interface LocationCardsSectionProps {
  locations: Location[];
}

export const LocationCardsSection: React.FC<LocationCardsSectionProps> = ({ locations }) => {
  const fallbackImages: Record<string, string> = {
    namakkal: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80',
    'paramathi-velur': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
  };

  const defaultDescriptions: Record<string, string> = {
    namakkal: 'Explore Rasi Garden and Kongu Nagar in Namakkal.',
    'paramathi-velur': 'Explore plots and 2BHK, 3BHK and 4BHK villas at Kongu Garden.',
  };

  // Filter only featured, published locations
  const featuredLocations = locations.filter((loc) => loc.published && loc.featured);

  if (featuredLocations.length === 0) return null;

  return (
    <section className="relative z-20 max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 mb-6 pb-2">
      {/* Location Cards — always single row, auto-fill up to 3 columns */}
      <div className={`grid gap-3 sm:gap-6 ${
        featuredLocations.length === 1
          ? 'grid-cols-1 max-w-sm mx-auto'
          : featuredLocations.length === 2
          ? 'grid-cols-2'
          : 'grid-cols-3'
      }`}>
        {featuredLocations.map((loc) => {
          const imageSrc =
            loc.hero_image_path ||
            fallbackImages[loc.slug] ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';

          const cardDescription =
            defaultDescriptions[loc.slug] ||
            loc.short_description ||
            `Explore residential plots and villas in ${loc.name}.`;

          return (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-amber-500/20 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={loc.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                  <span className="px-2 py-0.5 sm:px-3.5 sm:py-1 bg-amber-500 text-slate-950 text-[9px] sm:text-xs lg:text-sm font-extrabold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5 border border-amber-300">
                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> {loc.name} Projects
                  </span>
                </div>

                <div className="image-overlay-content absolute bottom-3 left-3 sm:left-4 right-3 sm:right-4 z-10 pointer-events-none">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-bold mb-0.5 sm:mb-1 text-white group-hover:text-amber-300 transition-colors">
                    <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0" />
                    <span>{loc.name} Township Hub</span>
                  </div>
                  <h3
                    className="font-serif text-base sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-lg tracking-tight"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}
                  >
                    {loc.name}
                  </h3>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-200 leading-normal sm:leading-relaxed font-semibold">
                  {cardDescription}
                </p>

                <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="flex items-center gap-1 sm:gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500">
                    <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 dark:text-amber-400" /> View Projects
                  </span>
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-amber-500/10 group-hover:bg-amber-500 text-amber-500 group-hover:text-slate-950 border border-amber-500/30 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
