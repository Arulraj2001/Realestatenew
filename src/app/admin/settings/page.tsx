import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { SettingsClientManager, SiteSettingRecord } from './SettingsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: settingsData } = await supabase.from('site_settings').select('*');

  const settings = (settingsData as SiteSettingRecord[]) || [];

  return <SettingsClientManager initialSettings={settings} />;
}
