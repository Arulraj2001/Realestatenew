import { createPublicClient } from '@/lib/supabase/server';
import { Project, PropertyType, PropertyStatus } from '@/types/database';

export interface ProjectFilters {
  locationId?: string;
  locationSlug?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  featuredOnly?: boolean;
  limit?: number;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    location_id: 'loc-1',
    name: 'Rasi Garden',
    slug: 'rasi-garden',
    short_description: 'DTCP & RERA Approved premium plot layout with 40ft blacktop roads and street lights.',
    full_description: 'Rasi Garden is a flagship gated layout in Namakkal featuring underground drainage, 24/7 security, park reserves, and high-appreciation house plots.',
    project_status: 'Ongoing',
    approval_type: 'DTCP / RERA Approved',
    approval_number: 'DTCP No: 142/2024',
    total_area: '12.5 Acres',
    total_plots: 45,
    total_villas: 12,
    starting_price: 1800000,
    address: 'Near Namakkal Bus Stand, Namakkal 637001',
    latitude: 11.2189,
    longitude: 78.1674,
    map_url: 'https://maps.google.com/?q=Namakkal',
    hero_image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    hero_video_path: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    featured: true,
    published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    location_id: 'loc-2',
    name: 'Kongu Nagar',
    slug: 'kongu-nagar',
    short_description: 'Luxury gated community villas & residential plots in Paramathi Velur.',
    full_description: 'Kongu Nagar offers serene residential living with immediate construction readiness, potable groundwater, and grand entrance archways.',
    project_status: 'Ongoing',
    approval_type: 'DTCP Approved',
    approval_number: 'DTCP No: 88/2023',
    total_area: '8.2 Acres',
    total_plots: 32,
    total_villas: 8,
    starting_price: 2400000,
    address: 'Velur Bypass Road, Paramathi Velur 637207',
    latitude: 11.1122,
    longitude: 78.0772,
    map_url: 'https://maps.google.com/?q=Paramathi+Velur',
    hero_image_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    hero_video_path: 'https://www.youtube.com/watch?v=668nUCeBHyY',
    featured: true,
    published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    location_id: 'loc-1',
    name: 'Kongu Garden',
    slug: 'kongu-garden',
    short_description: 'Upcoming modern township layout with commercial and residential plot configurations.',
    full_description: 'Kongu Garden is an exclusive upcoming gated layout project near key Namakkal educational hubs.',
    project_status: 'Upcoming',
    approval_type: 'DTCP Approved',
    approval_number: 'DTCP No: 201/2024',
    total_area: '15.0 Acres',
    total_plots: 60,
    total_villas: 15,
    starting_price: 1500000,
    address: 'Salem Road, Namakkal 637001',
    latitude: 11.225,
    longitude: 78.17,
    map_url: 'https://maps.google.com/?q=Namakkal',
    hero_image_path: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    hero_video_path: null,
    featured: true,
    published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const supabase = createPublicClient();

    let query = supabase
      .from('projects')
      .select('*, location:locations(*), property_configurations(*), landmarks(*)')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (filters?.locationId) query = query.eq('location_id', filters.locationId);
    if (filters?.status) query = query.eq('project_status', filters.status);
    if (filters?.featuredOnly) query = query.eq('featured', true);
    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let result = FALLBACK_PROJECTS;
      if (filters?.featuredOnly) result = result.filter((p) => p.featured);
      if (filters?.limit) result = result.slice(0, filters.limit);
      return result;
    }

    return data as Project[];
  } catch {
    let result = FALLBACK_PROJECTS;
    if (filters?.featuredOnly) result = result.filter((p) => p.featured);
    if (filters?.limit) result = result.slice(0, filters.limit);
    return result;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, location:locations(*), property_configurations(*), landmarks(*)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }

    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}
