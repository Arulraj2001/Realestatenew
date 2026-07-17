import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { ProjectsClientManager } from './ProjectsClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [{ data: projects }, { data: locations }, { data: amenities }] = await Promise.all([
    supabase.from('projects').select('*, location:locations(*)').order('display_order', { ascending: true }),
    supabase.from('locations').select('*').eq('published', true),
    supabase.from('amenities').select('*').eq('active', true).order('name', { ascending: true }),
  ]);

  return (
    <ProjectsClientManager
      initialProjects={projects || []}
      locations={locations || []}
      masterAmenities={amenities || []}
    />
  );
}
