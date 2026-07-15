'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, Home, SlidersHorizontal } from 'lucide-react';
import { Location, Project } from '@/types/database';
import { Button } from '@/components/ui/button';

export interface SearchFilterPanelProps {
  locations: Location[];
  projects: Project[];
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  locations,
  projects,
}) => {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBhk, setSelectedBhk] = useState<string>('');

  const filteredProjects = selectedLocation
    ? projects.filter((p) => p.location_id === selectedLocation)
    : projects;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedProject) params.set('project', selectedProject);
    if (selectedType) params.set('type', selectedType);
    if (selectedBhk) params.set('bhk', selectedBhk);

    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-12">
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Property Search & Filter</span>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setSelectedProject('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 focus:border-amber-500 outline-none"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 focus:border-amber-500 outline-none"
            >
              <option value="">All Projects</option>
              {filteredProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" /> Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 focus:border-amber-500 outline-none"
            >
              <option value="">All Types</option>
              <option value="Plot">Villa Plot</option>
              <option value="Villa">Independent Villa</option>
              <option value="Commercial">Commercial Plot</option>
            </select>
          </div>

          {/* BHK Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">BHK Bedrooms</label>
            <select
              value={selectedBhk}
              onChange={(e) => setSelectedBhk(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 focus:border-amber-500 outline-none"
            >
              <option value="">Any BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button type="submit" variant="gold" size="md" className="w-full h-10 font-bold">
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
