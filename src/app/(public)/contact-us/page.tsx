import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageSquare, ChevronRight, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getFAQs } from '@/lib/data';
import { ContactForm } from '@/components/forms/ContactForm';
import { FAQSection } from '@/components/public/FAQSection';
import { createAdminClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Contact Us | Office Location & Phone Inquiries',
  description:
    'Get in touch with Your Choice Properties. Call +91 98765 43210 or visit our main office in Namakkal, Tamil Nadu.',
  alternates: {
    canonical: `${siteConfig.domain}/contact-us`,
  },
};

export default async function ContactUsPage() {
  const faqs = await getFAQs();

  // Load live contact info (map_url) from DB
  const supabase = await createAdminClient();
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('key', 'contact_info')
    .single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contactInfo = ((settingsData as any)?.value as Record<string, string>) || {};
  const mapUrl = contactInfo.map_url || null;

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    image: `${siteConfig.domain}/logo.png`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Road',
      addressLocality: 'Namakkal',
      addressRegion: 'Tamil Nadu',
      postalCode: '637001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.2189,
      longitude: 78.1674,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '20:00',
    },
    priceRange: '₹₹₹',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: `${siteConfig.domain}/contact-us`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Banner Header */}
        <section className="py-6 sm:py-8 bg-slate-900 border-b border-slate-800 hero-dark-overlay">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Contact Us</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Contact Us
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              We are here to assist you with layout site visits, pricing breakdowns, and title verification.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-white">Headquarters & Office</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visit our office or call us to schedule an exclusive guided layout site visit.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm">Office Address</h3>
                    <p className="text-sm sm:text-base text-slate-200 mt-1">{siteConfig.contact.address}</p>
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block group"
                        aria-label="Open office location in Google Maps"
                      >
                        <div className="w-full bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-700 group-hover:border-amber-400 group-hover:bg-slate-700 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                            View on Google Maps
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Phone className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Phone Hotline</h3>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-sm sm:text-base font-bold text-amber-400 hover:underline mt-1 block">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">WhatsApp Assistance</h3>
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-emerald-400 hover:underline mt-1 block"
                    >
                      Chat on WhatsApp ({siteConfig.contact.whatsapp})
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Mail className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Email Inbox</h3>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-sm sm:text-base text-slate-200 hover:underline mt-1 block">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Working Hours</h3>
                    <p className="text-sm sm:text-base text-slate-200 mt-1">Monday - Sunday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs ?? undefined} />
      </div>
    </>
  );
}
