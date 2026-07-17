import React from 'react';
import { ShieldCheck, Road, Lock, Droplet, Sun, Trees, CheckCircle2 } from 'lucide-react';
import { Amenity } from '@/types/database';

export interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ amenities }) => {
  const getIcon = (key: string | null) => {
    switch (key) {
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      case 'road':
        return <Road className="w-6 h-6 text-emerald-400" />;
      case 'lock':
        return <Lock className="w-6 h-6 text-amber-500" />;
      case 'droplet':
        return <Droplet className="w-6 h-6 text-blue-400" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-amber-400" />;
      case 'trees':
        return <Trees className="w-6 h-6 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section className="py-10 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Modern Infrastructure
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Township Infrastructure & Amenities
          </h2>
          <p className="text-sm text-slate-400">
            Engineered to provide long-term residential comfort, safety, and seamless utility connectivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-amber-500/30 transition-colors"
            >
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                {getIcon(item.icon_key)}
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description || 'Designed and implemented to modern civic standards.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
