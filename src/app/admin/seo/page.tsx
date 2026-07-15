import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { SeoClientManager } from './SeoClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: seoRecords } = await supabase.from('seo_metadata').select('*');

  return <SeoClientManager initialSeoRecords={seoRecords || []} />;
}
