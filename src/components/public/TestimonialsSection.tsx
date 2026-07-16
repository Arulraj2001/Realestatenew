'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

export interface TestimonialItem {
  id?: string;
  name: string;
  location: string;
  rating?: number;
  comment?: string;
  video_url?: string;
  thumbnail_url?: string;
}

export interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

const DEFAULT_VIDEO_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Mr. Velusami',
    location: 'Rasi Garden, Namakkal',
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    comment: 'Purchased a plot at Rasi Garden. Hassle-free registration and great infrastructure!',
  },
  {
    name: 'Mr. Dinakaran',
    location: 'Abu Dhabi, UAE (NRI Owner)',
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    comment: 'Managed everything remotely from UAE. Highly transparent team and clear titles.',
  },
  {
    name: 'Mr. Karthick',
    location: 'Kongu Nagar, Namakkal',
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    comment: 'Built a 3BHK duplex villa with custom floor plans. Delivered 15 days early!',
  },
  {
    name: 'Mrs. Jayanthi',
    location: 'Kongu Garden, Paramathi Velur',
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    comment: 'Extremely helpful staff for bank housing loan and clear documentation.',
  },
];

// Helper to extract YouTube Embed URL
function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }
  return url;
}

// Helper to extract YouTube Thumbnail URL fallback
function getThumbnailUrl(item: TestimonialItem): string {
  if (item.thumbnail_url && item.thumbnail_url.trim().length > 0) {
    return item.thumbnail_url;
  }
  if (item.video_url) {
    const match = item.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const list = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_VIDEO_TESTIMONIALS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const total = list.length;
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  const activeEmbedUrl = getEmbedUrl(activeVideoUrl || undefined);

  return (
    <section className="relative py-20 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Curved Wave Banner matching Reference Design */}
      <div className="absolute top-0 inset-x-0 h-40 bg-slate-900 pointer-events-none rounded-b-[50%] scale-x-125 opacity-70" />

      {/* Background Dotted Grid Pattern matching Reference Image */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stories That{' '}
            <span className="text-blue-500 underline decoration-blue-500/40 underline-offset-8">
              Inspire Confidence
            </span>{' '}
            !!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Watch real buyer experiences, site visits and villa construction stories from our happy customers.
          </p>
        </div>

        {/* 3-Card Video Carousel Display */}
        <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] pt-4">
          {/* Left Preview Card */}
          <div
            onClick={handlePrev}
            className="hidden sm:block absolute left-[5%] md:left-[10%] w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-blue-950/80 border border-blue-800/40 shadow-xl opacity-60 scale-90 transition-all duration-500 cursor-pointer hover:opacity-80 hover:scale-95 z-10"
          >
            <Image
              src={getThumbnailUrl(list[prevIndex])}
              alt={list[prevIndex].name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 bg-blue-900/60" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <span className="px-2 py-0.5 bg-blue-950/80 backdrop-blur-md rounded text-[11px] font-bold text-blue-200 block truncate">
                {list[prevIndex].name}
              </span>
            </div>
          </div>

          {/* Active Center Video Card */}
          <div
            onClick={() => setActiveVideoUrl(list[activeIndex].video_url || 'https://www.youtube.com/watch?v=668nUCeBHyY')}
            className="group relative w-72 sm:w-80 md:w-96 aspect-[3/4] rounded-3xl overflow-hidden bg-blue-900/40 border-2 border-blue-500/60 shadow-2xl transition-all duration-500 scale-105 z-20 cursor-pointer hover:border-amber-400 hover:shadow-blue-500/30"
          >
            <Image
              src={getThumbnailUrl(list[activeIndex])}
              alt={list[activeIndex].name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Prominent Play Button matching Reference Image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              </div>
            </div>

            {/* Customer Details Badge at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
              <div className="px-3 py-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800/80 inline-block max-w-full">
                <h4 className="font-bold text-white text-sm sm:text-base truncate">
                  {list[activeIndex].name}
                </h4>
                <p className="text-[11px] text-amber-400 truncate">
                  {list[activeIndex].location}
                </p>
              </div>
              {list[activeIndex].comment && (
                <p className="text-[11px] text-slate-300 italic line-clamp-2 px-1">
                  &ldquo;{list[activeIndex].comment}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Right Preview Card */}
          <div
            onClick={handleNext}
            className="hidden sm:block absolute right-[5%] md:right-[10%] w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-blue-950/80 border border-blue-800/40 shadow-xl opacity-60 scale-90 transition-all duration-500 cursor-pointer hover:opacity-80 hover:scale-95 z-10"
          >
            <Image
              src={getThumbnailUrl(list[nextIndex])}
              alt={list[nextIndex].name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 bg-blue-900/60" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <span className="px-2 py-0.5 bg-blue-950/80 backdrop-blur-md rounded text-[11px] font-bold text-blue-200 block truncate">
                {list[nextIndex].name}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows matching Reference Screenshot */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={handlePrev}
            aria-label="Previous video story"
            className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            {activeIndex + 1} / {total}
          </span>

          <button
            onClick={handleNext}
            aria-label="Next video story"
            className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Modal Popup */}
      <Dialog
        isOpen={Boolean(activeVideoUrl)}
        onClose={() => setActiveVideoUrl(null)}
        className="max-w-4xl bg-slate-950 p-0 overflow-hidden border-slate-800"
      >
        <div className="relative aspect-video w-full bg-black">
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-3 right-3 z-30 p-2 bg-slate-900/90 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {activeEmbedUrl && (
            <iframe
              src={activeEmbedUrl}
              title="Customer Video Story"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Dialog>
    </section>
  );
};
