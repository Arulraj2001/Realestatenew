import { createPublicClient } from '@/lib/supabase/server';
import { Amenity, ProjectAmenity } from '@/types/database';

const FALLBACK_AMENITIES: Amenity[] = [
  { id: 'am-1', name: 'Blacktop Tar Roads', icon_key: 'Sparkles', description: '40ft & 30ft asphalt roads', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-2', name: '24/7 Gated Security', icon_key: 'ShieldCheck', description: 'CCTV surveillance & entry archway', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-3', name: 'Potable Groundwater & Overhead Tank', icon_key: 'CheckCircle2', description: 'Sweet drinking water line connections', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-4', name: 'Underground Drainage Network', icon_key: 'Sparkles', description: 'Closed stormwater & sewage lines', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-5', name: 'Street Lights & Electricity Line', icon_key: 'Sparkles', description: '3-phase power line connections', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'am-6', name: 'Childrens Play Park & Avenue Trees', icon_key: 'Sparkles', description: 'Landscaping & green park reserves', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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
