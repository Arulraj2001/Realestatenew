import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { MessagesClientManager } from './MessagesClientManager';
import { Message, MessageType, MessageStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

export interface AdminMessagesPageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    status?: string;
    location?: string;
    project?: string;
    unread?: string;
  }>;
}

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  // Guard: Sales and Super Admins only
  await requireAdmin(['super_admin', 'sales_admin']);

  const { query, type, status, location, project, unread } = await searchParams;
  const supabase = await createAdminClient();

  let dbQuery = supabase
    .from('messages')
    .select('*, location:locations(name), project:projects(name), property_configuration:property_configurations(name)')
    .order('created_at', { ascending: false });

  if (type) {
    dbQuery = dbQuery.eq('message_type', type as MessageType);
  }
  if (status) {
    dbQuery = dbQuery.eq('status', status as MessageStatus);
  }
  if (location) {
    dbQuery = dbQuery.eq('location_id', location);
  }
  if (project) {
    dbQuery = dbQuery.eq('project_id', project);
  }
  if (unread === 'true') {
    dbQuery = dbQuery.is('read_at', null);
  }

  const [{ data: messages }, { data: locations }, { data: projects }] = await Promise.all([
    dbQuery,
    supabase.from('locations').select('*').eq('published', true),
    supabase.from('projects').select('*').eq('published', true),
  ]);

  let filteredMessages = ((messages as unknown) as Message[]) || [];

  if (query) {
    const q = query.toLowerCase();
    filteredMessages = filteredMessages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
    );
  }

  return (
    <MessagesClientManager
      initialMessages={filteredMessages}
      locations={locations || []}
      projects={projects || []}
      currentParams={{ query, type, status, location, project, unread }}
    />
  );
}
