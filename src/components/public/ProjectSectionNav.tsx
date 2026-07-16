'use client';

import React, { useState } from 'react';

export interface NavSectionItem {
  id: string;
  label: string;
}

export interface ProjectSectionNavProps {
  sections: NavSectionItem[];
}

export const ProjectSectionNav: React.FC<ProjectSectionNavProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id || 'overview');

  if (sections.length === 0) return null;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    setActiveId(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-slate-900/90 backdrop-blur-xl border-y border-slate-800 py-3 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Mobile Dropdown Select */}
        <div className="w-full sm:hidden flex items-center gap-2">
          <label htmlFor="mobile-project-nav" className="text-xs font-bold text-amber-400 shrink-0">
            Explore This Project:
          </label>
          <select
            id="mobile-project-nav"
            value={activeId}
            onChange={handleSelectChange}
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2 font-medium"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Horizontal Tabs */}
        <nav className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabClick(sec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
