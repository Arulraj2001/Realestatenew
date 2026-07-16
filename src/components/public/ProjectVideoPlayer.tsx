'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, Sparkles, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface ProjectVideoPlayerProps {
  title?: string;
  videoUrl?: string | null;
  storagePathUrl?: string | null;
  embedType?: string | null;
  posterImage?: string | null;
}

export const ProjectVideoPlayer: React.FC<ProjectVideoPlayerProps> = ({
  title = 'Project Walkthrough Video',
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
    <div className="space-y-4">
      {/* Video Poster Player Frame */}
      <div
        onClick={() => setIsPlayingModalOpen(true)}
        className="group relative aspect-[16/9] max-h-[500px] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl cursor-pointer"
      >
        <Image
          src={poster}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

        {/* Top Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3.5 py-1 bg-amber-500/90 text-slate-950 text-xs font-extrabold rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Video Tour
          </span>
        </div>

        {/* Central Glowing Play Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-slate-950" />
          </div>
          <span className="text-white font-extrabold text-sm sm:text-base drop-shadow-lg tracking-wide group-hover:text-amber-300 transition-colors">
            Click to Play Video
          </span>
        </div>

        {/* Bottom Title Bar */}
        <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-white text-lg sm:text-xl drop-shadow-md truncate max-w-lg">
            {title}
          </h3>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline-block bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
            Full HD Walkthrough
          </span>
        </div>
      </div>

      {/* External Social Platform Action Buttons */}
      {rawUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>External Source Available:</span>
            {isYouTube && (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <Video className="w-4 h-4 text-red-500" /> YouTube Video
              </span>
            )}
            {isInstagram && (
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <Video className="w-4 h-4 text-pink-500" /> Instagram Reel
              </span>
            )}
          </div>

          <a href={rawUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="font-bold border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
            >
              {isYouTube ? (
                <>
                  <Video className="w-4 h-4 text-red-500 mr-1.5" /> Watch on YouTube
                </>
              ) : isInstagram ? (
                <>
                  <Video className="w-4 h-4 text-pink-500 mr-1.5" /> Watch on Instagram
                </>
              ) : (
                <>
                  Watch Original Source
                </>
              )}
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-80" />
            </Button>
          </a>
        </div>
      )}

      {/* Inline Video Player Dialog Modal */}
      <Dialog
        isOpen={isPlayingModalOpen}
        onClose={() => setIsPlayingModalOpen(false)}
        title={title}
      >
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
          {embedUrl ? (
            isYouTube || isInstagram || embedUrl.includes('embed') ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls autoPlay className="w-full h-full object-contain">
                <source src={embedUrl} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
              <p className="text-slate-300 text-sm">No video URL has been attached yet.</p>
              <Button size="sm" variant="gold" onClick={() => setIsPlayingModalOpen(false)}>
                <X className="w-4 h-4 mr-1" /> Close Player
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
