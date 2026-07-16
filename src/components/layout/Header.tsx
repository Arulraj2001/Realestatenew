'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Menu,
  Home,
  MapPin,
  Building2,
  Layers,
  PhoneCall,
  Info,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Camera,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/layout/ThemeProvider';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

export interface HeaderNavLocation {
  id: string;
  name: string;
  slug: string;
  location_status: 'current' | 'upcoming';
}

const DEFAULT_NAV_LOCATIONS: { current: HeaderNavLocation[]; upcoming: HeaderNavLocation[] } = {
  current: [
    { id: 'l1', name: 'Namakkal', slug: 'namakkal', location_status: 'current' },
    { id: 'l2', name: 'Paramathi Velur', slug: 'paramathi-velur', location_status: 'current' },
  ],
  upcoming: [
    { id: 'l3', name: 'Salem', slug: 'salem', location_status: 'upcoming' },
    { id: 'l4', name: 'Erode', slug: 'erode', location_status: 'upcoming' },
  ],
};

export interface HeaderProps {
  navLocations?: { current: HeaderNavLocation[]; upcoming: HeaderNavLocation[] };
}

export const Header: React.FC<HeaderProps> = ({ navLocations: navLocationsProp }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState(false);
  const [isMobileLocationsAccordionOpen, setIsMobileLocationsAccordionOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const navLocations = navLocationsProp ?? DEFAULT_NAV_LOCATIONS;

  return (
    <header className="sticky top-0 z-40 bg-[#0f2e21]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-[#0b2218] text-xs py-1.5 px-4 text-emerald-300 border-b border-emerald-950 flex justify-between items-center max-w-7xl mx-auto">
        <p className="truncate">
          ✨ DTCP & RERA Approved Residential Plots & Luxury Villas in Namakkal & Paramathi Velur
        </p>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3 text-amber-400" /> {siteConfig.contact.phone}
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-serif font-bold text-slate-950 text-xl shadow-lg group-hover:bg-amber-400 transition-colors">
            Y
          </div>
          <div>
            <span className="font-serif font-bold text-lg md:text-xl text-white tracking-tight block leading-none">
              Your Choice
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-400 block mt-0.5">
              Properties
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links in Exact Requested Order */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            Home
          </Link>

          <Link href="/about-us" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            About Us
          </Link>

          {/* Locations Dropdown Menu */}
          <div
            className="relative group"
            onMouseEnter={() => setIsLocationsDropdownOpen(true)}
            onMouseLeave={() => setIsLocationsDropdownOpen(false)}
          >
            <Link
              href="/locations"
              className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors inline-flex items-center gap-1 py-4"
            >
              Locations <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            {/* Desktop Dropdown Flyout Panel */}
            {isLocationsDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/locations"
                  className="block px-3 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 rounded-xl transition-colors uppercase tracking-wider border-b border-slate-800"
                >
                  View All Locations →
                </Link>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-widest">Current Locations</span>
                  {navLocations.current.map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/locations/${loc.slug}`}
                      className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>

                {navLocations.upcoming.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-500 px-3 tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Coming Soon
                    </span>
                    {navLocations.upcoming.map((loc) => (
                      <Link
                        key={loc.id}
                        href={`/locations`}
                        className="block px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        {loc.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/projects" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            Projects
          </Link>

          <Link href="/gallery" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            Gallery
          </Link>

          <Link href="/services" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            Services
          </Link>

          <Link href="/contact-us" className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors">
            Schedule a Site Visit
          </Link>
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${siteConfig.contact.phone}`}>
            <Button variant="gold" size="sm" className="font-bold">
              <Phone className="w-3.5 h-3.5 mr-1" /> Contact Us
            </Button>
          </a>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-all duration-200 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-all duration-200 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-200 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/60 bg-slate-800/40"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Upgraded Full Mobile Drawer Navigation */}
      <Drawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} title="Menu Navigation">
        <div className="space-y-4 pt-2 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Home className="w-4 h-4 text-amber-400 shrink-0" /> Home
            </Link>

            <Link
              href="/about-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Info className="w-4 h-4 text-amber-400 shrink-0" /> About Us
            </Link>

            {/* Accordion inside mobile drawer for Locations */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg">
              <button
                onClick={() => setIsMobileLocationsAccordionOpen(!isMobileLocationsAccordionOpen)}
                className="w-full flex items-center justify-between p-3.5 text-slate-100 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <span className="flex items-center gap-3.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" /> Township Locations
                </span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${isMobileLocationsAccordionOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileLocationsAccordionOpen && (
                <div className="p-3 pt-0 space-y-2 border-t border-slate-800/80 bg-slate-900/60">
                  <Link
                    href="/locations"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-xs font-bold text-amber-400 hover:underline uppercase tracking-wider border-b border-slate-800/80"
                  >
                    View All Layout Hubs →
                  </Link>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-widest block mb-1">Current Locations</span>
                    {navLocations.current.map((loc) => (
                      <Link
                        key={loc.id}
                        href={`/locations/${loc.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-3 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800/80 rounded-xl font-semibold transition-colors"
                      >
                        <span>• {loc.name}</span>
                        <ArrowRight className="w-3 h-3 text-amber-500" />
                      </Link>
                    ))}
                  </div>

                  {navLocations.upcoming.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-amber-500 px-3 tracking-widest block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Coming Soon
                      </span>
                      {navLocations.upcoming.map((loc) => (
                        <Link
                          key={loc.id}
                          href="/locations"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 px-3 text-xs text-slate-400 hover:text-slate-200 rounded-xl font-medium"
                        >
                          • {loc.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" /> Projects
            </Link>

            <Link
              href="/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Camera className="w-4 h-4 text-amber-400 shrink-0" /> Photo Gallery
            </Link>

            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400 shrink-0" /> Services
            </Link>

            <Link
              href="/contact-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" /> Schedule a Site Visit
            </Link>
          </div>

          {/* Quick Action Touch Buttons at Bottom of Mobile Drawer */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <a href={`tel:${siteConfig.contact.phone}`} className="block">
              <Button variant="gold" size="md" className="w-full justify-center py-3 text-xs font-bold">
                <Phone className="w-4 h-4 mr-2" /> Direct Phone Call ({siteConfig.contact.phone})
              </Button>
            </a>

            <a
              href={buildWhatsAppUrl({
                customMessage: 'Hi Your Choice Properties, I am reaching out from your website mobile menu.',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" size="md" className="w-full justify-center py-3 text-xs border-emerald-600/60 text-emerald-400 bg-slate-950 hover:bg-emerald-950 font-bold">
                <MessageSquare className="w-4 h-4 mr-2" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
