'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

export interface ProjectVideoPlayerProps {
  title?: string;
  videoUrl?: string | null;
  storagePathUrl?: string | null;
  embedType?: string | null;
  posterImage?: string | null;
}

export const ProjectVideoPlayer: React.FC<ProjectVideoPlayerProps> = ({
  title = 'Walkthrough',
  videoUrl,
  storagePathUrl,
  posterImage,
}) => {
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);

  const rawUrl = videoUrl || storagePathUrl || '';
  const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');
  const isInstagram = rawUrl.includes('instagram.com');

  // Format YouTube embed iframe URL
  let embedUrl = rawUrl;
  if (isYouTube) {
    let videoId = '';
    if (rawUrl.includes('watch?v=')) {
      videoId = rawUrl.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (rawUrl.includes('youtu.be/')) {
      videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (rawUrl.includes('embed/')) {
      videoId = rawUrl.split('embed/')[1]?.split('?')[0] || '';
    }
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  } else if (isInstagram && !rawUrl.includes('/embed')) {
    embedUrl = `${rawUrl.replace(/\/$/, '')}/embed`;
  }

  const poster =
    posterImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="py-2 space-y-4">
      {/* Compact Video Card Frame Centered */}
      <div className="max-w-md mx-auto space-y-3">
        <div
          onClick={() => setIsPlayingModalOpen(true)}
          className="group relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl cursor-pointer"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 z-0"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />

          {/* Central Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950/90 border border-amber-400 text-amber-400 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Video Subtitle Label below card */}
        <div className="text-center">
          <h4 className="font-sans font-bold text-slate-900 dark:text-white text-base tracking-wide">
            {title}
          </h4>
        </div>
      </div>

      {/* Video Modal Frame */}
      <Dialog
        isOpen={isPlayingModalOpen}
        onClose={() => setIsPlayingModalOpen(false)}
        title={title}
      >
        <div className="space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                No video URL configured.
              </div>
            )}
          </div>

          {rawUrl && (
            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                Open directly in YouTube / App <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
