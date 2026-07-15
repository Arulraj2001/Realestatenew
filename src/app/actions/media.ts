'use server';

import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';

export async function uploadMediaAction(formData: FormData) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return { success: false, error: 'No file provided for upload.' };
    }

    // Size limit verification (Images <= 5MB, Videos/PDFs <= 20MB)
    const isVideoOrPdf = file.type.startsWith('video/') || file.type === 'application/pdf';
    const maxSize = isVideoOrPdf ? 20 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds limit (${isVideoOrPdf ? '20MB for video/pdf' : '5MB for images'}).`,
      };
    }

    // Generate safe unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const sanitizedExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;
    const storagePath = `${folder}/${uniqueName}`;

    const supabase = await createAdminClient();

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('public-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError.message);
      return { success: false, error: 'Failed to upload media to storage bucket.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('public-media')
      .getPublicUrl(storagePath);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      storagePath,
    };
  } catch (err) {
    console.error('Unexpected error in media upload:', err);
    return { success: false, error: 'Server error processing media upload.' };
  }
}

export async function deleteMediaFileAction(storagePath: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const supabase = await createAdminClient();

    const { error } = await supabase.storage.from('public-media').remove([storagePath]);

    if (error) {
      console.error('Supabase Storage Delete Error:', error.message);
      return { success: false, error: 'Failed to remove file from storage.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Server error deleting storage file.' };
  }
}
