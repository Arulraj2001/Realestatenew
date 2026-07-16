import { createPublicClient } from '@/lib/supabase/server';
import { SiteSetting } from '@/types/database';
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
