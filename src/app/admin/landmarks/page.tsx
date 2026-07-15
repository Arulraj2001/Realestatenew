import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { LandmarksClientManager } from './LandmarksClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminLandmarksPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [{ data: landmarks }, { data: projects }] = await Promise.all([
    supabase.from('landmarks').select('*, project:projects(name)').order('display_order', { ascending: true }),
    supabase.from('projects').select('*').eq('published', true),
  ]);

  return <LandmarksClientManager initialLandmarks={landmarks || []} projects={projects || []} />;
}
