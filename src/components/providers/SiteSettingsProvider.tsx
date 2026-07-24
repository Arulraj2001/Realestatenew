'use client';

import React, { createContext, useContext } from 'react';
import type { ContactInfo, SocialLinks, GlobalAnnouncement } from '@/lib/data/settings';
import { siteConfig } from '@/config/site';

interface SiteSettingsContextValue {
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  announcement: GlobalAnnouncement;
  getWhatsAppUrl: (customMessage?: string, phoneOverride?: string) => string;
  getCallUrl: (phoneOverride?: string) => string;
}

const defaultContact: ContactInfo = {
  company_name: siteConfig.name || 'Your Choice Properties',
  phone: siteConfig.contact.phone || '+91 98427 22123',
  whatsapp: siteConfig.contact.whatsapp || '+919842722123',
  email: siteConfig.contact.email || 'info@yourchoiceproperties.in',
  address: siteConfig.contact.address || 'Main Road, Namakkal, Tamil Nadu - 637001',
  map_url: '',
  working_hours: 'Mon - Sun: 9:00 AM - 8:00 PM',
};

const defaultSocial: SocialLinks = {
  facebook: 'https://facebook.com/yourchoiceproperties',
  instagram: 'https://instagram.com/yourchoiceproperties',
  youtube: 'https://youtube.com/@yourchoiceproperties',
};

const defaultAnnouncement: GlobalAnnouncement = {
  enabled: true,
  running: true,
  message: '✨ DTCP & RERA Approved Residential Plots & Luxury Villas in Namakkal & Paramathi Velur',
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  contactInfo: defaultContact,
  socialLinks: defaultSocial,
  announcement: defaultAnnouncement,
  getWhatsAppUrl: () => `https://wa.me/${defaultContact.whatsapp?.replace(/[^0-9]/g, '')}`,
  getCallUrl: () => `tel:${defaultContact.phone?.replace(/[^0-[#\*\+0-9]/g, '')}`,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider: React.FC<{
  contactInfo?: ContactInfo | null;
  socialLinks?: SocialLinks | null;
  announcement?: GlobalAnnouncement | null;
  children: React.ReactNode;
}> = ({ contactInfo, socialLinks, announcement, children }) => {
  const mergedContact: ContactInfo = {
    company_name: contactInfo?.company_name || defaultContact.company_name,
    phone: contactInfo?.phone || defaultContact.phone,
    whatsapp: contactInfo?.whatsapp || defaultContact.whatsapp,
    email: contactInfo?.email || defaultContact.email,
    address: contactInfo?.address || defaultContact.address,
    map_url: contactInfo?.map_url || defaultContact.map_url,
    working_hours: contactInfo?.working_hours || defaultContact.working_hours,
  };

  const mergedSocial: SocialLinks = {
    facebook: socialLinks?.facebook || defaultSocial.facebook,
    instagram: socialLinks?.instagram || defaultSocial.instagram,
    youtube: socialLinks?.youtube || defaultSocial.youtube,
  };

  const mergedAnnouncement: GlobalAnnouncement = {
    enabled: announcement?.enabled !== false,
    running: announcement?.running !== false,
    message: announcement?.message || defaultAnnouncement.message,
  };

  const getWhatsAppUrl = (customMessage?: string, phoneOverride?: string) => {
    const rawNumber = phoneOverride || mergedContact.whatsapp || defaultContact.whatsapp;
    const number = (rawNumber || '').replace(/[^0-9]/g, '');
    const text = customMessage
      ? encodeURIComponent(customMessage)
      : encodeURIComponent('Hello Your Choice Properties, I would like to inquire about your plots and villas.');
    return `https://wa.me/${number}?text=${text}`;
  };

  const getCallUrl = (phoneOverride?: string) => {
    const rawNumber = phoneOverride || mergedContact.phone || defaultContact.phone;
    const number = (rawNumber || '').replace(/[^0-[#\*\+0-9]/g, '');
    return `tel:${number}`;
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        contactInfo: mergedContact,
        socialLinks: mergedSocial,
        announcement: mergedAnnouncement,
        getWhatsAppUrl,
        getCallUrl,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};
