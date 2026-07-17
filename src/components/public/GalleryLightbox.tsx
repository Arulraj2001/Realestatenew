'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import { Dialog } from '@/components/ui/dialog';

import { YoutubeIcon, InstagramIcon } from '@/components/ui/icons';

export interface GalleryLightboxProps {
  items: GalleryItem[];
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
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
        {items.map((item, idx) => {
          const isYouTube = item.media_type === 'youtube' || item.embed_type === 'youtube' || (item.video_url && item.video_url.includes('youtube'));
          const isInstagram = item.media_type === 'instagram' || item.embed_type === 'instagram' || (item.video_url && item.video_url.includes('instagram'));
          const isVideo = item.media_type === 'video' || item.embed_type === 'supabase';

          const imageSrc = item.thumbnail_path || (isYouTube || isInstagram ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' : item.storage_path_or_url);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl cursor-pointer hover:border-amber-500/50 transition-all duration-300"
            >
              <Image
                src={imageSrc}
                alt={item.alt_text || item.title || 'Gallery item'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Video Badge Overlay */}
              {isYouTube && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-600/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                  <YoutubeIcon className="w-3.5 h-3.5" /> YouTube Video
                </div>
              )}
              {isInstagram && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-pink-600/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                  <InstagramIcon className="w-3.5 h-3.5" /> Instagram Reel
                </div>
              )}
              {isVideo && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-600/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                  Video
                </div>
              )}

              <div className="image-overlay-content absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded mb-1">
                  {item.category || 'Overview'}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug truncate">
                  {item.title || 'Township Showcase'}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        className="max-w-4xl w-full bg-black border-slate-900 p-0 overflow-hidden hero-dark-overlay rounded-3xl"
        bodyClassName="p-0 max-h-none overflow-hidden"
      >
        {activeItem && (() => {
          const isYouTube = activeItem.media_type === 'youtube' || activeItem.embed_type === 'youtube' || (activeItem.video_url && activeItem.video_url.includes('youtube'));
          const isInstagram = activeItem.media_type === 'instagram' || activeItem.embed_type === 'instagram' || (activeItem.video_url && activeItem.video_url.includes('instagram'));
          const youtubeEmbed = isYouTube ? getYouTubeEmbedUrl(activeItem.video_url || activeItem.storage_path_or_url) : null;

          return (
            <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black text-white overflow-hidden flex flex-col justify-between">
              {/* Media Container */}
              <div className="absolute inset-0 w-full h-full z-0">
                {isYouTube && youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title={activeItem.title || 'YouTube video'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isInstagram ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950/40 p-6 text-center space-y-4">
                    <InstagramIcon className="w-16 h-16 text-pink-500 animate-pulse" />
                    <h3 className="text-lg font-bold text-white max-w-md">{activeItem.title || 'Instagram Influencer Reel'}</h3>
                    <p className="text-xs text-slate-300 max-w-sm">Watch real project walkthroughs and influencer reviews on Instagram.</p>
                    <a
                      href={activeItem.video_url || activeItem.storage_path_or_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                      <InstagramIcon className="w-4 h-4" /> Watch Reel on Instagram <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                ) : activeItem.media_type === 'video' ? (
                  <video
                    src={activeItem.storage_path_or_url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeItem.storage_path_or_url}
                    alt={activeItem.alt_text || 'Media preview'}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    priority
                    className="object-cover"
                  />
                )}
              </div>

              {/* Top Overlay: Category, Title & Close Button */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-10 flex justify-between items-start gap-4 pointer-events-none">
                <div className="pointer-events-auto">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold rounded-full mb-1 shadow-sm">
                    {activeItem.category || 'Township Photo'}
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-snug drop-shadow-md">
                    {activeItem.title || 'Township Showcase'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="pointer-events-auto p-2 text-slate-300 hover:text-white rounded-full bg-black/60 hover:bg-black/80 border border-white/10 transition-all cursor-pointer flex-shrink-0 shadow-lg"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5 pointer-events-none" />
                </button>
              </div>

              {/* Bottom Overlay: Caption & Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 space-y-3 pointer-events-none">
                {activeItem.caption && (
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium drop-shadow max-w-3xl line-clamp-2 pointer-events-auto">
                    {activeItem.caption}
                  </p>
                )}

                {/* Navigation & Pagination Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300 pointer-events-auto">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:bg-black/80 hover:text-white transition-all cursor-pointer font-bold shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="font-mono font-bold text-white drop-shadow">
                    {selectedIndex! + 1} <span className="text-slate-400">/</span> {items.length}
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
          );
        })()}
      </Dialog>
    </>
  );
};
