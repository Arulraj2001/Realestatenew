import { createPublicClient } from '@/lib/supabase/server';
import { SiteSetting } from '@/types/database';

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
