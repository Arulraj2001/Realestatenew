'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import { Dialog } from '@/components/ui/dialog';

export interface PropertyMediaGalleryProps {
  propertyName: string;
  fallbackImage: string;
  galleryItems: GalleryItem[];
}

export const PropertyMediaGallery: React.FC<PropertyMediaGalleryProps> = ({
  propertyName,
  fallbackImage,
  galleryItems,
}) => {
  const images =
    galleryItems.length > 0
      ? galleryItems
      : [
          {
            id: 'fallback-1',
            location_id: null,
            project_id: null,
            property_configuration_id: null,
            media_type: 'image' as const,
            storage_path_or_url: fallbackImage,
            thumbnail_path: null,
            title: propertyName,
            caption: null,
            alt_text: propertyName,
            category: 'Exterior',
            featured: true,
            published: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentMedia = images[activeImageIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Large Featured Main Image Display */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="group relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl cursor-pointer"
      >
        <Image
          src={currentMedia.storage_path_or_url}
          alt={currentMedia.alt_text || currentMedia.title || propertyName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

        <div className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 bg-slate-950/80 border border-slate-700 rounded-full text-xs font-bold text-amber-400 backdrop-blur-md flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" /> View Photo Lightbox ({images.length})
        </div>
      </div>

      {/* Thumbnail Navigation Strip (Shown if > 1 image) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105'
                    : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.storage_path_or_url}
                  alt={img.title || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal Trigger */}
      <Dialog
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        className="max-w-4xl w-full bg-black border-slate-900 p-0 overflow-hidden hero-dark-overlay rounded-3xl"
        bodyClassName="p-0 max-h-none overflow-hidden"
      >
        {currentMedia && (
          <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black text-white overflow-hidden">
            {/* Image/Video Background (Covers entire dialog area) */}
            <div className="absolute inset-0 w-full h-full z-0">
              {currentMedia.media_type === 'video' ? (
                <video
                  src={currentMedia.storage_path_or_url}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={currentMedia.storage_path_or_url}
                  alt={currentMedia.alt_text || currentMedia.title || propertyName}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="object-cover"
                />
              )}
            </div>

            {/* Top Overlay: Category, Title & Close Button */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-10 flex justify-between items-start gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded-full mb-1 shadow-sm">
                  {currentMedia.category || 'Exterior'}
                </span>
                <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-snug drop-shadow-md">
                  {currentMedia.title || propertyName}
                </h3>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-full bg-black/60 hover:bg-black/80 border border-white/10 transition-all cursor-pointer flex-shrink-0 shadow-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 pointer-events-none" />
              </button>
            </div>

            {/* Bottom Overlay: Caption & Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 space-y-3">
              {currentMedia.caption && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium drop-shadow max-w-3xl line-clamp-2">
                  {currentMedia.caption}
                </p>
              )}

              {/* Navigation & Pagination Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:bg-black/80 hover:text-white transition-all cursor-pointer font-bold shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="font-mono font-bold text-white drop-shadow">
                  {activeImageIndex + 1} <span className="text-slate-400">/</span> {images.length}
                </span>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:bg-black/80 hover:text-white transition-all cursor-pointer font-bold shadow-md"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
