import React from 'react';
import { Metadata } from 'next';
import { getPublishedProjects, getPublishedLocations } from '@/lib/data';
import { FeaturedProjectsSection } from '@/components/public/FeaturedProjectsSection';
import { SearchFilterPanel } from '@/components/public/SearchFilterPanel';
import { PropertyStatus, PropertyType } from '@/types/database';

export const metadata: Metadata = {
  title: 'Our Residential Projects | Your Choice Properties',
  description:
    'Explore our residential plots and villa projects in Namakkal and Paramathi Velur. Compare the location, available property types and project details before arranging a site visit.',
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
      {/* H1 & Overview Description Header */}
      <div className="max-w-7xl mx-auto border-b border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Layout Projects</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mt-1">
          Our Residential Projects
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Explore our residential plots and villa projects in Namakkal and Paramathi Velur. Compare the location, available property types and project details before arranging a site visit.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto">
        <SearchFilterPanel locations={locations} projects={projects} />
      </div>

      {/* Projects List Section */}
      <FeaturedProjectsSection projects={projects} />
    </div>
  );
}
