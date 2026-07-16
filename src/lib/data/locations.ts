import { createPublicClient } from '@/lib/supabase/server';
import { Location, Project } from '@/types/database';

export interface LocationWithCounts extends Location {
  projectCount: number;
  projects?: Project[];
}

const FALLBACK_LOCATIONS: LocationWithCounts[] = [
  {
    id: 'loc-1',
    name: 'Namakkal',
    slug: 'namakkal',
    short_description: 'Prime DTCP approved residential plots and commercial layout hubs in Namakkal.',
    full_description: 'Discover high-appreciation house sites, gated township plots, and commercial land opportunities strategically situated along key Namakkal highways.',
    hero_image_path: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    hero_video_path: null,
    address: 'Namakkal Highway Junction, Tamil Nadu 637001',
    latitude: 11.2189,
    longitude: 78.1674,
    map_url: 'https://maps.google.com/?q=Namakkal',
    display_order: 1,
    published: true,
    featured: true,
    location_status: 'current',
    show_in_navigation: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projectCount: 2,
  },
  {
    id: 'loc-2',
    name: 'Paramathi Velur',
    slug: 'paramathi-velur',
    short_description: 'Serene gated layout plots with Cauvery river proximity and blacktop roads in Paramathi Velur.',
    full_description: 'Paramathi Velur features calm green environments, close proximity to schools, hospitals, and major transport corridors.',
    hero_image_path: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    hero_video_path: null,
    address: 'Velur Main Road, Paramathi Velur, Tamil Nadu 637207',
    latitude: 11.1122,
    longitude: 78.0772,
    map_url: 'https://maps.google.com/?q=Paramathi+Velur',
    display_order: 2,
    published: true,
    featured: true,
    location_status: 'current',
    show_in_navigation: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    projectCount: 1,
  },
];

export async function getPublishedLocations(options?: {
  status?: 'current' | 'upcoming';
  navOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<LocationWithCounts[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('locations')
      .select('*, projects(*)')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (options?.status) {
      query = query.eq('location_status', options.status);
    }
    if (options?.navOnly) {
      query = query.eq('show_in_navigation', true);
    }
    if (options?.featuredOnly) {
      query = query.eq('featured', true);
    }

    const { data: rawLocations, error } = await query;

    if (error || !rawLocations || rawLocations.length === 0) {
      let filtered = FALLBACK_LOCATIONS;
      if (options?.status) filtered = filtered.filter((l) => l.location_status === options.status);
      if (options?.navOnly) filtered = filtered.filter((l) => l.show_in_navigation);
      if (options?.featuredOnly) filtered = filtered.filter((l) => l.featured);
      return filtered;
    }

    const locations = (rawLocations as unknown) as Array<Location & { projects: Project[] }>;

    return locations.map((loc) => ({
      ...loc,
      location_status: loc.location_status || 'current',
      show_in_navigation: loc.show_in_navigation ?? true,
      projectCount: Array.isArray(loc.projects) ? loc.projects.filter((p) => p.published).length : 0,
      projects: Array.isArray(loc.projects) ? loc.projects.filter((p) => p.published) : [],
    }));
  } catch {
    let filtered = FALLBACK_LOCATIONS;
    if (options?.status) filtered = filtered.filter((l) => l.location_status === options.status);
    if (options?.navOnly) filtered = filtered.filter((l) => l.show_in_navigation);
    if (options?.featuredOnly) filtered = filtered.filter((l) => l.featured);
    return filtered;
  }
}

export async function getNavLocations() {
  const allNavLocations = await getPublishedLocations({ navOnly: true });
  return {
    current: allNavLocations.filter((l) => l.location_status === 'current'),
    upcoming: allNavLocations.filter((l) => l.location_status === 'upcoming'),
  };
}

export async function getLocationBySlug(slug: string): Promise<LocationWithCounts | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*, projects(*)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_LOCATIONS.find((l) => l.slug === slug) || null;
    }

    const loc = data as Location & { projects: Project[] };
    return {
      ...loc,
      location_status: loc.location_status || 'current',
      show_in_navigation: loc.show_in_navigation ?? true,
      projectCount: Array.isArray(loc.projects) ? loc.projects.filter((p) => p.published).length : 0,
      projects: Array.isArray(loc.projects) ? loc.projects.filter((p) => p.published) : [],
    };
  } catch {
    return FALLBACK_LOCATIONS.find((l) => l.slug === slug) || null;
  }
}
