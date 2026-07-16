'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShieldCheck,
  Landmark,
  FileCheck,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';

interface WhyChoiceItem {
  title: string;
  description: string;
}

interface WhyChooseUsDeckProps {
  whyItems: WhyChoiceItem[];
}

export const WhyChooseUsDeck: React.FC<WhyChooseUsDeckProps> = ({ whyItems }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalItems = whyItems.length;

  useEffect(() => {
    if (isPaused || totalItems <= 1) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 60) % 360);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, totalItems]);

  if (!whyItems || whyItems.length === 0) return null;

  // Base angles matching the hand-drawn drawing positions:
  // Card 0 (01): 210deg (top-left)
  // Card 1 (02): 270deg (top)
  // Card 2 (03): 330deg (right)
  // Card 3 (04): 30deg (bottom-right)
  // Card 4 (05): 90deg (bottom)
  // Card 5 (06): 150deg (bottom-left)
  const baseAngles = [210, 270, 330, 30, 90, 150];

  return (
    <div className="lg:col-span-8 w-full relative why-choose-carousel">
      {/* DESKTOP/TABLET VIEW: Circular rotating layout (Planets around Sun) */}
      <div 
        className="hidden md:flex items-center justify-center h-[540px] w-full relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Decorative Central Dial (The Sun) */}
        <div className="w-[180px] h-[180px] rounded-full bg-slate-900 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-4 z-10 shadow-2xl relative select-none">
          <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-xl animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 font-mono">
            Integrity
          </span>
          <span className="text-[11px] text-slate-400 font-medium leading-tight mt-1 px-2">
            Your Choice Values
          </span>
        </div>

        {/* Outer Circular Ring Track */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-800/40 pointer-events-none z-0" />

        {/* Continuous Orbiting Container (Planets Loop) */}
        <div className="absolute w-[440px] h-[440px] rounded-full pointer-events-none z-20 animate-orbit flex items-center justify-center">
          {whyItems.map((item, idx) => {
            const iconList = [
              <MapPin className="w-4 h-4 text-amber-400" key="1" />,
              <ShieldCheck className="w-4 h-4 text-emerald-400" key="2" />,
              <Landmark className="w-4 h-4 text-blue-400" key="3" />,
              <FileCheck className="w-4 h-4 text-amber-400" key="4" />,
              <TrendingUp className="w-4 h-4 text-emerald-400" key="5" />,
              <Users className="w-4 h-4 text-blue-400" key="6" />,
            ];

            const baseAngle = baseAngles[idx % baseAngles.length];

            return (
              <div
                key={idx}
                className="absolute w-[200px] h-[110px] flex items-center justify-center pointer-events-auto"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${baseAngle}deg) translate(220px) rotate(-${baseAngle}deg)`,
                }}
              >
                {/* Counter-rotating child elements keeps card contents upright */}
                <div className="animate-counter-orbit w-full h-full">
                  <div 
                    className="p-4 w-full h-full border rounded-2xl flex flex-col justify-between shadow-lg transition-all duration-300 group why-choose-carousel-card bg-slate-900 border-slate-800 dark:border-slate-800/80 hover:scale-[1.03]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg border flex items-center justify-center shadow-inner bg-slate-950 border-slate-800">
                        {iconList[idx % iconList.length]}
                      </div>
                      <span className="font-mono text-[10px] font-bold why-choose-number">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xs leading-tight line-clamp-1 why-choose-title">
                        {item.title}
                      </h3>

                      <p className="text-[10px] leading-snug mt-0.5 line-clamp-2 why-choose-desc">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VIEW: Clean 2-column grid fallback under 768px */}
      <div 
        className="flex md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {whyItems.map((item, idx) => {
          const iconList = [
            <MapPin className="w-4 h-4 text-amber-400" key="1" />,
            <ShieldCheck className="w-4 h-4 text-emerald-400" key="2" />,
            <Landmark className="w-4 h-4 text-blue-400" key="3" />,
            <FileCheck className="w-4 h-4 text-amber-400" key="4" />,
            <TrendingUp className="w-4 h-4 text-emerald-400" key="5" />,
            <Users className="w-4 h-4 text-blue-400" key="6" />,
          ];

          const mobileActiveIdx = Math.floor(rotationAngle / 60) % totalItems;
          const isHighlighted = idx === mobileActiveIdx;

          return (
            <div
              key={idx}
              className={`p-4 border rounded-2xl space-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group why-choose-carousel-card ${
                isHighlighted 
                  ? 'why-choose-active border-amber-500 shadow-md shadow-amber-500/10' 
                  : 'bg-slate-900 border-slate-800 dark:border-slate-800/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-inner ${
                    isHighlighted 
                      ? 'bg-amber-500/10 border-amber-500/20' 
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    {iconList[idx % iconList.length]}
                  </div>
                  <span className="font-mono text-[11px] font-bold why-choose-number">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base why-choose-title">
                  {item.title}
                </h3>

                <p className="text-xs leading-relaxed why-choose-desc">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
