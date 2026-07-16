import React from 'react';
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
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const list = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((t, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-950 border border-slate-800 rounded-2xl relative flex flex-col justify-between hover:border-amber-500/30 transition-colors"
            >
              <Quote className="w-10 h-10 text-amber-500/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <h4 className="font-serif font-bold text-white text-base">{t.name}</h4>
                <span className="text-xs text-amber-400 block mt-0.5">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
