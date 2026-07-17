'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Road,
  Lock,
  Droplet,
  Trees,
  PenTool,
  Car,
  Home,
  Utensils,
  Compass,
  CheckCircle2,
  Sparkles,
  Pointer,
} from 'lucide-react';

interface AmenityItem {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const LocationAmenities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'land' | 'house'>('land');

  const landAmenities: AmenityItem[] = [
    {
      name: 'DTCP & RERA Approved',
      description: '100% legal title clearance and approved layout design records for secure resale value.',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
    },
    {
      name: '30ft & 40ft Blacktop Roads',
      description: 'Wide, heavy-duty asphalt avenues built to local municipal road specifications.',
      icon: <Road className="w-6 h-6 text-emerald-400" />,
    },
    {
      name: 'Gated Community Security',
      description: 'Fully secured perimeter wall fencing with grand entrance archway & security post.',
      icon: <Lock className="w-6 h-6 text-amber-500" />,
    },
    {
      name: 'Individual Water Taps',
      description: 'Concealed sweet groundwater lines routed to every single plot in the layout.',
      icon: <Droplet className="w-6 h-6 text-blue-400" />,
    },
    {
      name: 'Concealed Drainage System',
      description: 'Underground pipeline network for efficient wastewater and stormwater flow.',
      icon: <CheckCircle2 className="w-6 h-6 text-amber-400" />,
    },
    {
      name: 'Children Play Park & Trees',
      description: 'Lush landscaped green buffer zones, children play area, and tree-lined pathways.',
      icon: <Trees className="w-6 h-6 text-emerald-500" />,
    },
  ];

  const houseAmenities: AmenityItem[] = [
    {
      name: 'Architectural Customization',
      description: 'Work with our expert planners to customize 2BHK, 3BHK, or 4BHK floor plans.',
      icon: <PenTool className="w-6 h-6 text-amber-400" />,
    },
    {
      name: 'Covered Car Parking',
      description: 'Spacious portico designed for secure car parking and simple washing access.',
      icon: <Car className="w-6 h-6 text-emerald-400" />,
    },
    {
      name: 'Premium Woodwork & UPVC',
      description: 'Teakwood main frame & doors paired with weatherproof sliding UPVC windows.',
      icon: <Home className="w-6 h-6 text-amber-500" />,
    },
    {
      name: 'Modern Modular Kitchen',
      description: 'Equipped with heavy-duty granite slab counters, stainless sink, and exhaust provisions.',
      icon: <Utensils className="w-6 h-6 text-blue-400" />,
    },
    {
      name: 'Dedicated Water Storage',
      description: 'Individual overhead water storage tank and underground sump connections.',
      icon: <Droplet className="w-6 h-6 text-emerald-500" />,
    },
    {
      name: '100% Vaastu-Compliant',
      description: 'All construction strictly adheres to traditional Vaastu design principles for peace and prosperity.',
      icon: <Compass className="w-6 h-6 text-amber-400" />,
    },
  ];

  const currentAmenities = activeTab === 'land' ? landAmenities : houseAmenities;

  return (
    <section className="py-10 bg-slate-900 border-t border-slate-800 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Township Conveniences
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Premium Features &amp; Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            High-standard civil engineering, security, and utility connectivity customized for plots and homes.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl shadow-lg">
            <button
              onClick={() => setActiveTab('land')}
              className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'land'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50 animate-inactive-tab'
              }`}
            >
              <Trees className="w-4 h-4 shrink-0" />
              Land &amp; Plot Layout
              {activeTab !== 'land' && (
                <div className="absolute -top-4 -right-2 text-amber-500 light-theme:text-[#2596be] pointer-events-none z-20 animate-hand-click">
                  <Pointer className="w-4.5 h-4.5 rotate-[90deg] fill-current" />
                </div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('house')}
              className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'house'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50 animate-inactive-tab'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              Villas &amp; Houses
              {activeTab !== 'house' && (
                <div className="absolute -top-4 -right-2 text-amber-500 light-theme:text-[#2596be] pointer-events-none z-20 animate-hand-click">
                  <Pointer className="w-4.5 h-4.5 rotate-[90deg] fill-current" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAmenities.map((item, idx) => (
            <div
              key={idx}
              className="group p-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
