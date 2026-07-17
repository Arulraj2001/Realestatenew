import React from 'react';
import { Metadata } from 'next';
import {
  getPublishedLocations,
  getPublishedProjects,
  getPublishedGalleryItems,
  getContentPage,
} from '@/lib/data';
import { getTestimonials, getHomepageStats } from '@/lib/data/settings';
import { generateHomePageMetadata, getHomePageJsonLd } from '@/lib/seo/metadata';

import { HeroSection } from '@/components/public/HeroSection';
import { LocationCardsSection } from '@/components/public/LocationCardsSection';
import { CompanyIntroSection } from '@/components/public/CompanyIntroSection';
import { StatsSection } from '@/components/public/StatsSection';
import { FeaturedProjectsSection } from '@/components/public/FeaturedProjectsSection';
import { WhyChooseUsSection, WhyChooseUsItem } from '@/components/public/WhyChooseUsSection';
import { GalleryPreviewSection } from '@/components/public/GalleryPreviewSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export async function generateMetadata(): Promise<Metadata> {
  return await generateHomePageMetadata();
}

export default async function HomePage() {
  // Fetch dynamic content and records from data access layer
  const [locations, projects, galleryItems, homeContent, testimonials, siteStats] = await Promise.all([
    getPublishedLocations({ featuredOnly: true }),
    getPublishedProjects({ featuredOnly: true }),
    getPublishedGalleryItems({ featuredOnly: true }),
    getContentPage('home'),
    getTestimonials(),
    getHomepageStats(),
  ]);

  const jsonLd = getHomePageJsonLd();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentJson = (homeContent?.content as Record<string, any>) || {};

  // Stats priority: content_pages.stats_list → site_settings.homepage_stats → component defaults
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedStats: any[] | undefined =
    Array.isArray(contentJson.stats_list) && contentJson.stats_list.length > 0
      ? contentJson.stats_list
      : siteStats ?? undefined;

  return (
    <>
      {/* Organization / WebSite Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-0">
        {/* 1. Hero with Background Video/Image & Admin Opacity Controls */}
        <HeroSection
          heroEnabled={contentJson.hero_enabled !== false}
          heroTitle={contentJson.hero_h1 || contentJson.hero_title}
          heroDescription={contentJson.hero_description || contentJson.hero_subtitle}
          primaryCtaLabel={contentJson.primary_cta_label}
          primaryCtaLink={contentJson.primary_cta_link}
          secondaryCtaLabel={contentJson.secondary_cta_label}
          mediaType={contentJson.hero_media_type || 'image'}
          desktopVideo={contentJson.desktop_video}
          mobileVideo={contentJson.mobile_video}
          desktopImage={contentJson.desktop_image}
          mobileImage={contentJson.mobile_image}
          posterImage={contentJson.poster_image}
          overlayOpacity={contentJson.overlay_opacity !== undefined ? Number(contentJson.overlay_opacity) : 70}
          heroBlur={contentJson.hero_blur !== undefined ? Number(contentJson.hero_blur) : 0}
          textAlignment={contentJson.text_alignment || 'center'}
        />

        {/* 2. Two Central Location-Selection Cards (Overlapping Hero Lower Area) */}
        <LocationCardsSection locations={locations} />

        {/* 3. Short Company Introduction Section */}
        <CompanyIntroSection
          introHeading={contentJson.intro_h2}
          introContent={contentJson.intro_content}
        />

        {/* Key Statistics Highlights */}
        <StatsSection
          stats={resolvedStats}
          isVisible={contentJson.stats_visible !== false}
        />

        {/* 4. Featured Projects (Rasi Garden, Kongu Nagar, Kongu Garden) */}
        <FeaturedProjectsSection projects={projects} />

        {/* 5. Small Compact Why Choose Us Section */}
        <WhyChooseUsSection items={contentJson.why_choose_us_items as WhyChooseUsItem[]} />

        {/* 6. Gallery Preview Section */}
        <GalleryPreviewSection
          galleryItems={galleryItems}
          heading={contentJson.gallery_heading}
          description={contentJson.gallery_description}
          ctaLabel={contentJson.gallery_cta}
        />

        {/* 7. Testimonials Scrolling Ticker */}
        <TestimonialsSection testimonials={testimonials ?? undefined} />

        {/* 8. Final Site-Visit CTA Section */}
        <SiteVisitCTASection
          heading={contentJson.final_cta_heading}
          description={contentJson.final_cta_description}
        />
      </div>
    </>
  );
}
