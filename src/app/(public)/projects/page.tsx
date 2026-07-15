import React from 'react';
import { Metadata } from 'next';
import { getPublishedProjects, getPublishedLocations } from '@/lib/data';
import { FeaturedProjectsSection } from '@/components/public/FeaturedProjectsSection';
import { SearchFilterPanel } from '@/components/public/SearchFilterPanel';
import { PropertyStatus, PropertyType } from '@/types/database';

export const metadata: Metadata = {
  title: 'All Projects & Townships | Your Choice Properties',
  description:
    'Browse DTCP and RERA approved plot layouts, gated communities, and luxury residential developments across Namakkal and Paramathi Velur.',
};

export interface ProjectsPageProps {
  searchParams: Promise<{
    location?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { location: locationFilter, status: statusFilter, type: typeFilter } = await searchParams;

  const [projects, locations] = await Promise.all([
    getPublishedProjects({
      locationId: locationFilter,
      status: statusFilter as PropertyStatus | undefined,
      propertyType: typeFilter as PropertyType | undefined,
    }),
    getPublishedLocations(),
  ]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Portfolio</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">
          Featured Townships & Gated Communities
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-2">
          Explore DTCP/RERA sanctioned house sites, premium plot developments, and luxury gated villas.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <SearchFilterPanel locations={locations} projects={projects} />
      </div>

      <FeaturedProjectsSection projects={projects} />
    </div>
  );
}
