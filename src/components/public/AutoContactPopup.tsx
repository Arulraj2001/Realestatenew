'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { trackConversionEvent } from '@/lib/utils/analytics';

export const AutoContactPopup: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // controls CSS animation
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration-safe mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Auto-trigger after 4 seconds (once per session)
  useEffect(() => {
    if (!mounted) return;
    const alreadyShown = sessionStorage.getItem('auto_contact_popup_dismissed');
    if (alreadyShown) return;

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
      trackConversionEvent('call_clicked', { source: 'auto_contact_popup_arisen' });
      // Small delay so portal mounts before CSS transition fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    }, 4000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation to finish then unmount
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('auto_contact_popup_dismissed', 'true');
    }, 350);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop — fades in/out */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel — slides up from bottom on mobile, scales in on desktop */}
      <div
        className="relative w-full sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 sm:rounded-3xl shadow-2xl overflow-hidden z-10 transition-all duration-350 ease-out"
        style={{
          transform: isVisible
            ? 'translateY(0) scale(1)'
            : 'translateY(32px) scale(0.97)',
          opacity: isVisible ? 1 : 0,
          transitionDuration: '350ms',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          // On mobile round only top corners since it slides from bottom
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        // On sm+ override: fully rounded
        onTransitionEnd={undefined}
      >
        {/* Amber accent line on top */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-0">
          <div className="space-y-1 flex-1 pr-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> Contact Us
            </div>
            <h3 className="font-serif text-xl font-extrabold text-white leading-tight">
              Contact Us
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with our sales team · Quick response guaranteed
            </p>
          </div>
          <button
            onClick={handleClose}
            className="mt-0.5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 my-4 h-px bg-slate-800" />

        {/* Form */}
        <div className="px-6 pb-6 max-h-[75vh] overflow-y-auto">
          <SiteVisitForm
            onSuccess={() => {
              // Keep success state visible for a moment then close
              setTimeout(handleClose, 2200);
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
