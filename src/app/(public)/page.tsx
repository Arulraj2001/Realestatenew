import React from 'react';
import { Metadata } from 'next';
import {
  getPublishedLocations,
  getPublishedProjects,
  getActiveAmenities,
  getPublishedGalleryItems,
  getContentPage,
} from '@/lib/data';
import { generateHomePageMetadata, getHomePageJsonLd } from '@/lib/seo/metadata';

import { HeroSection } from '@/components/public/HeroSection';
import { SearchFilterPanel } from '@/components/public/SearchFilterPanel';
import { LocationCardsSection } from '@/components/public/LocationCardsSection';
import { FeaturedProjectsSection } from '@/components/public/FeaturedProjectsSection';
import { PropertyTypeGrid } from '@/components/public/PropertyTypeGrid';
import { CompanyIntroSection } from '@/components/public/CompanyIntroSection';
import { WhyChooseUsSection } from '@/components/public/WhyChooseUsSection';
import { StatsSection } from '@/components/public/StatsSection';
import { AmenitiesSection } from '@/components/public/AmenitiesSection';
import { GalleryPreviewSection } from '@/components/public/GalleryPreviewSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { FAQSection } from '@/components/public/FAQSection';
import { SiteVisitCTASection } from '@/components/public/SiteVisitCTASection';

export async function generateMetadata(): Promise<Metadata> {
  return await generateHomePageMetadata();
}

export default async function HomePage() {
  // Fetch all dynamic data server-side
  const [locations, projects, amenities, galleryItems, homeContent] = await Promise.all([
    getPublishedLocations(),
    getPublishedProjects({ featuredOnly: true }),
    getActiveAmenities(),
    getPublishedGalleryItems({ featuredOnly: true }),
    getContentPage('home'),
  ]);

  const jsonLd = getHomePageJsonLd();

  const contentJson = (homeContent?.content as Record<string, string>) || {};

  return (
    <>
      {/* Organization / WebSite Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-0">
        {/* 1. Cinematic Hero */}
        <HeroSection
          heroTitle={contentJson.hero_title || homeContent?.title}
          heroSubtitle={contentJson.hero_subtitle}
        />

        {/* 2. Property Search Panel */}
        <SearchFilterPanel locations={locations} projects={projects} />

        {/* 3. Location Cards */}
        <LocationCardsSection locations={locations} />

        {/* 4. Featured Flagship Projects */}
        <FeaturedProjectsSection projects={projects} />

        {/* 5. Browse By Property Type */}
        <PropertyTypeGrid />

        {/* 6. Company Introduction */}
        <CompanyIntroSection
          heading={contentJson.heading as string}
          body={contentJson.body as string}
        />

        {/* 7. Why Choose Us */}
        <WhyChooseUsSection />

        {/* 8. Operational Statistics */}
        <StatsSection />

        {/* 9. Amenities & Infrastructure */}
        <AmenitiesSection amenities={amenities} />

        {/* 10. Visual Gallery Preview */}
        <GalleryPreviewSection galleryItems={galleryItems} />

        {/* 11. Testimonials */}
        <TestimonialsSection />

        {/* 12. Frequently Asked Questions */}
        <FAQSection />

        {/* 13. Site Visit Booking Call To Action */}
        <SiteVisitCTASection />
      </div>
    </>
  );
}
