import { createPublicClient } from '@/lib/supabase/server';
import { ContentPage, ContentPageKey } from '@/types/database';

const FALLBACK_PAGES: Record<ContentPageKey, ContentPage> = {
  home: {
    id: 'page-home',
    page_key: 'home',
    title: 'Your Choice Properties | Flagship Real Estate & Township Developer',
    slug: 'home',
    published: true,
    content: {
      hero_title: 'Build Your Legacy in Tamil Nadu’s Prime Layouts',
      hero_subtitle: 'DTCP & RERA approved residential plot townships and custom luxury villas in Namakkal & Paramathi Velur.',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  about: {
    id: 'page-about',
    page_key: 'about',
    title: 'About Your Choice Properties',
    slug: 'about-us',
    published: true,
    content: {
      heading: 'Tamil Nadu’s Preferred Real Estate Developer',
      body: 'With over 15+ years of real estate excellence, Your Choice Properties has developed over 25+ DTCP-approved gated community townships across Namakkal and Salem districts.',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  services: {
    id: 'page-services',
    page_key: 'services',
    title: 'Real Estate Services & Consultation',
    slug: 'services',
    published: true,
    content: {
      heading: 'End-to-End Real Estate Solutions',
      body: 'From plot purchase and legal document verification to chauffeured site visits and custom villa construction.',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  contact: {
    id: 'page-contact',
    page_key: 'contact',
    title: 'Contact Us | Your Choice Properties',
    slug: 'contact-us',
    published: true,
    content: {
      heading: 'Get in Touch with Our Real Estate Advisors',
      body: 'Visit our office in Namakkal or schedule a chauffeured site visit to view available plots.',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export async function getContentPage(pageKey: ContentPageKey): Promise<ContentPage | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('content_pages')
      .select('*')
      .eq('page_key', pageKey)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_PAGES[pageKey] || null;
    }

    return data;
  } catch {
    return FALLBACK_PAGES[pageKey] || null;
  }
}
