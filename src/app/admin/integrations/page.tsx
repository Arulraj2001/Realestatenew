import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { IntegrationsClientManager, SiteSettingRecord } from '../settings/SettingsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: settingsData } = await supabase.from('site_settings').select('*');

  const settings = (settingsData as SiteSettingRecord[]) || [];

  return <IntegrationsClientManager initialSettings={settings} />;
}
