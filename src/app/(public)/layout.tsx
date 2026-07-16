import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyActionBar } from '@/components/layout/StickyActionBar';
import { AutoContactPopup } from '@/components/public/AutoContactPopup';
import { ToastProvider } from '@/components/ui/toast';
import { getNavLocations } from '@/lib/data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch nav locations from DB (falls back to defaults inside Header if DB unavailable)
  const navLocations = await getNavLocations();

  return (
    <ToastProvider>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg shadow-xl"
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <Header navLocations={navLocations} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyActionBar />
        <AutoContactPopup />
      </div>
    </ToastProvider>
  );
}
