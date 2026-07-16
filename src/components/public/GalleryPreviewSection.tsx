import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, ArrowRight } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import { Button } from '@/components/ui/button';

export interface GalleryPreviewSectionProps {
  galleryItems: GalleryItem[];
  heading?: string;
  description?: string;
  ctaLabel?: string;
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({
  galleryItems,
  heading = 'See Our Projects',
  description = 'View real site photos, villa designs, roads, layouts and construction updates from our projects.',
  ctaLabel = 'View Gallery',
}) => {
  const displayItems = galleryItems.slice(0, 6);

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" /> Project Photography
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {heading}
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            {description}
          </p>
        </div>

        {/* 6 Grid Gallery Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl"
            >
              <Image
                src={item.storage_path_or_url}
                alt={item.alt_text || item.title || 'Project layout site view'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="image-overlay-content absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">{item.category || 'Site Update'}</span>
                <h3 className="font-serif text-base font-bold text-white mt-1">{item.title || 'Township Development'}</h3>
                {item.caption && <p className="text-xs text-slate-300 line-clamp-1">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* View Gallery Link */}
        <div className="mt-12 text-center">
          <Link href="/gallery">
            <Button variant="gold" size="lg" className="font-bold px-8">
              {ctaLabel} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
