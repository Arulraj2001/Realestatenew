import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  ShieldCheck,
  ChevronRight,
  Navigation,
  Compass,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  getProjectBySlug,
  getPublishedProjects,
  getProjectAmenities,
  getProjectLandmarks,
} from '@/lib/data';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/ui/badge';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export interface ProjectDetailPageProps {
  params: Promise<{
    projectSlug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((proj) => ({
    projectSlug: proj.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.name} | Gated Community Layout in ${project.location?.name || 'Namakkal'}`,
    description:
      project.short_description ||
      `Explore DTCP approved plots and villas at ${project.name} in ${project.location?.name || 'Namakkal'}.`,
    alternates: {
      canonical: `${siteConfig.domain}/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} | ${siteConfig.name}`,
      description: project.short_description || undefined,
      url: `${siteConfig.domain}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project) {
    notFound();
  }

  const [amenities, landmarks] = await Promise.all([
    getProjectAmenities(project.id),
    getProjectLandmarks(project.id),
  ]);

  const fallbackImage =
    project.hero_image_path ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

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
        name: 'Projects',
        item: `${siteConfig.domain}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.name,
        item: `${siteConfig.domain}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Project Hero Header */}
        <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image src={fallbackImage} alt={project.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/projects" className="hover:text-amber-400 transition-colors">
                Projects
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">{project.name}</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="gold">{project.project_status}</Badge>
              {project.approval_type && (
                <Badge variant="emerald">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {project.approval_type}
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>{project.address || project.location?.name || 'Namakkal, Tamil Nadu'}</span>
            </div>
          </div>
        </section>

        {/* Quick Facts Bar */}
        <section className="bg-slate-900 border-b border-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x divide-slate-800/80">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Status</span>
              <span className="font-bold text-slate-100 text-sm">{project.project_status}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Total Plots</span>
              <span className="font-bold text-slate-100 text-sm">{project.total_plots || 30}+ Units</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Approvals</span>
              <span className="font-bold text-emerald-400 text-sm">{project.approval_type || 'DTCP Approved'}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Starting Price</span>
              <span className="font-bold text-amber-400 text-sm">
                {project.starting_price ? `₹${(project.starting_price / 100000).toFixed(2)} Lakhs*` : 'On Request'}
              </span>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-6 h-6 text-amber-400" />
                Project Overview & Specifications
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.full_description || project.short_description ||
                  `${project.name} is a premier residential layout offering clear legal titles, wide blacktop roads, underground water lines, and electricity connections.`}
              </p>
            </div>

            {/* Side Brochure & Inquiry Card */}
            <div className="lg:col-span-4">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 sticky top-24">
                <h3 className="font-serif font-bold text-xl text-white">Project Highlights</h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold text-slate-100">{project.location?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Approval No.</span>
                    <span className="font-semibold text-emerald-400">{project.approval_number || 'Cleared'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Total Villas</span>
                    <span className="font-semibold text-slate-100">{project.total_villas || 12} Units</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in receiving brochure details for ${project.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  Download Master Layout Brochure
                </a>
              </div>
            </div>
          </div>

          {/* Property Configurations Table */}
          {project.property_configurations && project.property_configurations.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Compass className="w-6 h-6 text-amber-400" />
                Property Types & Configurations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.property_configurations.map((config) => (
                  <div key={config.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-amber-400">{config.property_type}</span>
                      <Badge variant="emerald">{config.availability_status}</Badge>
                    </div>
                    <h3 className="font-serif font-bold text-white text-lg">{config.name}</h3>
                    <p className="text-xs text-slate-400">{config.short_description || 'Vasthu compliant villa plot design.'}</p>
                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Area: {config.plot_area || config.built_up_area || 'Standard'}</span>
                      <Link href={`/properties/${config.slug}`} className="text-amber-400 hover:underline font-semibold">
                        View Specs →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Section */}
          {amenities.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Township Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((item) => (
                  <div key={item.amenity_id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.amenity?.name || 'Amenity'}</h4>
                      {item.custom_description && (
                        <p className="text-[11px] text-slate-400">{item.custom_description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Landmarks */}
          {landmarks.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Navigation className="w-6 h-6 text-amber-400" />
                Nearby Key Landmarks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {landmarks.map((l) => (
                  <div key={l.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{l.name}</span>
                    <Badge variant="slate">{l.distance_label}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Embedded Map */}
          {project.map_url && (
            <div className="space-y-6 pt-8 border-t border-slate-800">
              <h2 className="font-serif text-2xl font-bold text-white">Project Location Map</h2>
              <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <iframe
                  src={project.map_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </section>

        <SiteVisitCTASection />
      </div>
    </>
  );
}
