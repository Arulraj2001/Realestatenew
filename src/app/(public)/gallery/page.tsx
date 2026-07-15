import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Camera, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getPublishedGalleryItems, getPublishedLocations, getPublishedProjects } from '@/lib/data';
import { siteConfig } from '@/config/site';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
  title: 'Media & Layout Photo Gallery',
  description:
    'Explore high-resolution on-site photography, layout entrance arches, paved avenues, and villa architecture.',
  alternates: {
    canonical: `${siteConfig.domain}/gallery`,
  },
};

export interface GalleryPageProps {
  searchParams: Promise<{
    project?: string;
    location?: string;
    category?: string;
  }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { project, location, category } = await searchParams;

  const [items, locations, projects] = await Promise.all([
    getPublishedGalleryItems({
      projectId: project,
      locationId: location,
      category: category,
    }),
    getPublishedLocations(),
    getPublishedProjects(),
  ]);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gallery',
        item: `${siteConfig.domain}/gallery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-4 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Gallery</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" /> Visual Media
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              On-Site Photo & Media Gallery
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Authentic ground-level and aerial photography of completed layouts, tar avenues, and custom villa builds.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <form method="GET" action="/gallery" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Location</label>
                <select
                  name="location"
                  defaultValue={location || ''}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Project</label>
                <select
                  name="project"
                  defaultValue={project || ''}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={category || ''}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Overview">Overview</option>
                  <option value="Roads">Roads & Avenues</option>
                  <option value="Villas">Villa Construction</option>
                  <option value="Parks">Children Parks</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Media
                </button>
                {(project || location || category) && (
                  <Link
                    href="/gallery"
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center"
                  >
                    Reset
                  </Link>
                )}
              </div>
            </form>
          </div>

          {/* Lightbox & Grid */}
          {items.length === 0 ? (
            <EmptyState
              title="No Gallery Photos Found"
              description="Adjust your search filters to view media from other projects or locations."
            />
          ) : (
            <GalleryLightbox items={items} />
          )}
        </div>
      </div>
    </>
  );
}
