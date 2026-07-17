'use client';

import React, { useState } from 'react';
import { Building2, CheckCircle2, Maximize2, ShieldCheck, Road, Lock, Droplet, Sun, Trees } from 'lucide-react';
import { ProjectAmenity } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface ProjectAmenitiesPopupProps {
  amenities: ProjectAmenity[];
  projectName: string;
}

export const ProjectAmenitiesPopup: React.FC<ProjectAmenitiesPopupProps> = ({
  amenities,
  projectName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  return (
    <section id="amenities" className="scroll-mt-36 space-y-6 border-b border-slate-800 pb-16 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mx-auto">
          <Building2 className="w-3.5 h-3.5" /> Gated Layout Facilities
        </div>

        <h2 className="font-serif text-3xl font-bold text-white text-center">Township Amenities & Features</h2>

        {/* Centered Closed Preview Card */}
        <div
          onClick={() => setIsOpen(true)}
          className="group p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl hover:border-amber-500/50 cursor-pointer transition-all duration-300 space-y-5"
        >
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            {projectName} is equipped with planned blacktop roads, streetlights, 24/7 security, title deeds, and essential utilities.
          </p>

          {/* Quick Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {amenities.slice(0, 4).map((item) => (
              <span
                key={item.amenity_id}
                className="px-3 py-1 bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-semibold rounded-full flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                {item.amenity?.name}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                +{amenities.length - 4} More
              </span>
            )}
          </div>

          <div className="pt-2">
            <Button variant="gold" size="md" className="font-bold shadow-lg group-hover:scale-105 transition-all">
              <Maximize2 className="w-4 h-4 mr-2" /> Explore All Township Amenities
            </Button>
          </div>
        </div>
      </div>

      {/* Full Amenities Modal Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${projectName} — Township Amenities & Features`}
        description="Detailed list of all gated layout features and residential infrastructure."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {amenities.map((item) => {
            const getIcon = (key: string | null) => {
              switch (key) {
                case 'shield-check':
                  return <ShieldCheck className="w-4 h-4 text-amber-400" />;
                case 'road':
                  return <Road className="w-4 h-4 text-emerald-400" />;
                case 'lock':
                  return <Lock className="w-4 h-4 text-amber-500" />;
                case 'droplet':
                  return <Droplet className="w-4 h-4 text-blue-400" />;
                case 'sun':
                  return <Sun className="w-4 h-4 text-amber-400" />;
                case 'trees':
                  return <Trees className="w-4 h-4 text-emerald-400" />;
                default:
                  return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
              }
            };
            return (
              <div
                key={item.amenity_id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.amenity?.icon_key || null)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.amenity?.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.custom_description || item.amenity?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
    </section>
  );
};
