import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import { GalleryItem } from '@/types/database';

export interface GalleryPreviewSectionProps {
  galleryItems: GalleryItem[];
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ galleryItems }) => {
  const fallbackImages = [
    { title: 'DTCP Gated Layout Entrance Arch', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', cat: 'Township' },
    { title: 'Wide 40ft Asphalt TAR Avenue', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80', cat: 'Roads' },
    { title: 'Contemporary 3BHK Villa Elevation', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', cat: 'Villas' },
    { title: 'Landscaped Children Park Zone', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', cat: 'Parks' },
  ];

  const displayItems = galleryItems.length > 0 ? galleryItems.slice(0, 4) : fallbackImages;

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" /> Visual Showcase
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              On-Site Photography & Media
            </h2>
          </div>
          <Link
            href="/gallery"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, index) => {
            const url = 'storage_path_or_url' in item ? item.storage_path_or_url : item.url;
            const title = item.title || 'Property Showcase';

            return (
              <div
                key={index}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl"
              >
                <Image
                  src={url}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="inline-block px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded mb-1">
                    {'category' in item ? item.category : ('cat' in item ? item.cat : 'Media')}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug truncate">{title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
