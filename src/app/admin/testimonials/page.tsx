import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { TestimonialsClientManager, SiteSettingRecord } from '../settings/SettingsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: settingsData } = await supabase.from('site_settings').select('*');

  const settings = (settingsData as SiteSettingRecord[]) || [];

  return <TestimonialsClientManager initialSettings={settings} />;
}
