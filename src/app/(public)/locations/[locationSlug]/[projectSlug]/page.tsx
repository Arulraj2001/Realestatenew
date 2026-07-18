import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProjectBySlug,
  getLocationBySlug,
  getPublishedLocations,
  getPublishedProjects,
  getProjectAmenities,
  getProjectLandmarks,
  getPublishedConfigurations,
  getPublishedGalleryItems,
} from '@/lib/data';
import { siteConfig } from '@/config/site';
import { getSeoOverride, buildMetadataFromOverride, getProjectJsonLd, resolveJsonLd } from '@/lib/seo/metadata';

import { ProjectVideoPlayer } from '@/components/public/ProjectVideoPlayer';
import { ProjectAccordionSections } from '@/components/public/ProjectAccordionSections';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';
import Link from 'next/link';
import { MapPin, ChevronRight, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

export interface HierarchicalProjectPageProps {
  params: Promise<{
    locationSlug: string;
    projectSlug: string;
  }>;
}

export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  const paramsList: Array<{ locationSlug: string; projectSlug: string }> = [];

  for (const loc of locations) {
    const projects = await getPublishedProjects({ locationId: loc.id });
    for (const proj of projects) {
      paramsList.push({
        locationSlug: loc.slug,
        projectSlug: proj.slug,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: HierarchicalProjectPageProps): Promise<Metadata> {
  const { locationSlug, projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);
  const location = await getLocationBySlug(locationSlug);

  if (!project) {
    return { title: 'Project Not Found | Your Choice Properties' };
  }

  const override = await getSeoOverride('project', project.id);
  const locName = location?.name || project.location?.name || 'Namakkal';

  return buildMetadataFromOverride(override, {
    title: `${project.name} in ${locName} | DTCP Approved Plots & Family Villas`,
    description:
      project.short_description ||
      `Explore ${project.name} situated in ${locName}. Featuring DTCP approved plots, 2BHK/3BHK/4BHK independent villas, and road infrastructure.`,
    canonicalUrl: `${siteConfig.domain}/locations/${locationSlug}/${project.slug}`,
    ogImage: project.hero_image_path ?? undefined,
  });
}

export default async function HierarchicalProjectPage({ params }: HierarchicalProjectPageProps) {
  const { locationSlug, projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);
  const location = await getLocationBySlug(locationSlug);

  if (!project) {
    notFound();
  }

  const [amenities, landmarks, allConfigurations, galleryItems, seoOverride] = await Promise.all([
    getProjectAmenities(project.id),
    getProjectLandmarks(project.id),
    getPublishedConfigurations({ projectId: project.id }),
    getPublishedGalleryItems({ projectId: project.id }),
    getSeoOverride('project', project.id),
  ]);

  const jsonLd = resolveJsonLd(seoOverride, getProjectJsonLd(project));

  const villas = allConfigurations
    .filter((c) => c.property_type === 'Villa' || c.property_type === 'Apartment')
    .sort((a, b) => (b.bhk || 0) - (a.bhk || 0));

  const plots = allConfigurations.filter((c) => c.property_type === 'Plot');

  const DEFAULT_VIDEO_WALKTHROUGH = 'https://www.youtube.com/watch?v=668nUCeBHyY';

  const projectVideoUrl =
    project.hero_video_path ||
    galleryItems.find(
      (item) => item.category === 'project_video' || item.media_type === 'video' || item.video_url
    )?.video_url ||
    DEFAULT_VIDEO_WALKTHROUGH;

  const locName = location?.name || project.location?.name || 'Namakkal';

  const whatsappUrl = buildWhatsAppUrl({
    projectName: project.name,
    locationName: locName,
  });

  const floorPlanItems = galleryItems.filter(
    (item) => item.category === 'floor_plan' || item.category === 'layout_map'
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Hierarchical Breadcrumb Header Banner */}
        <section className="relative py-8 bg-slate-950 border-b border-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/locations" className="hover:text-amber-400 transition-colors">
                Locations
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/locations/${locationSlug}`} className="hover:text-amber-400 transition-colors text-slate-300">
                {locName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold">{project.name}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> {locName} Township
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {project.name}
                </h1>
                <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                  {project.short_description ||
                    `${project.name} is a high-demand gated layout community in ${locName} offering DTCP approved plots and custom independent house construction.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Project Expert
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-500/20 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" /> Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Video Walkthrough Player */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ProjectVideoPlayer videoUrl={projectVideoUrl} title={`${project.name} Video Tour`} />
        </div>

        {/* Accordion breakdown of plot sizes, villas, site photos, landmarks & amenities */}
        <ProjectAccordionSections
          project={project}
          plots={plots}
          villas={villas}
          floorPlans={floorPlanItems}
          amenities={amenities}
          landmarks={landmarks}
          galleryItems={galleryItems}
          projectVideoUrl={projectVideoUrl}
        />

        <SiteVisitCTASection />
      </div>
    </>
  );
}
