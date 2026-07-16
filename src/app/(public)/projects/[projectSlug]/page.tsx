import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getProjectBySlug,
  getProjectAmenities,
  getProjectLandmarks,
  getPublishedConfigurations,
  getPublishedGalleryItems,
} from '@/lib/data';

import {
  ShieldCheck,
  BedDouble,
  Bath,
  ArrowRight,
  ChevronRight,
  Maximize,
  Sparkles,
  FileText,
  MapPin,
  Car,
  IndianRupee,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectVideoPlayer } from '@/components/public/ProjectVideoPlayer';
import { ProjectAmenitiesPopup } from '@/components/public/ProjectAmenitiesPopup';
import { ProjectLandmarksPopup } from '@/components/public/ProjectLandmarksPopup';
import { ProjectLocationMapPopup } from '@/components/public/ProjectLocationMapPopup';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';
import { ProjectAccordionSections } from '@/components/public/ProjectAccordionSections';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

export interface ProjectPageProps {
  params: Promise<{
    projectSlug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project) {
    return { title: 'Project Not Found | Your Choice Properties' };
  }

  return {
    title: `${project.name} | Gated Layout & Family Villas in ${project.location?.name || 'Namakkal'}`,
    description:
      project.short_description ||
      `${project.name} is a premier residential project offering DTCP approved villa plots and independent family homes in ${project.location?.name || 'Namakkal'}.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project) {
    notFound();
  }

  const [amenities, landmarks, allConfigurations, galleryItems] = await Promise.all([
    getProjectAmenities(project.id),
    getProjectLandmarks(project.id),
    getPublishedConfigurations({ projectId: project.id }),
    getPublishedGalleryItems({ projectId: project.id }),
  ]);

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
    galleryItems.find(
      (item) => item.category === 'project_video' || item.media_type === 'video'
    )?.storage_path_or_url ||
    DEFAULT_VIDEO_WALKTHROUGH;

  const floorPlans = galleryItems.filter((item) => item.category === 'floor_plan');

  const fallbackHero =
    project.hero_image_path ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* ─── 1. CINEMATIC HERO ─────────────────────────────────────── */}
      <section className="hero-dark-overlay relative py-5 sm:py-6 bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={fallbackHero}
            alt={project.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3" style={{ color: '#cbd5e1' }}>
            <Link href="/" className="hover:text-amber-400 transition-colors" style={{ color: '#e2e8f0' }}>Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 pointer-events-none" style={{ color: '#94a3b8' }} />
            <Link href="/projects" className="hover:text-amber-400 transition-colors" style={{ color: '#e2e8f0' }}>Projects</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 pointer-events-none" style={{ color: '#94a3b8' }} />
            <span className="text-amber-400 font-bold" style={{ color: '#fbbf24' }}>{project.name}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            {/* Project Name */}
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-2xl" style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
              {project.name}
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a href={`tel:${siteConfig.contact.phone}`}>
                <Button variant="gold" size="lg" className="font-bold shadow-xl">
                  <Phone className="w-4 h-4 mr-2 pointer-events-none" /> Call Now for Site Visit
                </Button>
              </a>
              <a
                href={buildWhatsAppUrl({
                  customMessage: `Hi! I'm interested in ${project.name}. Please share availability and pricing.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="font-bold border-emerald-500/60 text-emerald-400 bg-slate-900/60 backdrop-blur-sm hover:bg-emerald-950">
                  <MessageSquare className="w-4 h-4 mr-2 pointer-events-none" /> WhatsApp Enquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ─── 3. MAIN ACCORDION DETAILS CONTAINER ─────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectAccordionSections
          project={project}
          villas={villas}
          plots={plots}
          amenities={amenities}
          landmarks={landmarks}
          galleryItems={galleryItems}
          floorPlans={floorPlans}
          projectVideoUrl={projectVideoUrl}
        />
      </div>

      {/* ─── SITE VISIT CTA ──────────────────────────────────────── */}
      <SiteVisitCTASection
        heading={`Schedule a Free Site Visit to ${project.name}`}
        description="Our team will pick you up and show you available plots and villas. No obligation, completely free."
      />
    </div>
  );
}
