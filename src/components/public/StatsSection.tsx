'use client';

import React from 'react';
import { Award, Building2, Users, Maximize, Home } from 'lucide-react';

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface StatsSectionProps {
  stats?: StatItem[];
  isVisible?: boolean;
}

const DEFAULT_STATS: StatItem[] = [
  { label: 'Years of Experience', value: '13+', icon: 'Award' },
  { label: 'Successful Projects', value: '5', icon: 'Building2' },
  { label: 'Happy Customers', value: '135+', icon: 'Users' },
  { label: 'Plots Sold', value: '120+', icon: 'Maximize' },
  { label: 'Villas Sold', value: '15+', icon: 'Home' },
];

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, isVisible = true }) => {
  if (!isVisible) return null;

  const list = stats && stats.length > 0 ? stats : DEFAULT_STATS;

  const iconMap: Record<string, React.ReactNode> = {
    Award: <Award className="w-5 h-5 text-amber-400" />,
    Building2: <Building2 className="w-5 h-5 text-emerald-400" />,
    Users: <Users className="w-5 h-5 text-blue-400" />,
    Maximize: <Maximize className="w-5 h-5 text-amber-500" />,
    Home: <Home className="w-5 h-5 text-emerald-500" />,
  };

  return (
    <section className="relative py-12 bg-slate-900/80 border-y border-slate-800/80 overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {list.map((stat, idx) => (
            <div
              key={idx}
              className="group p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg hover:border-amber-500/40 transition-all duration-300 flex flex-col items-center text-center space-y-2 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {iconMap[stat.icon || 'Award'] || <Award className="w-5 h-5 text-amber-400" />}
              </div>

              <span className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-amber-400 group-hover:text-amber-300 transition-colors">
                {stat.value}
              </span>

              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-300 tracking-wider leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
