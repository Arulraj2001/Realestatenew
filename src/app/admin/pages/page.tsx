import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { PagesClientManager } from './PagesClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminContentPagesPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const { data: pages } = await supabase.from('content_pages').select('*');

  return <PagesClientManager initialPages={pages || []} />;
}
