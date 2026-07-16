import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { AdminProfile } from '@/types/database';
import { UsersClientManager } from './UsersClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await requireAdmin(['super_admin']);
  const supabase = await createAdminClient();

  const { data: usersData } = await supabase
    .from('admin_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const users = (usersData as AdminProfile[]) || [];

  return <UsersClientManager initialUsers={users} />;
}
