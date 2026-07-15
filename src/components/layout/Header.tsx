'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Menu, Home, MapPin, Building2, Layers, PhoneCall, Info, Sun, Moon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/layout/ThemeProvider';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/locations', label: 'Locations', icon: <MapPin className="w-4 h-4" /> },
    { href: '/projects', label: 'Projects', icon: <Building2 className="w-4 h-4" /> },
    { href: '/services', label: 'Services', icon: <Layers className="w-4 h-4" /> },
    { href: '/about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <PhoneCall className="w-4 h-4" /> },
  ];

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
        {/* Brand */}
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

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-amber-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Your Choice Properties, I would like to inquire about properties.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="gold" size="sm">
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>WhatsApp</span>
            </Button>
          </a>
          <a href={`tel:${siteConfig.contact.phone}`}>
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Us</span>
            </Button>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-all duration-200 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile: Theme Toggle + Menu Trigger */}
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
            className="p-2 text-slate-200 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Navigation Menu"
        position="right"
      >
        <div className="flex flex-col gap-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-slate-950/60 rounded-xl text-slate-200 font-medium text-sm hover:text-amber-400 hover:bg-slate-800 transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button variant="gold" size="md" className="w-full">
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Chat on WhatsApp</span>
              </Button>
            </a>
            <a href={`tel:${siteConfig.contact.phone}`} className="w-full block">
              <Button variant="outline" size="md" className="w-full">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call {siteConfig.contact.phone}</span>
              </Button>
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
