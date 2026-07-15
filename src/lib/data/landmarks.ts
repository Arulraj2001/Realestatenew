import { createPublicClient } from '@/lib/supabase/server';
import { Landmark } from '@/types/database';

const FALLBACK_LANDMARKS: Landmark[] = [
  {
    id: 'lm-1',
    project_id: 'proj-1',
    name: 'Namakkal Central Bus Stand',
    distance_label: '5 Mins (1.8 Km)',
    travel_time_label: '5 Mins',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lm-2',
    project_id: 'proj-1',
    name: 'Namakkal Government Hospital',
    distance_label: '7 Mins (2.5 Km)',
    travel_time_label: '7 Mins',
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lm-3',
    project_id: 'proj-1',
    name: 'Greenwood Matriculation Higher Secondary School',
    distance_label: '3 Mins (1.0 Km)',
    travel_time_label: '3 Mins',
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getProjectLandmarks(projectId: string): Promise<Landmark[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('landmarks')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_LANDMARKS.map((lm) => ({ ...lm, project_id: projectId }));
    }

    return data;
  } catch {
    return FALLBACK_LANDMARKS.map((lm) => ({ ...lm, project_id: projectId }));
  }
}
