import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { GalleryClientManager } from './GalleryClientManager';
import { GalleryItem, Project } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [{ data: items }, { data: projects }] = await Promise.all([
    supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
    supabase.from('projects').select('*').eq('published', true),
  ]);

  return (
    <GalleryClientManager
      initialItems={(items as GalleryItem[]) || []}
      projects={(projects as Project[]) || []}
    />
  );
}
