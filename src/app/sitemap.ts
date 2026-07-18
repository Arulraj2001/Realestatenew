import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import {
  getPublishedLocations,
  getPublishedProjects,
  getPublishedConfigurations,
} from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { SEOMetadata } from '@/types/database';

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency'];

/** Fetch all seo_metadata rows that have an entity_id (i.e. per-entity overrides). */
async function getSitemapOverrides(): Promise<Map<string, SEOMetadata>> {
  try {
    const supabase = await createClient();
    const result = await supabase
      .from('seo_metadata')
      .select('entity_id, index_enabled, sitemap_priority, sitemap_change_frequency')
      .not('entity_id', 'is', null);

    const rows = (result.data ?? []) as Array<Pick<SEOMetadata, 'entity_id' | 'index_enabled' | 'sitemap_priority' | 'sitemap_change_frequency'>>;
    const map = new Map<string, SEOMetadata>();
    for (const row of rows) {
      if (row.entity_id) map.set(row.entity_id, row as SEOMetadata);
    }
    return map;
  } catch {
    return new Map();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domain;

  // Static routes — always included, hardcoded priority
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,                                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/locations`,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/projects`,                               lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/properties`,                             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/plots-for-sale-in-namakkal`,             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/dtcp-approved-plots-in-paramathi-velur`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/villas-for-sale-in-namakkal`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/about-us`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/gallery`,                                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/contact-us`,                             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`,                         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`,                   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const [locations, projects, properties, overrides] = await Promise.all([
    getPublishedLocations(),
    getPublishedProjects(),
    getPublishedConfigurations(),
    getSitemapOverrides(),
  ]);

  // Helper: apply DB override for priority/frequency, skip if index_enabled=false
  function applyOverride(
    entityId: string,
    defaults: { changeFrequency: ChangeFreq; priority: number },
    lastModified: Date,
    url: string,
  ): MetadataRoute.Sitemap[number] | null {
    const ov = overrides.get(entityId);
    // Excluded by admin
    if (ov && ov.index_enabled === false) return null;
    return {
      url,
      lastModified,
      changeFrequency: (ov?.sitemap_change_frequency as ChangeFreq) ?? defaults.changeFrequency,
      priority: ov?.sitemap_priority ?? defaults.priority,
    };
  }

  const locationRoutes: MetadataRoute.Sitemap = locations
    .map((loc) =>
      applyOverride(
        loc.id,
        { changeFrequency: 'weekly', priority: 0.8 },
        new Date(loc.updated_at || loc.created_at),
        `${baseUrl}/locations/${loc.slug}`,
      ),
    )
    .filter(Boolean) as MetadataRoute.Sitemap;

  const projectRoutes: MetadataRoute.Sitemap = projects
    .map((proj) =>
      applyOverride(
        proj.id,
        { changeFrequency: 'daily', priority: 0.9 },
        new Date(proj.updated_at || proj.created_at),
        `${baseUrl}/projects/${proj.slug}`,
      ),
    )
    .filter(Boolean) as MetadataRoute.Sitemap;

  const hierarchicalProjectRoutes: MetadataRoute.Sitemap = [];
  for (const proj of projects) {
    const loc = locations.find((l) => l.id === proj.location_id);
    if (loc) {
      const route = applyOverride(
        proj.id,
        { changeFrequency: 'daily', priority: 0.9 },
        new Date(proj.updated_at || proj.created_at),
        `${baseUrl}/locations/${loc.slug}/${proj.slug}`,
      );
      if (route) hierarchicalProjectRoutes.push(route);
    }
  }

  const propertyRoutes: MetadataRoute.Sitemap = properties
    .map((prop) =>
      applyOverride(
        prop.id,
        { changeFrequency: 'weekly', priority: 0.8 },
        new Date(prop.updated_at || prop.created_at),
        `${baseUrl}/properties/${prop.slug}`,
      ),
    )
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...locationRoutes, ...projectRoutes, ...hierarchicalProjectRoutes, ...propertyRoutes];
}
