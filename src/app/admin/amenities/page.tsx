import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { AmenitiesClientManager } from './AmenitiesClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminAmenitiesPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: amenities } = await supabase.from('amenities').select('*').order('name', { ascending: true });

  return <AmenitiesClientManager initialAmenities={amenities || []} />;
}
