import { createPublicClient } from '@/lib/supabase/server';
import { SiteSetting } from '@/types/database';
import { siteConfig } from '@/config/site';
import type { StatItem } from '@/components/public/StatsSection';
import type { TestimonialItem } from '@/components/public/TestimonialsSection';
import type { FAQItem } from '@/components/public/FAQSection';

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export interface ContactInfo {
  company_name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  map_url?: string;
  working_hours?: string;
}

/** Fetch contact info from site_settings['contact_info']. */
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const setting = await getSiteSetting('contact_info');
    if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
    return setting.value as ContactInfo;
  } catch {
    return null;
  }
}

export interface ContactInfoOptions {
  globalContact?: ContactInfo | null;
  location?: { phone?: string | null; whatsapp?: string | null } | null;
  project?: { phone?: string | null; whatsapp?: string | null } | null;
}

/** Resolve effective phone and whatsapp numbers following Hierarchy: Project -> Location -> Global Contact Info -> siteConfig */
export function resolveContactInfo(options?: ContactInfoOptions): ContactInfo {
  const global = options?.globalContact || {};
  const loc = options?.location || {};
  const proj = options?.project || {};

  const phone =
    proj.phone && proj.phone.trim() !== ''
      ? proj.phone
      : loc.phone && loc.phone.trim() !== ''
      ? loc.phone
      : global.phone && global.phone.trim() !== ''
      ? global.phone
      : siteConfig.contact.phone;

  const whatsapp =
    proj.whatsapp && proj.whatsapp.trim() !== ''
      ? proj.whatsapp
      : loc.whatsapp && loc.whatsapp.trim() !== ''
      ? loc.whatsapp
      : global.whatsapp && global.whatsapp.trim() !== ''
      ? global.whatsapp
      : siteConfig.contact.whatsapp;

  return {
    ...global,
    phone,
    whatsapp,
  };
}

/** Fetch homepage stats from site_settings['homepage_stats']. Returns null if not set (callers use their own defaults). */
export async function getHomepageStats(): Promise<StatItem[] | null> {
  try {
    const setting = await getSiteSetting('homepage_stats');
    if (!setting || !Array.isArray(setting.value)) return null;
    return (setting.value as unknown) as StatItem[];
  } catch {
    return null;
  }
}

/** Fetch testimonials from site_settings['testimonials']. Returns null if not set. */
export async function getTestimonials(): Promise<TestimonialItem[] | null> {
  try {
    const setting = await getSiteSetting('testimonials');
    if (!setting || !Array.isArray(setting.value)) return null;
    return (setting.value as unknown) as TestimonialItem[];
  } catch {
    return null;
  }
}

/** Fetch FAQs from site_settings['faqs']. Returns null if not set. */
export async function getFAQs(): Promise<FAQItem[] | null> {
  try {
    const setting = await getSiteSetting('faqs');
    if (!setting || !Array.isArray(setting.value)) return null;
    return (setting.value as unknown) as FAQItem[];
  } catch {
    return null;
  }
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

/** Fetch social links from site_settings['social_links']. Returns null if not set. */
export async function getSocialLinks(): Promise<SocialLinks | null> {
  try {
    const setting = await getSiteSetting('social_links');
    if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
    return setting.value as SocialLinks;
  } catch {
    return null;
  }
}

export interface IntegrationsSettings {
  google_search_console?: string;
  google_analytics?: string;
  google_tag_manager?: string;
  facebook_pixel?: string;
  microsoft_clarity?: string;
}

/** Fetch third-party integrations (console search, analytics, pixels) from site_settings['integrations']. */
export async function getIntegrationsSettings(): Promise<IntegrationsSettings | null> {
  try {
    const setting = await getSiteSetting('integrations');
    if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
    return setting.value as IntegrationsSettings;
  } catch {
    return null;
  }
}

export interface GlobalAnnouncement {
  enabled?: boolean;
  message?: string;
  running?: boolean;
}

/** Fetch global announcement settings from site_settings['global_announcement']. */
export async function getGlobalAnnouncement(): Promise<GlobalAnnouncement | null> {
  try {
    const setting = await getSiteSetting('global_announcement');
    if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
    return setting.value as GlobalAnnouncement;
  } catch {
    return null;
  }
}
