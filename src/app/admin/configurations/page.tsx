import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { PropertyConfigsClientManager } from './PropertyConfigsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminConfigurationsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [{ data: configs }, { data: projects }] = await Promise.all([
    supabase
      .from('property_configurations')
      .select('*, project:projects(*, location:locations(*))')
      .order('display_order', { ascending: true }),
    supabase.from('projects').select('*').eq('published', true),
  ]);

  return <PropertyConfigsClientManager initialConfigs={configs || []} projects={projects || []} />;
}
