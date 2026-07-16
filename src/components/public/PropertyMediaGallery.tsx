'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';

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
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <div className="flex justify-end pb-2">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Close Gallery ✕
              </button>
            </div>
            <GalleryLightbox items={images} />
          </div>
        </div>
      )}
    </div>
  );
};
