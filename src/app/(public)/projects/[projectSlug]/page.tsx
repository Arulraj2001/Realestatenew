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

  // Fetch parallel relations
  const [amenities, landmarks, allConfigurations, galleryItems] = await Promise.all([
    getProjectAmenities(project.id),
    getProjectLandmarks(project.id),
    getPublishedConfigurations({ projectId: project.id }),
    getPublishedGalleryItems({ projectId: project.id }),
  ]);

  // Separate Villas vs Plots
  const villas = allConfigurations
    .filter((c) => c.property_type === 'Villa' || c.property_type === 'Apartment')
    .sort((a, b) => {
      const bhkA = a.bhk || 0;
      const bhkB = b.bhk || 0;
      return bhkB - bhkA; // 4BHK > 3BHK > 2BHK
    });

  const plots = allConfigurations.filter((c) => c.property_type === 'Plot');

  const DEFAULT_VIDEO_WALKTHROUGH = 'https://www.youtube.com/watch?v=668nUCeBHyY';

  // Video URL (From direct project record hero_video_path OR gallery item fallback OR default walkthrough)
  const projectVideoUrl =
    project.hero_video_path ||
    galleryItems.find(
      (item) => item.category === 'project_video' || item.media_type === 'video' || item.video_url
    )?.video_url ||
    galleryItems.find(
      (item) => item.category === 'project_video' || item.media_type === 'video'
    )?.storage_path_or_url ||
    DEFAULT_VIDEO_WALKTHROUGH;

  // Floor plans
  const floorPlans = galleryItems.filter((item) => item.category === 'floor_plan');

  const fallbackHero =
    project.hero_image_path ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';

  // Construct dynamic centre section nav items
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
      {/* 1. Project Hero */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image src={fallbackHero} alt={project.name} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/projects" className="hover:text-amber-400">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400">{project.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{project.project_status || 'Ongoing'}</Badge>
            {project.approval_type && (
              <Badge variant="emerald" className="bg-slate-900/90 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {project.approval_type} Approved
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            {project.name}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            {project.short_description ||
              `${project.name} is a premier residential project offering villa plots and independent family homes in ${project.location?.name || 'Namakkal'}.`}
          </p>
        </div>
      </section>

      {/* 2. Quick Facts Bar */}
      <section className="bg-slate-900 border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Location</span>
            <span className="font-serif font-bold text-amber-400 text-sm">{project.location?.name || 'Namakkal'}</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Status</span>
            <span className="font-bold text-white text-sm">{project.project_status || 'Ongoing'}</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Approvals</span>
            <span className="font-bold text-emerald-400 text-sm">{project.approval_type || 'DTCP Sanctioned'}</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Property Choices</span>
            <span className="font-bold text-slate-200 text-sm">{allConfigurations.length} Available Types</span>
          </div>
        </div>
      </section>

      {/* 3. Centred Section Navigation Tabs */}
      <ProjectSectionNav sections={navSections} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 4. Overview Section */}
        <section id="overview" className="scroll-mt-36 border-b border-slate-800 pb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Project Overview
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-5">
            About {project.name}
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed space-y-4">
            <p>
              {project.name} is a residential project in {project.location?.name || 'Namakkal'}. It offers DTCP approved plots and 2BHK, 3BHK and 4BHK family villas. The project includes planned blacktop roads, useful amenities and direct access to nearby schools, transport corridors and key public places.
            </p>
            {project.full_description && <p>{project.full_description}</p>}
          </div>
        </section>

        {/* 5. Project Video Section (Centered Closed Preview -> Full Modal Popup) */}
        {projectVideoUrl && (
          <section id="video" className="scroll-mt-36 space-y-6 border-b border-slate-800 pb-16 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5" /> Video Tour
            </div>
            <h2 className="font-serif text-3xl font-bold text-white text-center">Project Walkthrough Video</h2>
            <div className="max-w-3xl mx-auto">
              <ProjectVideoPlayer
                title={`${project.name} Walkthrough`}
                videoUrl={projectVideoUrl}
                posterImage={project.hero_image_path}
              />
            </div>
          </section>
        )}

        {/* 6. Villas Section (Sorted 4BHK -> 3BHK -> 2BHK) */}
        {villas.length > 0 && (
          <section id="villas" className="scroll-mt-36 border-b border-slate-800 pb-16">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <BedDouble className="w-3.5 h-3.5" /> Independent Homes
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">
                Family Villas in {project.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((v) => (
                <div key={v.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300">
                  <div>
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={v.hero_image_path || fallbackHero}
                        alt={v.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="gold" className="font-extrabold text-[11px] px-2.5 py-0.5">{v.bhk ? `${v.bhk} BHK` : 'Villa'}</Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white">{v.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{v.short_description || 'Custom villa layout with private car parking & balcony.'}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-slate-950/80 rounded-xl text-center text-xs border border-slate-800">
                        {v.bedrooms && (
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Bedrooms</span>
                            <span className="font-bold text-slate-200 text-xs flex items-center justify-center gap-1"><BedDouble className="w-3 h-3 text-amber-400" /> {v.bedrooms}</span>
                          </div>
                        )}
                        {v.bathrooms && (
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Bathrooms</span>
                            <span className="font-bold text-slate-200 text-xs flex items-center justify-center gap-1"><Bath className="w-3 h-3 text-emerald-400" /> {v.bathrooms}</span>
                          </div>
                        )}
                        {v.built_up_area && (
                          <div>
                            <span className="block text-[9px] text-slate-500 uppercase font-bold">Built-up</span>
                            <span className="font-bold text-slate-200 text-xs">{v.built_up_area}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link href={`/properties/${v.slug}`} className="block">
                      <Button variant="gold" size="sm" className="w-full font-bold text-xs">
                        View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Plots Section */}
        {plots.length > 0 && (
          <section id="plots" className="scroll-mt-36 border-b border-slate-800 pb-16">
            <div className="mb-6">
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Maximize className="w-3.5 h-3.5" /> Approved House Sites
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Residential Plots in {project.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plots.map((p) => (
                <div key={p.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-bold text-white">{p.name}</h3>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <p className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-slate-500">Plot Area:</span>
                        <span className="font-bold text-amber-400">{p.plot_area || 'Standard Layout Size'}</span>
                      </p>
                      <p className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-slate-500">Approval:</span>
                        <span className="font-bold text-emerald-400">{project.approval_type || 'DTCP'}</span>
                      </p>
                    </div>
                  </div>
                  <Link href={`/properties/${p.slug}`} className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full font-bold border-slate-700 text-slate-200 text-xs">
                      View Plot Details →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Floor Plans */}
        {floorPlans.length > 0 && (
          <section id="floor-plans" className="scroll-mt-36 space-y-6 border-b border-slate-800 pb-16">
            <h2 className="font-serif text-3xl font-bold text-white">Master & Floor Plans</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {floorPlans.map((fp) => (
                <div key={fp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                    <Image src={fp.storage_path_or_url} alt={fp.title || 'Floor Plan'} fill className="object-contain" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{fp.title || 'Architectural Floor Plan'}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Gallery Section */}
        {galleryItems.length > 0 && (
          <section id="gallery" className="scroll-mt-36 space-y-6 border-b border-slate-800 pb-16">
            <h2 className="font-serif text-3xl font-bold text-white">Project Photo Gallery</h2>
            <GalleryLightbox items={galleryItems} />
          </section>
        )}

        {/* 10. Township Amenities (Centered Closed Preview -> Full Modal Popup) */}
        {amenities.length > 0 && (
          <ProjectAmenitiesPopup amenities={amenities} projectName={project.name} />
        )}

        {/* 11. Nearby Landmarks (Centered Closed Preview -> Full Modal Popup) */}
        {landmarks.length > 0 && (
          <ProjectLandmarksPopup landmarks={landmarks} projectName={project.name} />
        )}

        {/* 12. Project Location & Address (Centered Closed Preview -> Interactive Map Modal Popup) */}
        {(project.map_url || project.address) && (
          <ProjectLocationMapPopup
            projectName={project.name}
            address={project.address}
            mapUrl={project.map_url}
          />
        )}
      </div>

      {/* 13. Site-Visit CTA */}
      <SiteVisitCTASection
        heading={`Schedule a Chauffeured Site Visit to ${project.name}`}
        description="Select your preferred visit date. Our local team will pick you up and show you available plots and villas."
      />
    </div>
  );
}
