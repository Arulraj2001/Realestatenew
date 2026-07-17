'use client';
// Force HMR refresh for client social icons

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, Clock, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { submitContactEnquiryAction } from '@/app/actions/enquiries';
import { useToast } from '@/components/ui/toast';
import { SocialLinks } from '@/lib/data/settings';

export interface FooterProps {
  socialLinks?: SocialLinks | null;
}

export const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fbUrl = socialLinks?.facebook || 'https://facebook.com/yourchoiceproperties';
  const instaUrl = socialLinks?.instagram || 'https://instagram.com/yourchoiceproperties';
  const ytUrl = socialLinks?.youtube || 'https://youtube.com/@yourchoiceproperties';

  const primeLocations = [
    { name: 'Namakkal Layouts', slug: 'namakkal', status: 'current' },
    { name: 'Paramathi Velur Layouts', slug: 'paramathi-velur', status: 'current' },
    { name: 'Salem Hub (Coming Soon)', slug: 'salem', status: 'upcoming' },
  ];

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({ type: 'error', title: 'Missing Info', message: 'Please provide both your Name and Mobile Number.' });
      return;
    }

    setIsSubmitting(true);
    const res = await submitContactEnquiryAction({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      consent: true,
      source_page: typeof window !== 'undefined' ? window.location.pathname + ' (Footer Form)' : '/footer',
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      setFormData({ name: '', phone: '' });
      toast({ type: 'success', title: 'Enquiry Sent', message: 'Our team will call you back shortly.' });
    } else {
      toast({ type: 'error', title: 'Submission Error', message: res.error || 'Failed to submit enquiry.' });
    }
  };

  return (
    <footer className="bg-[#091b13] text-slate-300 border-t border-emerald-950 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-emerald-900/40">
          {/* Col 1: Brand & Social Links */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              {/* Logo with blue curved border ring */}
              <div className="relative w-11 h-11 rounded-full p-[2.5px] bg-gradient-to-br from-[#1da1f2] via-[#0e87d4] to-[#1da1f2] shadow-lg shadow-blue-500/30">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Your Choice Properties Logo" className="w-8 h-8 object-contain" />
                </div>
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

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Connect With Us</p>
              <div className="flex items-center gap-3">
                {instaUrl && (
                  <a
                    href={instaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    className="text-[#E4405F] hover:opacity-80 transition-opacity"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
                {fbUrl && (
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    className="text-[#1877F2] hover:opacity-80 transition-opacity"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}
                {ytUrl && (
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe on YouTube"
                    className="text-[#FF0000] hover:opacity-80 transition-opacity"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { name: 'Home', path: '/' },
                { name: 'Locations', path: '/locations' },
                { name: 'Projects', path: '/projects' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Services', path: '/services' },
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact Us', path: '/contact-us' },
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

          {/* Col 3: Prime Locations */}
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

          {/* Col 4: Get in Touch */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-all">{siteConfig.contact.email}</span>
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

          {/* Col 5: Next to Get in Touch — Quick Contact Form */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Contact Us
            </h4>

            {isSubmitted ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Message Received!</p>
                <p className="text-[10px] text-slate-300">We will call you back shortly.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] text-amber-400 hover:underline pt-1 block mx-auto font-semibold"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleFooterSubmit} className="space-y-2">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs footer-input-l-shape"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile No"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs footer-input-l-shape"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
                </button>
              </form>
            )}
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
