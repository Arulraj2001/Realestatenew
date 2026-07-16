import { createPublicClient } from '@/lib/supabase/server';
import { PropertyConfiguration } from '@/types/database';

const FALLBACK_CONFIGS: PropertyConfiguration[] = [
  {
    id: 'cfg-1',
    project_id: 'proj-1',
    name: 'Rasi Garden - 3BHK Luxury Villa',
    slug: 'rasi-garden-3bhk-villa',
    property_type: 'Villa',
    bhk: 3,
    plot_area: '1,500 Sq.Ft (30x50)',
    built_up_area: '1,850 Sq.Ft',
    bedrooms: 3,
    bathrooms: 3,
    parking: 'Covered Car Parking',
    floors: 2,
    starting_price: 4800000,
    price_display_mode: 'Starting From',
    availability_status: 'Available',
    short_description: 'Contemporary 2-level 3BHK elevation with covered parking, modular kitchen setup, and teakwood doors.',
    full_description: 'Flagship 3BHK Luxury Duplex Villa in Rasi Garden Namakkal featuring full interior designing, internal staircase, dedicated family lounge, and teakwood fittings.',
    feature_list: [
      'Premium Duplex Villa',
      'Internal Staircase',
      'Fully Designed Premium Interiors',
      'Spacious Living Hall',
      'Covered Car Parking',
      '3 Bedrooms with Attached Bathrooms',
      'Designer Wooden Pooja Unit',
      'Modular Kitchen with Dining Area',
      'First Floor Family Lounge with TV Unit',
      'Bedroom with Built-in Cot',
      'Ready-to-Move-In Luxury Home',
    ],
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
    name: 'Kongu Nagar - 2BHK Villa',
    slug: 'kongu-nagar-2bhk-villa',
    property_type: 'Villa',
    bhk: 2,
    plot_area: '1,200 Sq.Ft (30x40)',
    built_up_area: '1,350 Sq.Ft',
    bedrooms: 2,
    bathrooms: 2,
    parking: 'Covered Car Parking',
    floors: 1,
    starting_price: 3400000,
    price_display_mode: 'Starting From',
    availability_status: 'Fast Filling',
    short_description: 'Modern 2BHK villa with spacious living room, private car parking, and open balcony.',
    full_description: 'Single floor independent 2BHK home in Kongu Nagar, Paramathi Velur with potable groundwater line, wide tar road access, and 100% Vastu compliance.',
    feature_list: [
      'Modern Single-Floor Independent Villa',
      'Spacious Open-Concept Living Room',
      'Covered Private Car Parking Space',
      '2 Bedrooms with Attached Bathrooms',
      'Custom Modular Kitchen & Utility Space',
      '100% Vastu Compliant Floor Layout',
      'Individual Borewell & Water Storage Line',
      'Compound Wall with Grand Entry Gate',
      'DTCP Approved Ready-to-Move House',
    ],
    hero_image_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    published: true,
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cfg-3',
    project_id: 'proj-1',
    name: 'Rasi Garden - Approved Villa Plot',
    slug: 'rasi-garden-plot-1200',
    property_type: 'Plot',
    bhk: 0,
    plot_area: '1,200 Sq.Ft (30x40)',
    built_up_area: null,
    bedrooms: 0,
    bathrooms: 0,
    parking: 'Layout Access',
    floors: 0,
    starting_price: 1800000,
    price_display_mode: 'Starting From',
    availability_status: 'Available',
    short_description: 'Prime 30x40 residential plot layout facing 40ft blacktop roads with underground drainage.',
    full_description: 'Investment-ready 1,200 Sq.Ft house plot in Rasi Garden Namakkal with bank loan eligibility and instant registration.',
    feature_list: [
      'DTCP & RERA Approved Corner House Plot',
      '40ft & 30ft Blacktop Tar Access Roads',
      'Underground Sewage & Drainage Lines',
      'Individual Electricity Pole & Water Line Points',
      '24/7 Gated Security & Perimeter Fencing',
      'Immediate Construction-Ready Land',
      'High Appreciation Investment Site',
    ],
    hero_image_path: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    published: true,
    featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cfg-4',
    project_id: 'proj-3',
    name: 'Kongu Garden - Prime Plot',
    slug: 'kongu-garden-plot-1500',
    property_type: 'Plot',
    bhk: 0,
    plot_area: '1,500 Sq.Ft (30x50)',
    built_up_area: null,
    bedrooms: 0,
    bathrooms: 0,
    parking: 'Layout Access',
    floors: 0,
    starting_price: 2200000,
    price_display_mode: 'Starting From',
    availability_status: 'Available',
    short_description: 'Spacious 1,500 Sq.Ft house plot near Paramathi Velur NH Bypass Highway.',
    full_description: 'Residential house land in Kongu Garden Paramathi Velur with clear DTCP approval deeds and avenue tree plantation.',
    feature_list: [
      'Premium Gated House Site in Paramathi Velur',
      'Wide Avenue Tar Roads with Solar Streetlights',
      'Potable Underground Fresh Water Hub',
      'Avenue Tree Plantation & Park Reserve',
      'Bank Loan Approved Clear Title Deed',
      'Quick Access to NH Highway & Bus Stand',
    ],
    hero_image_path: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    published: true,
    featured: true,
    display_order: 4,
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

    if (options?.locationId) {
      // Filter by location via project join at DB level
      const { data, error } = await supabase
        .from('property_configurations')
        .select('*, project:projects!inner(*, location:locations(*))')
        .eq('published', true)
        .eq('project.location_id', options.locationId)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_CONFIGS.filter((c) => {
          const projIds = { 'proj-1': 'loc-1', 'proj-2': 'loc-2', 'proj-3': 'loc-1' };
          return projIds[c.project_id as keyof typeof projIds] === options.locationId;
        });
      }

      return data as PropertyConfiguration[];
    }

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

    return data as PropertyConfiguration[];
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
