'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ArrowLeft, ArrowRight, X, Star, Quote, ShieldCheck, MapPin } from 'lucide-react';
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
    rating: 5,
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    comment: 'Purchased a DTCP-approved plot at Rasi Garden. Hassle-free legal registration and great asphalt road infrastructure!',
  },
  {
    name: 'Mr. Dinakaran',
    location: 'Abu Dhabi, UAE (NRI Owner)',
    rating: 5,
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    comment: 'Managed everything remotely from UAE. Highly transparent team, verified clear titles, and timely registration.',
  },
  {
    name: 'Mr. Karthick',
    location: 'Kongu Nagar, Namakkal',
    rating: 5,
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    comment: 'Built a 3BHK duplex villa with custom floor plans. Delivered 15 days ahead of schedule with premium fittings!',
  },
  {
    name: 'Mrs. Jayanthi',
    location: 'Kongu Garden, Paramathi Velur',
    rating: 5,
    video_url: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    comment: 'Extremely helpful staff for bank housing loan approval and complete sub-registrar documentation support.',
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

  const activeItem = list[activeIndex];
  const activeEmbedUrl = getEmbedUrl(activeVideoUrl || undefined);

  return (
    <section className="relative py-12 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient Gradient Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer Reviews
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Stories That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 underline decoration-amber-500/30 underline-offset-8">
              Inspire Confidence
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real experiences from plot buyers and villa owners across Namakkal and Paramathi Velur.
          </p>
        </div>

        {/* 3-Card Video Carousel Display */}
        <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[360px] pt-2">
          {/* Left / Previous Video Thumbnail Card */}
          <div
            onClick={handlePrev}
            className="hidden lg:flex flex-col justify-between absolute left-0 w-48 sm:w-52 aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl opacity-60 scale-90 transition-all duration-500 cursor-pointer hover:opacity-90 hover:scale-95 hover:border-amber-500/40 z-10 group"
          >
            <Image
              src={getThumbnailUrl(list[prevIndex])}
              alt={list[prevIndex].name}
              fill
              sizes="240px"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 p-2.5 flex justify-between items-center">
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md rounded text-[9px] uppercase font-bold text-amber-400 border border-amber-500/30">
                ◄ Prev
              </span>
              {list[prevIndex].video_url && (
                <div className="w-6 h-6 rounded-full bg-amber-500/80 text-slate-950 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              )}
            </div>

            <div className="relative z-10 p-3 space-y-0.5">
              <h4 className="font-serif font-bold text-white text-xs truncate">
                {list[prevIndex].name}
              </h4>
              <p className="text-[10px] text-slate-300 truncate">
                {list[prevIndex].location}
              </p>
            </div>
          </div>

          {/* Active Featured Video Testimonial Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-20 hover:border-amber-500/50 transition-all duration-300">
            {/* Top Video Preview Header Banner */}
            <div
              onClick={() => setActiveVideoUrl(activeItem.video_url || 'https://www.youtube.com/watch?v=668nUCeBHyY')}
              className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer group"
            >
              <Image
                src={getThumbnailUrl(activeItem)}
                alt={activeItem.name}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 480px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/20 to-transparent" />

              {/* Glowing Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-400">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                </div>
              </div>

              {/* Verified Badge Header Chip */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Customer
                </span>
              </div>
            </div>

            {/* Bottom Card Content */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                    {activeItem.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeItem.location}</span>
                  </div>
                </div>

                {/* 5-Star Rating */}
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote Snippet */}
              <div className="relative bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
                <Quote className="w-5 h-5 text-amber-500/20 absolute top-1.5 left-1.5 pointer-events-none" />
                <p className="text-xs text-slate-200 italic leading-relaxed pl-3 line-clamp-2">
                  &ldquo;{activeItem.comment || 'Purchased a plot layout with complete clear legal titles and hassle-free registration.'}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right / Next Video Thumbnail Card */}
          <div
            onClick={handleNext}
            className="hidden lg:flex flex-col justify-between absolute right-0 w-48 sm:w-52 aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl opacity-60 scale-90 transition-all duration-500 cursor-pointer hover:opacity-90 hover:scale-95 hover:border-amber-500/40 z-10 group"
          >
            <Image
              src={getThumbnailUrl(list[nextIndex])}
              alt={list[nextIndex].name}
              fill
              sizes="240px"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 p-2.5 flex justify-between items-center">
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md rounded text-[9px] uppercase font-bold text-amber-400 border border-amber-500/30">
                Next ►
              </span>
              {list[nextIndex].video_url && (
                <div className="w-6 h-6 rounded-full bg-amber-500/80 text-slate-950 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              )}
            </div>

            <div className="relative z-10 p-3 space-y-0.5">
              <h4 className="font-serif font-bold text-white text-xs truncate">
                {list[nextIndex].name}
              </h4>
              <p className="text-[10px] text-slate-300 truncate">
                {list[nextIndex].location}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-400">
            {activeIndex + 1} of {total}
          </span>

          <button
            onClick={handleNext}
            aria-label="Next testimonial"
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
            className="absolute top-3 right-3 z-30 p-2 bg-slate-900/90 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 pointer-events-none" />
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

