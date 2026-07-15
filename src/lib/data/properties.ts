import { createPublicClient } from '@/lib/supabase/server';
import { PropertyConfiguration } from '@/types/database';

const FALLBACK_CONFIGS: PropertyConfiguration[] = [
  {
    id: 'cfg-1',
    project_id: 'proj-1',
    name: 'Standard 30x40 Villa Plot',
    slug: 'standard-30x40-villa-plot',
    property_type: 'Plot',
    bhk: 2,
    plot_area: '1,200 Sq.Ft (30x40)',
    built_up_area: null,
    bedrooms: 2,
    bathrooms: 2,
    parking: 'Car Parking Available',
    floors: 1,
    starting_price: 1800000,
    price_display_mode: 'Starting From',
    availability_status: 'Available',
    short_description: 'East & North facing 30x40 residential layout plots ready for immediate construction.',
    full_description: 'Standard 1,200 Sq.Ft residential plots featuring 40ft wide blacktop tar road access, street lighting, and clear DTCP title deeds.',
    feature_list: ['DTCP Approved', '40ft Blacktop Roads', 'Underground Drainage', 'Gated Community Security'],
    hero_image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    published: true,
    featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cfg-2',
    project_id: 'proj-2',
    name: 'Executive 3 BHK Duplex Villa',
    slug: 'executive-3-bhk-duplex-villa',
    property_type: 'Villa',
    bhk: 3,
    plot_area: '1,500 Sq.Ft (30x50)',
    built_up_area: '2,100 Sq.Ft',
    bedrooms: 3,
    bathrooms: 3,
    parking: 'Covered Car Parking',
    floors: 2,
    starting_price: 4500000,
    price_display_mode: 'Starting From',
    availability_status: 'Fast Filling',
    short_description: 'Contemporary 3 BHK duplex villa with modular kitchen, balcony, and private garden.',
    full_description: 'Architecturally designed 3 BHK luxury duplex villas featuring spacious living areas, premium vitrified tiles, and solar water heating.',
    feature_list: ['Architect Designed', 'Solar Water Heating', 'Modular Kitchen Ready', 'Private Terrace'],
    hero_image_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    published: true,
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedConfigurations(options?: {
  locationId?: string;
  projectId?: string;
  type?: string;
  bhk?: number;
  status?: string;
  featuredOnly?: boolean;
}): Promise<PropertyConfiguration[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('property_configurations')
      .select('*, project:projects(*, location:locations(*))')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (options?.projectId) query = query.eq('project_id', options.projectId);
    if (options?.type) query = query.eq('property_type', options.type);
    if (options?.bhk !== undefined && !isNaN(options.bhk)) query = query.eq('bhk', options.bhk);
    if (options?.status) query = query.eq('availability_status', options.status);
    if (options?.featuredOnly) query = query.eq('featured', true);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return FALLBACK_CONFIGS;
    }

    let results = (data as unknown) as PropertyConfiguration[];

    if (options?.locationId) {
      results = results.filter((item) => item.project?.location_id === options.locationId);
    }

    return results;
  } catch {
    return FALLBACK_CONFIGS;
  }
}

export async function getConfigurationBySlug(slug: string): Promise<PropertyConfiguration | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('property_configurations')
      .select('*, project:projects(*, location:locations(*))')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_CONFIGS.find((c) => c.slug === slug) || null;
    }

    return data as PropertyConfiguration;
  } catch {
    return FALLBACK_CONFIGS.find((c) => c.slug === slug) || null;
  }
}
