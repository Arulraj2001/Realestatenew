'use client';

import React, { useState } from 'react';
import { Camera, MapPin, Phone, Film, Tv2, Share2 } from 'lucide-react';
import { GalleryItem, Project, Location } from '@/types/database';
import { WhatsAppIcon, YoutubeIcon, InstagramIcon } from '@/components/ui/icons';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/ui/badge';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';
import {
  getMediaKind, groupByKind, totalCount,
  getKindLabel, GalleryMediaKind,
} from '@/lib/utils/gallery';

export interface GalleryClientViewProps {
  galleryItems: GalleryItem[];
  projects: Project[];
  locations: Location[];
}



// ─── Per-project section ───────────────────────────────────────────────────────
function ProjectGallerySection({
  project,
  items,
  locationName,
}: {
  project: Project;
  items: GalleryItem[];
  locationName: string;
}) {
  return (
    <section className="bg-slate-900/50 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 space-y-3.5 shadow-xl relative overflow-hidden">
      {/* Ambient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 relative z-10">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold leading-none mb-0.5">
            <MapPin className="w-3 h-3" /> {locationName}
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {project.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="gold" className="text-[10px] px-2.5 py-0.5 font-bold">
            {project.project_status || 'Ongoing'}
          </Badge>
          <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono font-bold rounded-full">
            {items.length} Assets
          </span>
        </div>
      </div>

      {/* Single Continuous Grid Flow */}
      <div className="relative z-10">
        <GalleryLightbox items={items} activeKind="photo" />
      </div>

      {/* CTA Buttons */}
      <div className="pt-2.5 flex flex-wrap items-center justify-center gap-2.5 border-t border-slate-800/60 relative z-10">
        <a
          href={buildWhatsAppUrl({
            customMessage: `Hello, I am interested in ${project.name}, ${locationName}. Please share availability.`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>WhatsApp Enquiry — {project.name}</span>
        </a>
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="py-1.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call Us</span>
        </a>
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const GalleryClientView: React.FC<GalleryClientViewProps> = ({
  galleryItems,
  projects,
  locations,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Build lookup maps
  const locationNames: Record<string, string> = {};
  locations.forEach((loc) => { locationNames[loc.id] = loc.name; });

  // Group items by project
  const projectItemMap = new Map<string, GalleryItem[]>();
  const assignedIds = new Set<string>();
  galleryItems.forEach((item) => {
    if (item.project_id && projects.find((p) => p.id === item.project_id)) {
      if (!projectItemMap.has(item.project_id)) projectItemMap.set(item.project_id, []);
      projectItemMap.get(item.project_id)!.push(item);
      assignedIds.add(item.id);
    }
  });
  const generalItems = galleryItems.filter((i) => !assignedIds.has(i.id));

  // Visible project ids (those that have items)
  const activeProjects = projects.filter((p) => (projectItemMap.get(p.id) || []).length > 0);

  // Determine which sections to show
  const showAll = selectedProjectId === 'all';
  const showGeneral = selectedProjectId === 'all' || selectedProjectId === 'general';

  const TAB_CLS = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
      active
        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
    }`;

  return (
    <div className="space-y-5">
      {/* ── Project Tab Bar ── */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* All */}
          <button onClick={() => setSelectedProjectId('all')} className={TAB_CLS(selectedProjectId === 'all')}>
            <span>All Projects</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">{galleryItems.length}</span>
          </button>

          {/* Per project */}
          {activeProjects.map((proj) => {
            const count = (projectItemMap.get(proj.id) || []).length;
            return (
              <button key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className={TAB_CLS(selectedProjectId === proj.id)}>
                <span>{proj.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">{count}</span>
              </button>
            );
          })}

          {/* General */}
          {generalItems.length > 0 && (
            <button onClick={() => setSelectedProjectId('general')} className={TAB_CLS(selectedProjectId === 'general')}>
              <span>General</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">{generalItems.length}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Project Sections ── */}
      <div className="space-y-6">
        {activeProjects.map((proj) => {
          if (!showAll && selectedProjectId !== proj.id) return null;
          const items = projectItemMap.get(proj.id) || [];
          const locName = proj.location?.name || locationNames[proj.location_id] || 'Tamil Nadu';
          return (
            <ProjectGallerySection
              key={proj.id}
              project={proj}
              items={items}
              locationName={locName}
            />
          );
        })}

        {/* General section */}
        {showGeneral && generalItems.length > 0 && (
          <section className="bg-slate-900/50 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">General Showcase</span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Township Infrastructure &amp; Site Progress
                </h2>
              </div>
              <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono font-bold rounded-full">
                {generalItems.length} Assets
              </span>
            </div>
            <GalleryLightbox items={generalItems} activeKind="photo" />
            <div className="pt-2.5 flex flex-wrap items-center justify-center gap-2.5 border-t border-slate-800/60">
              <a
                href={buildWhatsAppUrl({ customMessage: 'Hello, I would like to inquire about your property developments.' })}
                target="_blank" rel="noopener noreferrer"
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp Enquiry
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="py-2.5 px-5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> Call Us
              </a>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!showAll && selectedProjectId !== 'general' && (projectItemMap.get(selectedProjectId) || []).length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Camera className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No media found for this project yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

