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
import { ProjectSectionNav, NavSectionItem } from '@/components/public/ProjectSectionNav';
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

  const navSections: NavSectionItem[] = [
    { id: 'overview', label: 'Overview' },
    ...(projectVideoUrl ? [{ id: 'video', label: 'Project Video' }] : []),
    ...(villas.length > 0 ? [{ id: 'villas', label: 'Villas' }] : []),
    ...(plots.length > 0 ? [{ id: 'plots', label: 'Plots' }] : []),
    ...(floorPlans.length > 0 ? [{ id: 'floor-plans', label: 'Floor Plans' }] : []),
    ...(galleryItems.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
    ...(amenities.length > 0 ? [{ id: 'amenities', label: 'Amenities' }] : []),
    ...(landmarks.length > 0 ? [{ id: 'landmarks', label: 'Nearby Places' }] : []),
    ...(project.map_url || project.address ? [{ id: 'location', label: 'Location' }] : []),
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* ─── 1. CINEMATIC HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex items-end bg-slate-950 overflow-hidden">
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
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/projects" className="hover:text-amber-400 transition-colors">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-amber-400">{project.name}</span>
          </div>

          <div className="max-w-3xl space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">{project.project_status || 'Ongoing'}</Badge>
              {project.approval_type && (
                <Badge variant="emerald">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {project.approval_type} Approved
                </Badge>
              )}
              {project.location?.name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-full text-slate-300 text-xs font-semibold">
                  <MapPin className="w-3 h-3 text-amber-400" /> {project.location.name}
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
                  <Phone className="w-4 h-4 mr-2" /> Call Now for Site Visit
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
                  <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp Enquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. QUICK FACTS STRIP ──────────────────────────────────── */}
      <section className="bg-slate-900 border-y border-slate-800 py-5 px-4">
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

      {/* ─── 3. SECTION NAV ────────────────────────────────────────── */}
      <ProjectSectionNav sections={navSections} />

      {/* ─── 4. MAIN CONTENT ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* OVERVIEW */}
        <section id="overview" className="scroll-mt-36">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Text */}
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Project Overview
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                About {project.name}
              </h2>
              <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                <p>
                  {project.name} is a residential project in {project.location?.name || 'Namakkal'}.
                  It offers DTCP approved plots and {villas.length > 0 ? '2BHK, 3BHK and 4BHK family villas.' : 'residential house plots.'}
                  {' '}The project includes planned blacktop roads, useful amenities and direct access to nearby schools, transport corridors and key public places.
                </p>
                {project.full_description && <p>{project.full_description}</p>}
              </div>
            </div>

            {/* Aside Quick Stats */}
            <div className="lg:col-span-2 space-y-3">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Project Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-slate-400 text-xs">Developer</span>
                    <span className="font-bold text-white text-xs">Your Choice Properties</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-slate-400 text-xs">Location</span>
                    <span className="font-bold text-amber-400 text-xs">{project.location?.name || 'Namakkal'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-slate-400 text-xs">Status</span>
                    <span className="font-bold text-white text-xs">{project.project_status || 'Ongoing'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-slate-400 text-xs">Approval</span>
                    <span className="font-bold text-emerald-400 text-xs">{project.approval_type || 'DTCP Approved'}</span>
                  </div>
                  {allConfigurations.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Configurations</span>
                      <span className="font-bold text-white text-xs">{allConfigurations.length} Types</span>
                    </div>
                  )}
                </div>

                <a href={`tel:${siteConfig.contact.phone}`} className="block pt-2">
                  <Button variant="gold" size="sm" className="w-full font-bold">
                    <Phone className="w-3.5 h-3.5 mr-2" /> Call for Free Site Visit
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT VIDEO */}
        {projectVideoUrl && (
          <section id="video" className="scroll-mt-36 space-y-8 border-t border-slate-800 pt-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Video Tour
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Project Walkthrough Video
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Watch a complete visual walkthrough of the township layout, roads, villa designs and community spaces.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ProjectVideoPlayer
                title={`${project.name} Walkthrough`}
                videoUrl={projectVideoUrl}
                posterImage={project.hero_image_path}
              />
            </div>
          </section>
        )}

        {/* VILLAS */}
        {villas.length > 0 && (
          <section id="villas" className="scroll-mt-36 space-y-8 border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <BedDouble className="w-3.5 h-3.5" /> Independent Homes
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Family Villas
                </h2>
                <p className="text-slate-400 text-sm">Architect-designed villa homes in {project.name} with premium finishes</p>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{villas.length} Configuration{villas.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((v) => {
                const formattedPrice = v.starting_price
                  ? `₹${(v.starting_price / 100000).toFixed(0)} Lakhs*`
                  : null;
                return (
                  <div
                    key={v.id}
                    className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={v.hero_image_path || fallbackHero}
                        alt={v.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="gold" className="text-[11px]">{v.bhk ? `${v.bhk} BHK` : 'Villa'}</Badge>
                        {v.availability_status === 'Fast Filling' && (
                          <Badge variant="red" className="text-[11px]">Fast Filling</Badge>
                        )}
                      </div>
                      {formattedPrice && (
                        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-sm border border-amber-500/30 rounded-lg px-2.5 py-1.5">
                          <span className="text-amber-400 font-extrabold text-xs flex items-center gap-0.5">
                            <IndianRupee className="w-3 h-3" />{formattedPrice}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{v.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {v.short_description || 'Custom villa layout with private car parking & balcony.'}
                        </p>
                      </div>

                      {/* Spec Bar */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                        {v.bedrooms > 0 && (
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Beds</span>
                            <span className="font-bold text-white text-xs flex items-center justify-center gap-0.5">
                              <BedDouble className="w-3 h-3 text-amber-400" /> {v.bedrooms}
                            </span>
                          </div>
                        )}
                        {v.bathrooms > 0 && (
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Baths</span>
                            <span className="font-bold text-white text-xs flex items-center justify-center gap-0.5">
                              <Bath className="w-3 h-3 text-emerald-400" /> {v.bathrooms}
                            </span>
                          </div>
                        )}
                        {v.built_up_area && (
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Built-up</span>
                            <span className="font-bold text-white text-xs">{v.built_up_area}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-2">
                        <Link href={`/properties/${v.slug}`}>
                          <Button variant="gold" size="sm" className="w-full font-bold group-hover:shadow-lg">
                            View Full Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PLOTS */}
        {plots.length > 0 && (
          <section id="plots" className="scroll-mt-36 space-y-8 border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Maximize className="w-3.5 h-3.5" /> Approved House Sites
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Residential Plots
                </h2>
                <p className="text-slate-400 text-sm">DTCP approved ready-to-construct house sites in {project.name}</p>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{plots.length} Plot Option{plots.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plots.map((p) => {
                const formattedPrice = p.starting_price
                  ? `₹${(p.starting_price / 100000).toFixed(0)} Lakhs*`
                  : null;
                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={p.hero_image_path || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="amber" className="text-[11px]">Plot</Badge>
                      </div>
                      {formattedPrice && (
                        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-sm border border-amber-500/30 rounded-lg px-2.5 py-1.5">
                          <span className="text-amber-400 font-extrabold text-xs flex items-center gap-0.5">
                            <IndianRupee className="w-3 h-3" />{formattedPrice}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {p.short_description || 'East & North facing residential plot with clear title deeds.'}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        {p.plot_area && (
                          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                            <span className="text-slate-400 flex items-center gap-1.5"><Maximize className="w-3 h-3 text-amber-400" /> Plot Area</span>
                            <span className="font-bold text-amber-400">{p.plot_area}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Approval</span>
                          <span className="font-bold text-emerald-400">{project.approval_type || 'DTCP'}</span>
                        </div>
                        {p.parking && (
                          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                            <span className="text-slate-400 flex items-center gap-1.5"><Car className="w-3 h-3 text-blue-400" /> Parking</span>
                            <span className="font-bold text-white">{p.parking}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-2">
                        <Link href={`/properties/${p.slug}`}>
                          <Button variant="outline" size="sm" className="w-full font-bold border-slate-700 text-slate-200 hover:border-amber-500/50 hover:text-amber-300">
                            View Plot Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FLOOR PLANS */}
        {floorPlans.length > 0 && (
          <section id="floor-plans" className="scroll-mt-36 space-y-8 border-t border-slate-800 pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Architecture
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">Master & Floor Plans</h2>
              <p className="text-slate-400 text-sm">Architectural layouts of all available villa and plot configurations</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {floorPlans.map((fp) => (
                <div key={fp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-amber-500/30 transition-colors">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <Image src={fp.storage_path_or_url} alt={fp.title || 'Floor Plan'} fill className="object-contain" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{fp.title || 'Architectural Floor Plan'}</h4>
                  {fp.caption && <p className="text-xs text-slate-400">{fp.caption}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {galleryItems.length > 0 && (
          <section id="gallery" className="scroll-mt-36 space-y-8 border-t border-slate-800 pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Site Photography
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">Project Photo Gallery</h2>
              <p className="text-slate-400 text-sm">Real site photos, villa elevations and road views from {project.name}</p>
            </div>
            <GalleryLightbox items={galleryItems} />
          </section>
        )}

        {/* AMENITIES */}
        {amenities.length > 0 && (
          <div className="border-t border-slate-800 pt-8">
            <ProjectAmenitiesPopup amenities={amenities} projectName={project.name} />
          </div>
        )}

        {/* NEARBY LANDMARKS */}
        {landmarks.length > 0 && (
          <div className="border-t border-slate-800 pt-8">
            <ProjectLandmarksPopup landmarks={landmarks} projectName={project.name} />
          </div>
        )}

        {/* LOCATION MAP */}
        {(project.map_url || project.address) && (
          <div className="border-t border-slate-800 pt-8">
            <ProjectLocationMapPopup
              projectName={project.name}
              address={project.address}
              mapUrl={project.map_url}
            />
          </div>
        )}
      </div>

      {/* ─── SITE VISIT CTA ──────────────────────────────────────── */}
      <SiteVisitCTASection
        heading={`Schedule a Free Site Visit to ${project.name}`}
        description="Our team will pick you up and show you available plots and villas. No obligation, completely free."
      />
    </div>
  );
}
