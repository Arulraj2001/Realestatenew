import React from 'react';
import { FileCheck, MapPin, Car, Landmark } from 'lucide-react';

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface WhyChooseUsSectionProps {
  items?: WhyChooseUsItem[];
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ items }) => {
  const defaultItems: WhyChooseUsItem[] = [
    {
      title: 'Clear Documentation',
      description: 'We explain the available property documents clearly before booking.',
    },
    {
      title: 'Good Locations',
      description: 'Our projects are placed near useful roads, schools, hospitals and growing areas.',
    },
    {
      title: 'Site-Visit Support',
      description: 'Our team helps you visit and compare the projects before deciding.',
    },
    {
      title: 'Loan Guidance',
      description: 'We guide eligible buyers in understanding available home-loan options.',
    },
  ];

  const list = items && items.length > 0 ? items.slice(0, 4) : defaultItems;

  const icons = [
    <FileCheck key="1" className="w-5 h-5 text-amber-400" />,
    <MapPin key="2" className="w-5 h-5 text-emerald-400" />,
    <Car key="3" className="w-5 h-5 text-blue-400" />,
    <Landmark key="4" className="w-5 h-5 text-amber-500" />,
  ];

  return (
    <section className="py-10 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Why Choose Us</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Honest Real Estate Guidance for Every Buyer
          </h2>
        </div>

        {/* Compact 4-Grid Item Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-amber-500/40 transition-all duration-300 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {icons[idx % icons.length]}
              </div>
              <h3 className="font-serif font-bold text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
