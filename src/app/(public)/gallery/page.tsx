import React from 'react';
import { Metadata } from 'next';
import { Camera, Sparkles, MapPin, Building2, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons';
import { getPublishedGalleryItems, getPublishedProjects, getPublishedLocations } from '@/lib/data';
import { GalleryItem } from '@/types/database';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Photo Gallery | Your Choice Properties',
  description:
    'View photos and videos of residential plots, 2BHK, 3BHK and 4BHK villas at Rasi Garden, Kongu Nagar and Kongu Garden in Namakkal and Paramathi Velur.',
  alternates: {
    canonical: `${siteConfig.domain}/gallery`,
  },
};

export default async function GalleryPage() {
  const [galleryItems, projects, locations] = await Promise.all([
    getPublishedGalleryItems(),
    getPublishedProjects(),
    getPublishedLocations(),
  ]);

  // Build a map of project_id -> project for lookup
  const projectMap = new Map<string, typeof projects[0]>();
  projects.forEach((p) => {
    projectMap.set(p.id, p);
  });

  // Group items dynamically by project
  const groupedItems = new Map<string, GalleryItem[]>();
  const assignedIds = new Set<string>();

  galleryItems.forEach((item) => {
    if (item.project_id && projectMap.has(item.project_id)) {
      const slug = projectMap.get(item.project_id)!.slug;
      if (!groupedItems.has(slug)) groupedItems.set(slug, []);
      groupedItems.get(slug)!.push(item);
      assignedIds.add(item.id);
    }
  });

  // Remaining general items not assigned to any project
  const otherItems = galleryItems.filter((i) => !assignedIds.has(i.id));

  // Location name mapping for display
  const locationNames: Record<string, string> = {};
  locations.forEach((loc) => {
    locationNames[loc.id] = loc.name;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header with Single H1 */}
      <div className="max-w-7xl mx-auto border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Camera className="w-3.5 h-3.5" /> Project Showcase
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          See Our Plots, Villas and Completed Projects in Namakkal and Paramathi Velur
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-3 leading-relaxed">
          Browse real site photography, asphalt road infrastructure, villa designs, elevation models, and floor plan drawings across our townships.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Dynamically render sections for each project that has gallery items */}
        {projects.map((proj) => {
          const items = groupedItems.get(proj.slug) || [];
          if (items.length === 0) return null;

          const locName = proj.location?.name || locationNames[proj.location_id] || 'Tamil Nadu';

          return (
            <section key={proj.id} className="space-y-6 border-b border-slate-800 pb-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" /> {locName}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {proj.name}
                  </h2>
                </div>
                <Badge variant="gold">{proj.project_status || 'Ongoing'}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                View site photos, roads, plot layouts and villa designs from {proj.name} in {locName}.
              </p>
              <GalleryLightbox items={items} />

              {/* Section End Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={buildWhatsAppUrl({ customMessage: `Hello, I am interested in inquiring about plot & villa availability in ${proj.name}, ${locName}.` })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Enquiry — {proj.name}</span>
                </a>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Us ({siteConfig.contact.phone})</span>
                </a>
              </div>
            </section>
          );
        })}

        {/* Other Township Photos (if available) */}
        {otherItems.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">
              Township Infrastructure & Site Progress
            </h2>
            <GalleryLightbox items={otherItems} />

            {/* Section End Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={buildWhatsAppUrl({ customMessage: 'Hello, I would like to inquire about your property developments and upcoming layouts.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Sales Enquiry</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Us ({siteConfig.contact.phone})</span>
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}