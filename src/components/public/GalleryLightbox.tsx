'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import { Dialog } from '@/components/ui/dialog';

export interface GalleryLightboxProps {
  items: GalleryItem[];
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : items.length - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex < items.length - 1 ? selectedIndex + 1 : 0);
  };

  return (
    <>
      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl cursor-pointer hover:border-amber-500/50 transition-all duration-300"
          >
            <Image
              src={item.storage_path_or_url}
              alt={item.alt_text || item.title || 'Gallery item'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded mb-1">
                {item.category || 'Overview'}
              </span>
              <h3 className="text-sm font-bold text-white leading-snug truncate">
                {item.title || 'Township Showcase'}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        title={activeItem?.title || 'Media Lightbox'}
      >
        {activeItem && (
          <div className="relative space-y-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              {activeItem.media_type === 'video' ? (
                <video
                  src={activeItem.storage_path_or_url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={activeItem.storage_path_or_url}
                  alt={activeItem.alt_text || 'Media preview'}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}
            </div>

            {activeItem.caption && (
              <p className="text-xs text-slate-300 leading-relaxed">{activeItem.caption}</p>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span>
                {selectedIndex! + 1} of {items.length}
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};
