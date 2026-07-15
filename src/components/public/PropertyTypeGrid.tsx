import React from 'react';
import Link from 'next/link';
import { Compass, Home, Building, Store, ArrowUpRight } from 'lucide-react';

export const PropertyTypeGrid: React.FC = () => {
  const propertyTypes = [
    {
      title: 'Residential Villa Plots',
      type: 'Plot',
      description: '30x40 & 40x60 DTCP approved plots ready for immediate construction.',
      icon: <Compass className="w-6 h-6 text-amber-400" />,
      count: '45+ Available',
    },
    {
      title: 'Independent Luxury Villas',
      type: 'Villa',
      description: '2BHK, 3BHK & 4BHK custom designed villas with vastu compliance.',
      icon: <Home className="w-6 h-6 text-emerald-400" />,
      count: '18+ Ready/Ongoing',
    },
    {
      title: 'Commercial Frontage Plots',
      type: 'Commercial',
      description: 'Highway-facing commercial land suitable for showrooms & clinics.',
      icon: <Store className="w-6 h-6 text-amber-500" />,
      count: '12 Prime Sites',
    },
    {
      title: 'Gated Township Communities',
      type: 'Apartment',
      description: 'Fully integrated townships with solar street lights & park zones.',
      icon: <Building className="w-6 h-6 text-blue-400" />,
      count: '3 Master Layouts',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Category Showcase
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Browse by Property Preference
          </h2>
          <p className="text-sm text-slate-400">
            Tailored property configurations catering to individual homebuyers, villa builders, and commercial land investors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyTypes.map((item, index) => (
            <Link
              key={index}
              href={`/projects?type=${item.type}`}
              className="group p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/50 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-400">
                <span>{item.count}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
