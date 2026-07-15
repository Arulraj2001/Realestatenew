import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { GalleryClientManager } from './GalleryClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [{ data: items }, { data: projects }, { data: locations }] = await Promise.all([
    supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
    supabase.from('projects').select('*').eq('published', true),
    supabase.from('locations').select('*').eq('published', true),
  ]);

  return <GalleryClientManager initialItems={items || []} projects={projects || []} locations={locations || []} />;
}
