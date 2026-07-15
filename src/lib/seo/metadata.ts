import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/config/site';
import { SEOMetadata } from '@/types/database';

export async function generateHomePageMetadata(): Promise<Metadata> {
  let metaTitle = siteConfig.title;
  let metaDescription = siteConfig.description;
  let ogImage = `${siteConfig.domain}/og-image.jpg`;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('seo_metadata')
      .select('*')
      .eq('entity_type', 'page')
      .filter('entity_id', 'is', null)
      .maybeSingle();

    const seoRecord = data as SEOMetadata | null;

    if (seoRecord) {
      metaTitle = seoRecord.meta_title || metaTitle;
      metaDescription = seoRecord.meta_description || metaDescription;
      ogImage = seoRecord.open_graph_image_path || ogImage;
    }
  } catch {
    // Fallback to siteConfig baseline
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: siteConfig.domain,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteConfig.domain,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export function getHomePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/logo.png`,
    description: siteConfig.description,
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
    sameAs: [
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram,
    ].filter(Boolean),
  };
}
