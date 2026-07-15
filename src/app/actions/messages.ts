'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { MessageStatus } from '@/types/database';

async function getSupabaseAdmin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await createAdminClient()) as any;
}

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  try {
    await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase
      .from('messages')
      .update({
        status,
        read_at: status !== 'new' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating message status:', error.message);
      return { success: false, error: 'Database error updating status.' };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    revalidatePath(`/admin/messages/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Unauthorized or invalid status transition.' };
  }
}

export async function assignMessageAdminAction(id: string, adminId: string | null) {
  try {
    await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase
      .from('messages')
      .update({
        assigned_admin_id: adminId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/messages');
    revalidatePath(`/admin/messages/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to assign sales admin.' };
  }
}

export async function saveMessageNotesAction(id: string, notes: string) {
  try {
    await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase
      .from('messages')
      .update({
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/messages/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save internal notes.' };
  }
}

export async function bulkMarkMessagesReadAction(ids: string[]) {
  try {
    await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase
      .from('messages')
      .update({
        read_at: new Date().toISOString(),
        status: 'contacted',
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/messages');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to execute bulk mark read.' };
  }
}

export async function bulkUpdateMessagesStatusAction(ids: string[], status: MessageStatus) {
  try {
    await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase
      .from('messages')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/messages');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to execute bulk status update.' };
  }
}

export async function deleteMessageAction(id: string, isSpamOnly = false) {
  try {
    const admin = await requireAdmin(['super_admin', 'sales_admin']);
    const supabase = await getSupabaseAdmin();

    // Sales admins can only delete spam messages. Super admins can delete any message.
    if (admin.role !== 'super_admin' && !isSpamOnly) {
      return { success: false, error: 'Only Super Admins can permanently delete customer leads.' };
    }

    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/messages');
    revalidatePath('/admin');
    return { success: true };
  } catch {
    return { success: false, error: 'Unauthorized or failed to delete message record.' };
  }
}
