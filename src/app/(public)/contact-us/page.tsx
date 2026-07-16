import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getFAQs } from '@/lib/data';
import { ContactForm } from '@/components/forms/ContactForm';
import { FAQSection } from '@/components/public/FAQSection';

export const metadata: Metadata = {
  title: 'Schedule a Site Visit | Free Chauffeured Pickup & Consultation',
  description:
    'Schedule a free chauffeured site visit with Your Choice Properties. Explore DTCP approved residential villa plots & family homes in Namakkal & Paramathi Velur.',
  alternates: {
    canonical: `${siteConfig.domain}/contact-us`,
  },
};

export default async function ContactUsPage() {
  const faqs = await getFAQs();
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
        name: 'Schedule a Site Visit',
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
        <section className="py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400">Schedule a Site Visit</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Schedule a Site Visit
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Book a complimentary chauffeured layout site visit. Our local team will pick you up and guide you through available villa plots & house choices.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-white">Headquarters & Office</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visit our office or call us to schedule an exclusive chauffeured layout site visit.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Office Address</h3>
                    <p className="text-xs text-slate-300 mt-1">{siteConfig.contact.address}</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Phone className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Phone Hotline</h3>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-xs text-amber-400 hover:underline mt-1 block">
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
                      className="text-xs text-emerald-400 hover:underline mt-1 block"
                    >
                      Chat on WhatsApp ({siteConfig.contact.whatsapp})
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Mail className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Email Inbox</h3>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-xs text-slate-300 hover:underline mt-1 block">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4">
                  <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Working Hours</h3>
                    <p className="text-xs text-slate-300 mt-1">Monday - Sunday: 9:00 AM - 8:00 PM</p>
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
