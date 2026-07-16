import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
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

  const projectDescriptions: Record<string, string> = {
    'rasi-garden': 'DTCP approved residential plots and ready 3BHK & 4BHK family villas situated in central Namakkal.',
    'kongu-nagar': 'Gated residential land layout with wide tar roads, solar streetlights, and Cauvery water supply in Namakkal.',
    'kongu-garden': 'Plots and 2BHK, 3BHK and 4BHK villas near Velur main highway in Paramathi Velur.',
  };

  const propertyTypesMap: Record<string, string> = {
    'rasi-garden': 'Plots, 3BHK & 4BHK Villas',
    'kongu-nagar': 'Residential Plots',
    'kongu-garden': 'Plots, 2BHK, 3BHK & 4BHK Villas',
  };

  return (
    <section id="featured-projects" className="py-16 bg-slate-900/60 border-y border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" /> Approved Layouts
            </div>
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
              Featured Residential Projects
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
            title="No Matching Projects Found"
            description="Try selecting a different location or property type filter above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const coverImage =
                proj.hero_image_path ||
                fallbackImages[proj.slug] ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

              const cardDescription =
                proj.short_description ||
                projectDescriptions[proj.slug] ||
                `Residential plots and villas available at ${proj.name}.`;

              const availableTypes = propertyTypesMap[proj.slug] || 'Plots & Independent Villas';

              return (
                <div
                  key={proj.id}
                  className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 flex flex-col justify-between"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="gold" className="text-[11px] px-2.5 py-0.5">{proj.project_status || 'Ongoing'}</Badge>
                        {proj.approval_type && (
                          <Badge variant="emerald" className="bg-slate-900/90 backdrop-blur-md text-[11px] px-2.5 py-0.5">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            {proj.approval_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {proj.location?.name || 'Namakkal'}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                          {proj.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {cardDescription}
                      </p>

                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Property Types:</span>
                        <span className="font-bold text-slate-200 text-xs">{availableTypes}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Project CTA Footer */}
                  <div className="px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/60 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                    <Link
                      href={`/projects/${proj.slug}`}
                      className="w-full inline-flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-amber-400 group-hover:text-slate-950 transition-colors duration-300"
                    >
                      <span className="flex items-center gap-2">View Project Details</span>
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 group-hover:bg-slate-950 text-amber-400 group-hover:text-amber-300 border border-amber-500/30 group-hover:border-slate-900 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1.5 shadow-md">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
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
