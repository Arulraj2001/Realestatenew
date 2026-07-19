import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { RedirectsClientManager } from './RedirectsClientManager';
import { SiteSettingRecord } from '../settings/SettingsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminRedirectsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: settingsData } = await supabase.from('site_settings').select('*');

  const settings = (settingsData as SiteSettingRecord[]) || [];

  return <RedirectsClientManager initialSettings={settings} />;
}
