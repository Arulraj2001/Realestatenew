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
      <section className="relative min-h-[70vh] flex items-end bg-slate-950 overflow-hidden border-b border-slate-800">
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 pointer-events-none" />
            <Link href="/projects" className="hover:text-amber-400 transition-colors">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 pointer-events-none" />
            <span className="text-amber-400">{project.name}</span>
          </div>

          <div className="max-w-3xl space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">{project.project_status || 'Ongoing'}</Badge>
              {project.approval_type && (
                <Badge variant="emerald">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 pointer-events-none" /> {project.approval_type} Approved
                </Badge>
              )}
              {project.location?.name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-full text-slate-300 text-xs font-semibold">
                  <MapPin className="w-3 h-3 text-amber-400 pointer-events-none" /> {project.location.name}
                </span>
              )}
            </div>

            {/* Project Name */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-2xl">
              {project.name}
            </h1>

            {/* Short Description */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {project.short_description ||
                `${project.name} is a premier residential project offering DTCP approved villa plots and independent family homes in ${project.location?.name || 'Namakkal'}.`}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
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

      {/* ─── 2. QUICK FACTS STRIP ──────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800 py-5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Location', value: project.location?.name || 'Namakkal', color: 'text-amber-400' },
              { label: 'Status', value: project.project_status || 'Ongoing', color: 'text-white' },
              { label: 'Approvals', value: project.approval_type || 'DTCP Sanctioned', color: 'text-emerald-400' },
              { label: 'Property Choices', value: `${allConfigurations.length} Available Types`, color: 'text-white' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center gap-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-widest">{stat.label}</span>
                <span className={`font-serif font-bold text-sm sm:text-base ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
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
