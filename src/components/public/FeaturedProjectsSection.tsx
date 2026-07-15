import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, MapPin, ShieldCheck, ArrowRight, IndianRupee } from 'lucide-react';
import { Project } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({ projects }) => {
  const fallbackImages: Record<string, string> = {
    'rasi-garden': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'kongu-nagar': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'kongu-garden': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  };

  return (
    <section id="featured-projects" className="py-20 bg-slate-900/60 border-y border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" /> Handpicked Townships
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Featured Flagship Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <EmptyState
            title="No Published Projects"
            description="Our ongoing and upcoming townships will be displayed here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => {
              const coverImage =
                proj.hero_image_path ||
                fallbackImages[proj.slug] ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

              const formattedPrice = proj.starting_price
                ? `₹${(proj.starting_price / 100000).toFixed(2)} Lakhs*`
                : 'Price On Request';

              return (
                <div
                  key={proj.id}
                  className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Header */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={coverImage}
                        alt={proj.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="gold">{proj.project_status}</Badge>
                        {proj.approval_type && (
                          <Badge variant="emerald" className="bg-slate-900/90 backdrop-blur-md">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            {proj.approval_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{proj.address || proj.location?.name || 'Namakkal'}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {proj.short_description || 'DTCP approved villa plots with complete drainage and tar roads.'}
                        </p>
                      </div>

                      {/* Key Stats Bar */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-500">Total Plots</span>
                          <span className="font-semibold text-slate-200">{proj.total_plots || 30}+ Units</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-500">Starting Price</span>
                          <span className="font-bold text-amber-400 flex items-center">
                            <IndianRupee className="w-3 h-3" /> {formattedPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between">
                    <Link
                      href={`/projects/${proj.slug}`}
                      className="w-full inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300"
                    >
                      <span>Explore Master Plan & Pricing</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
