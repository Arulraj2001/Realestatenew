'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { trackConversionEvent } from '@/lib/utils/analytics';

export const AutoContactPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if user has already seen or closed the popup during this browsing session
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('auto_contact_popup_dismissed');
      if (!alreadyShown) {
        // Trigger contact form popup automatically after 4 seconds (between 3 - 5 seconds)
        const timer = setTimeout(() => {
          setIsOpen(true);
          trackConversionEvent('call_clicked', { source: 'auto_contact_popup_arisen' });
        }, 4000);

        return () => clearTimeout(timer);
      }
    }
  }, [mounted]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auto_contact_popup_dismissed', 'true');
    }
  };

  if (!mounted) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Book Chauffeured Site Visit & Free Consultation"
      description="Connect with our sales advisors for layout maps, pricing sheets, and free chauffeured site visit arrangements in Namakkal & Paramathi Velur."
    >
      <SiteVisitForm
        onSuccess={() => {
          handleClose();
        }}
      />
    </Dialog>
  );
};
