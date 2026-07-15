import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminProfile, AdminRole } from '@/types/database';

export async function getAuthenticatedAdmin(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !profile) return null;

    return profile;
  } catch (err) {
    console.error('Error verifying admin authorization:', err);
    return null;
  }
}

export async function requireAdmin(allowedRoles?: AdminRole[]): Promise<AdminProfile> {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  const roleStr = admin.role as string;
  const isRoleAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    roleStr === 'super_admin' ||
    (allowedRoles as string[]).includes(roleStr);

  if (!isRoleAllowed) {
    redirect('/admin/unauthorized');
  }

  return admin;
}

export function canManageModule(
  role: AdminRole,
  module: 'content' | 'sales' | 'admin_users'
): boolean {
  const roleStr = role as string;
  if (roleStr === 'super_admin') return true;

  if (module === 'content') {
    return roleStr === 'content_admin';
  }

  if (module === 'sales') {
    return roleStr === 'sales_admin';
  }

  return false;
}
