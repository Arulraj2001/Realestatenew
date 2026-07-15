import React from 'react';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { MessageDetailClient } from './MessageDetailClient';
import { Message } from '@/types/database';

export const dynamic = 'force-dynamic';

export interface AdminMessageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminMessageDetailPage({ params }: AdminMessageDetailPageProps) {
  const admin = await requireAdmin(['super_admin', 'sales_admin']);
  const { id } = await params;

  const supabase = await createAdminClient();

  const [{ data: rawMessage }, { data: staffAdmins }] = await Promise.all([
    supabase
      .from('messages')
      .select('*, location:locations(*), project:projects(*), property_configuration:property_configurations(*), assigned_admin:admin_profiles(*)')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('admin_profiles').select('*').eq('is_active', true),
  ]);

  if (!rawMessage) {
    notFound();
  }

  const message = (rawMessage as unknown) as Message;

  // Automatically mark read if unread
  if (!message.read_at) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('messages') as any)
      .update({ read_at: new Date().toISOString(), status: 'contacted' })
      .eq('id', id);
  }

  return <MessageDetailClient currentAdmin={admin} message={message} staffAdmins={staffAdmins || []} />;
}
