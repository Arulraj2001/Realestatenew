import React from 'react';

export interface StatItem {
  label: string;
  value: string;
}

export interface StatsSectionProps {
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { label: 'Years of Trust', value: '12+' },
  { label: 'Happy Homeowners', value: '1,200+' },
  { label: 'DTCP Layouts Completed', value: '25+' },
  { label: 'Sq.Ft Developed', value: '1.5M+' },
];

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const list = stats && stats.length > 0 ? stats.slice(0, 4) : DEFAULT_STATS;

  return (
    <section className="py-12 bg-amber-500 text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-950/20">
          {list.map((stat, idx) => (
            <div key={idx} className="pt-4 md:pt-0">
              <span className="font-serif text-3xl sm:text-5xl font-extrabold block tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block mt-1 opacity-90">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
