import React from 'react';
import Link from 'next/link';
import { Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const Footer: React.FC = () => {
  const primeLocations = [
    { name: 'Namakkal Layouts', slug: 'namakkal', status: 'current' },
    { name: 'Paramathi Velur Layouts', slug: 'paramathi-velur', status: 'current' },
    { name: 'Salem Hub (Coming Soon)', slug: 'salem', status: 'upcoming' },
    { name: 'Erode Hub (Coming Soon)', slug: 'erode', status: 'upcoming' },
  ];

  return (
    <footer className="bg-[#091b13] text-slate-300 border-t border-emerald-950 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/40">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-serif font-bold text-slate-950 text-xl shadow-lg">
                Y
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white tracking-tight block leading-none">
                  Your Choice
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-400 block mt-0.5">
                  Properties
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier real estate developer in Tamil Nadu specializing in DTCP approved villa plots and high-appreciation residential gated layouts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { name: 'Home', path: '/' },
                { name: 'Locations', path: '/locations' },
                { name: 'Projects', path: '/projects' },
                { name: 'Services', path: '/services' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Hubs */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {primeLocations.map((loc) => (
                <li key={loc.slug}>
                  {loc.status === 'current' ? (
                    <Link href={`/locations/${loc.slug}`} className="hover:text-amber-400 transition-colors">
                      {loc.name}
                    </Link>
                  ) : (
                    <span className="text-slate-500">{loc.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.email}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.phone}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Mon - Sun: 9:00 AM - 7:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
