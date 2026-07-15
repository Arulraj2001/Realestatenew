import { createPublicClient } from '@/lib/supabase/server';
import { GalleryItem } from '@/types/database';

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    location_id: 'loc-1',
    project_id: 'proj-1',
    property_configuration_id: null,
    media_type: 'image',
    storage_path_or_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumbnail_path: null,
    title: 'Rasi Garden Entrance Arch & Asphalt Road',
    caption: 'Broad 40ft blacktop roads with street lights installed',
    alt_text: 'Rasi Garden Township Layout Aerial View',
    category: 'Layout Photos',
    featured: true,
    published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'gal-2',
    location_id: 'loc-2',
    project_id: 'proj-2',
    property_configuration_id: null,
    media_type: 'image',
    storage_path_or_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    thumbnail_path: null,
    title: 'Kongu Nagar Executive Duplex Villa Elevation',
    caption: 'Completed 3 BHK luxury villa ready for immediate possession',
    alt_text: 'Kongu Nagar Gated Community Villa Elevation',
    category: 'Villas & Houses',
    featured: true,
    published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedGalleryItems(options?: {
  projectId?: string;
  locationId?: string;
  category?: string;
  featuredOnly?: boolean;
}): Promise<GalleryItem[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('gallery_items')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (options?.projectId) query = query.eq('project_id', options.projectId);
    if (options?.locationId) query = query.eq('location_id', options.locationId);
    if (options?.category) query = query.eq('category', options.category);
    if (options?.featuredOnly) query = query.eq('featured', true);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return FALLBACK_GALLERY;
    }

    return data;
  } catch {
    return FALLBACK_GALLERY;
  }
}
