import React from 'react';
import { Shield, MapPin, Truck, Landmark, Sparkles, PhoneCall } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const highlights = [
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: 'DTCP & RERA Compliant',
      description: 'Every layout plot has 100% government approval with clear linear layout mapping.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-400" />,
      title: 'Strategic High-Growth Hubs',
      description: 'Properties located within minutes of national highways, colleges, and bus terminals.',
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      title: 'Free Pickup & Drop Site Visits',
      description: 'Complimentary private vehicle pickup and drop for hassle-free site exploration.',
    },
    {
      icon: <Landmark className="w-6 h-6 text-blue-400" />,
      title: 'Instant Bank Loan Approval',
      description: 'Tie-ups with leading national banks (SBI, HDFC, Canara) for seamless housing loan support.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: 'Full Infrastructure Infrastructure',
      description: 'Equipped with heavy blacktop TAR roads, streetlights, drainage lines, and water connections.',
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-emerald-400" />,
      title: 'Dedicated Customer Advisory',
      description: 'Personalized guidance from layout selection to deed registration and custom construction.',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Why Partner With Us
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            The Your Choice Advantage
          </h2>
          <p className="text-sm text-slate-400">
            Uncompromising standards of quality, legal clarity, and customer-first property development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
