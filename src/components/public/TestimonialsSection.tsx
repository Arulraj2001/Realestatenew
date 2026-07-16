'use client';

import React, { useRef, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

export interface TestimonialItem {
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Dr. K. Senthil Nathan',
    location: 'Rasi Garden, Namakkal',
    rating: 5,
    comment:
      'Purchased a 1,500 Sq.Ft villa plot at Rasi Garden. Clear title documents, instant registration, and top-tier blacktop roads. Highly recommend Your Choice Properties for hassle-free buying.',
  },
  {
    name: 'Mr. P. Subramaniam',
    location: 'Kongu Nagar, Namakkal',
    rating: 5,
    comment:
      'Constructed a 3BHK independent villa through their construction team. Excellent floor plan customization, transparent pricing, and finished 15 days ahead of schedule!',
  },
  {
    name: 'Mrs. Jayanthi Viswanathan',
    location: 'Kongu Garden, Paramathi Velur',
    rating: 5,
    comment:
      'The free pickup and drop facility for site visits was extremely helpful for our family. Bank housing loan process was completed within 7 working days thanks to their staff.',
  },
  {
    name: 'Mr. Ramesh Kumar',
    location: 'Rasi Garden, Namakkal',
    rating: 5,
    comment:
      'Excellent guidance throughout the buying process. The team helped us choose the right plot orientation with great ROI potential. Worth every rupee!',
  },
  {
    name: 'Mrs. Kavitha Sundaram',
    location: 'Kongu Nagar, Paramathi Velur',
    rating: 5,
    comment:
      'The 2BHK villa is beautifully constructed with premium finishes. My family loves the serene locality and wide roads. Great investment!',
  },
];

const TestimonialCard: React.FC<{ t: TestimonialItem }> = ({ t }) => (
  <div className="flex-shrink-0 w-80 p-6 bg-slate-950 border border-slate-800 rounded-2xl relative flex flex-col justify-between hover:border-amber-500/30 transition-colors mx-3">
    <Quote className="w-8 h-8 text-amber-500/20 absolute top-5 right-5" />
    <div className="space-y-3">
      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-4">
        &ldquo;{t.comment}&rdquo;
      </p>
    </div>
    <div className="pt-4 mt-4 border-t border-slate-800/80">
      <h4 className="font-serif font-bold text-white text-sm">{t.name}</h4>
      <span className="text-xs text-amber-400 block mt-0.5">{t.location}</span>
    </div>
  </div>
);

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const list = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  // Duplicate list for seamless infinite scroll
  const doubled = [...list, ...list];
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5; // px per frame — slow drift

    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Client Testimonials
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Hear From Our Delighted Homeowners
          </h2>
          <p className="text-sm text-slate-400">
            Real stories and genuine experiences from families who found their ideal home with us.
          </p>
        </div>
      </div>

      {/* Scrolling Ticker Track — full bleed */}
      <div
        className="relative w-full"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-900 to-transparent" />
        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-900 to-transparent" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ transform: 'translateX(0px)' }}
          >
            {doubled.map((t, idx) => (
              <TestimonialCard key={idx} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
