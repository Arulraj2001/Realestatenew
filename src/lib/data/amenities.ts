import { createPublicClient } from '@/lib/supabase/server';
import { Amenity, ProjectAmenity } from '@/types/database';

const FALLBACK_AMENITIES: Amenity[] = [
  // Land & Plot Layout
  { id: 'am-1', name: 'DTCP & RERA Approved', icon_key: 'shield-check', description: '100% legal title clearance and approved layout design records for secure resale value.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-2', name: '30ft & 40ft Blacktop Roads', icon_key: 'road', description: 'Wide, heavy-duty asphalt avenues built to local municipal road specifications.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-3', name: 'Gated Community Security', icon_key: 'lock', description: 'Fully secured perimeter wall fencing with grand entrance archway & security post.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-4', name: 'Individual Water Taps', icon_key: 'droplet', description: 'Concealed sweet groundwater lines routed to every single plot in the layout.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-5', name: 'Concealed Drainage System', icon_key: 'check-circle-2', description: 'Underground pipeline network for efficient wastewater and stormwater flow.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-6', name: 'Children Play Park & Trees', icon_key: 'trees', description: 'Lush landscaped green buffer zones, children play area, and tree-lined pathways.', category: 'land', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Villas & Houses
  { id: 'am-7', name: 'Architectural Customization', icon_key: 'check-circle-2', description: 'Work with our expert planners to customize 2BHK, 3BHK, or 4BHK floor plans.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-8', name: 'Covered Car Parking', icon_key: 'car', description: 'Spacious portico designed for secure car parking and simple washing access.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-9', name: 'Premium Woodwork & UPVC', icon_key: 'home', description: 'Teakwood main frame & doors paired with weatherproof sliding UPVC windows.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-10', name: 'Modern Modular Kitchen', icon_key: 'utensils', description: 'Equipped with heavy-duty granite slab counters, stainless sink, and exhaust provisions.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-11', name: 'Dedicated Water Storage', icon_key: 'droplet', description: 'Individual overhead water storage tank and underground sump connections.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-12', name: '100% Vaastu-Compliant', icon_key: 'compass', description: 'All construction strictly adheres to traditional Vaastu design principles for peace and prosperity.', category: 'house', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function getActiveAmenities(): Promise<Amenity[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_AMENITIES;
    }

    return data;
  } catch {
    return FALLBACK_AMENITIES;
  }
}

export async function getProjectAmenities(projectId: string): Promise<ProjectAmenity[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('project_amenities')
      .select('*, amenity:amenities(*)')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_AMENITIES.map((am, idx) => ({
        project_id: projectId,
        amenity_id: am.id,
        custom_description: am.description,
        display_order: idx + 1,
        amenity: am,
      }));
    }

    return (data as unknown) as ProjectAmenity[];
  } catch {
    return FALLBACK_AMENITIES.map((am, idx) => ({
      project_id: projectId,
      amenity_id: am.id,
      custom_description: am.description,
      display_order: idx + 1,
      amenity: am,
    }));
  }
}
