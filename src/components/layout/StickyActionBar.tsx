'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, Calendar, ChevronLeft, GripVertical } from 'lucide-react';
import { buildWhatsAppUrl, buildCallUrl } from '@/lib/utils/whatsapp';
import { trackConversionEvent } from '@/lib/utils/analytics';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';

export const StickyActionBar: React.FC = () => {
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [posY, setPosY] = useState<number | null>(null);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const initialPosY = useRef(0);

  // Set position asynchronously post-mount to comply with React compiler rules and match SSR HTML
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const animId = requestAnimationFrame(() => {
        setPosY(Math.max(100, Math.floor(window.innerHeight * 0.35)));
      });
      return () => cancelAnimationFrame(animId);
    }
  }, []);

  // Handle Dragging
  const handleDragStart = (clientY: number) => {
    isDragging.current = true;
    startY.current = clientY;
    initialPosY.current = posY ?? 200;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging.current) return;
    const deltaY = clientY - startY.current;
    const newY = initialPosY.current + deltaY;
    // Constrain Y position within safe vertical viewport bounds (80px top to innerHeight - 220px)
    const maxY = (typeof window !== 'undefined' ? window.innerHeight : 800) - 220;
    setPosY(Math.min(Math.max(80, newY), maxY));
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [posY]);

  return (
    <>
      {/* ── Desktop Right-Side Vertical Draggable Sticky Floating Action Dock ────── */}
      <aside
        aria-label="Re-positionable Quick Action Toolbar"
        style={{ top: posY !== null ? `${posY}px` : '35%' }}
        className="hidden md:flex fixed right-0 z-50 flex-col items-end pr-0 select-none transition-shadow duration-300"
      >
        <div className="bg-slate-900/90 border border-r-0 border-slate-700/80 rounded-l-2xl p-1.5 shadow-2xl backdrop-blur-xl flex flex-col items-end gap-2 group">
          {/* Drag Handle Bar (Icon Symbol Only) */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onTouchStart={(e) => e.touches[0] && handleDragStart(e.touches[0].clientY)}
            className="w-full flex items-center justify-center py-1.5 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 cursor-grab active:cursor-grabbing text-slate-400 hover:text-amber-400 transition-colors"
            title="Drag vertically to position anywhere on right side"
          >
            <GripVertical className="w-4 h-4 text-amber-400 opacity-80 hover:opacity-100" />
          </div>

          {/* 1. WhatsApp Button (Right Dock) */}
          <a
            href={buildWhatsAppUrl({ customMessage: 'Hi, I am interested in property details.' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversionEvent('whatsapp_clicked', { source: 'desktop_sticky_dock' })}
            className="w-full flex items-center justify-end bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition-all duration-300 hover:pl-4"
            title="Chat on WhatsApp"
          >
            <ChevronLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 mr-1 transition-opacity hidden group-hover:inline-block" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 text-xs font-bold tracking-wide">
              WhatsApp Us
            </span>
            <MessageSquare className="w-4 h-4 fill-current text-white shrink-0" />
          </a>

          {/* 2. Contact / Call Button (Right Dock) */}
          <a
            href={buildCallUrl()}
            onClick={() => trackConversionEvent('call_clicked', { source: 'desktop_sticky_dock' })}
            className="w-full flex items-center justify-end bg-slate-950 hover:bg-slate-900 text-white py-2.5 px-3 rounded-xl shadow-lg border border-slate-800 hover:border-amber-400/60 transition-all duration-300 hover:pl-4"
            title="Call Sales Advisor"
          >
            <ChevronLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 mr-1 transition-opacity hidden group-hover:inline-block text-amber-400" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 text-xs font-bold tracking-wide text-slate-100">
              Call Advisor
            </span>
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
          </a>

          {/* 3. Book Appointment / Site Visit (Right Dock) */}
          <button
            onClick={() => {
              trackConversionEvent('call_clicked', { source: 'desktop_sticky_dock' });
              setIsSiteVisitOpen(true);
            }}
            className="w-full flex items-center justify-end bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 px-3 rounded-xl shadow-lg shadow-amber-500/30 border border-amber-300 transition-all duration-300 hover:pl-4 cursor-pointer font-extrabold"
            title="Book Free Site Visit"
          >
            <ChevronLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 mr-1 transition-opacity hidden group-hover:inline-block" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 text-xs font-extrabold tracking-wide">
              Book Appointment
            </span>
            <Calendar className="w-4 h-4 text-slate-950 shrink-0 font-extrabold" />
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Sticky Action Bar ────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f2e21] border-t border-amber-500/30 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-lg">
        <a
          href={buildCallUrl()}
          onClick={() => trackConversionEvent('call_clicked', { source: 'mobile_sticky_bar' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-100 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call</span>
        </a>

        <a
          href={buildWhatsAppUrl({ customMessage: 'Hi, I am interested in property details.' })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversionEvent('whatsapp_clicked', { source: 'mobile_sticky_bar' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => setIsSiteVisitOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold active:scale-95 transition-transform cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>
      </div>

      {/* Quick Site Visit Dialog */}
      <Dialog
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        title="Book Free Chauffeured Site Visit"
        description="Pick-up and drop facility available across Namakkal and Paramathi Velur."
      >
        <SiteVisitForm onSuccess={() => setIsSiteVisitOpen(false)} />
      </Dialog>
    </>
  );
};
