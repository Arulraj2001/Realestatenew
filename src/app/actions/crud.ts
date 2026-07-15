'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import {
  locationCrudSchema,
  projectCrudSchema,
  propertyConfigCrudSchema,
  amenityCrudSchema,
  landmarkCrudSchema,
  galleryCrudSchema,
  seoMetadataCrudSchema,
} from '@/lib/validation/crud';
import { isSlugUnique } from '@/lib/utils/slug';
import { ContentPageKey } from '@/types/database';

// Helper for type-safe Supabase table queries
async function getSupabaseAdmin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await createAdminClient()) as any;
}

// -------------------------------------------------------------
// 1. LOCATIONS CRUD ACTIONS
// -------------------------------------------------------------
export async function saveLocationAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = locationCrudSchema.parse(data);

    const isUnique = await isSlugUnique('locations', validated.slug, id);
    if (!isUnique) {
      return { success: false, error: 'Slug is already in use or collision with reserved routes.' };
    }

    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('locations').update({ ...validated, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      query = supabase.from('locations').insert(validated);
    }

    const { error } = await query;
    if (error) {
      console.error('Error saving location:', error.message);
      return { success: false, error: 'Database error saving location record.' };
    }

    revalidatePath('/locations');
    revalidatePath(`/locations/${validated.slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Validation error in saveLocationAction:', err);
    return { success: false, error: 'Validation error: Please check all required fields.' };
  }
}

export async function deleteLocationAction(id: string) {
  try {
    await requireAdmin(['super_admin']);
    const supabase = await getSupabaseAdmin();

    // Check project dependencies
    const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('location_id', id);
    if (count && count > 0) {
      return { success: false, error: `Cannot delete location: ${count} projects are assigned to this location.` };
    }

    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/locations');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Unauthorized or database deletion error.' };
  }
}

export async function togglePublishLocationAction(id: string, currentStatus: boolean) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('locations').update({ published: !currentStatus }).eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/locations');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to toggle publication status.' };
  }
}

// -------------------------------------------------------------
// 2. PROJECTS CRUD ACTIONS
// -------------------------------------------------------------
export async function saveProjectAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = projectCrudSchema.parse(data);

    const isUnique = await isSlugUnique('projects', validated.slug, id);
    if (!isUnique) {
      return { success: false, error: 'Project slug is taken or clashes with reserved routes.' };
    }

    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('projects').update({ ...validated, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      query = supabase.from('projects').insert(validated);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    revalidatePath(`/projects/${validated.slug}`);
    revalidatePath('/locations');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Validation failed for project entry.' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requireAdmin(['super_admin']);
    const supabase = await getSupabaseAdmin();

    // Check configuration dependencies
    const { count } = await supabase.from('property_configurations').select('*', { count: 'exact', head: true }).eq('project_id', id);
    if (count && count > 0) {
      return { success: false, error: `Cannot delete project: ${count} property configurations belong to this project.` };
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete project.' };
  }
}

export async function togglePublishProjectAction(id: string, currentStatus: boolean) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('projects').update({ published: !currentStatus }).eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to toggle publication status.' };
  }
}

// -------------------------------------------------------------
// 3. PROPERTY CONFIGURATIONS CRUD ACTIONS
// -------------------------------------------------------------
export async function savePropertyConfigAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = propertyConfigCrudSchema.parse(data);

    const isUnique = await isSlugUnique('property_configurations', validated.slug, id);
    if (!isUnique) {
      return { success: false, error: 'Property configuration slug is already taken.' };
    }

    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('property_configurations').update({ ...validated, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      query = supabase.from('property_configurations').insert(validated);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/properties');
    revalidatePath(`/properties/${validated.slug}`);
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Validation failed for property configuration.' };
  }
}

export async function deletePropertyConfigAction(id: string) {
  try {
    await requireAdmin(['super_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('property_configurations').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/properties');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete configuration.' };
  }
}

// -------------------------------------------------------------
// 4. AMENITIES & LANDMARKS CRUD ACTIONS
// -------------------------------------------------------------
export async function saveAmenityAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = amenityCrudSchema.parse(data);
    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('amenities').update(validated).eq('id', id);
    } else {
      query = supabase.from('amenities').insert(validated);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save amenity.' };
  }
}

export async function deleteAmenityAction(id: string) {
  try {
    await requireAdmin(['super_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('amenities').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete amenity.' };
  }
}

export async function saveLandmarkAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = landmarkCrudSchema.parse(data);
    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('landmarks').update(validated).eq('id', id);
    } else {
      query = supabase.from('landmarks').insert(validated);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save landmark.' };
  }
}

export async function deleteLandmarkAction(id: string) {
  try {
    await requireAdmin(['super_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('landmarks').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete landmark.' };
  }
}

// -------------------------------------------------------------
// 5. GALLERY ITEMS CRUD ACTIONS
// -------------------------------------------------------------
export async function saveGalleryItemAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = galleryCrudSchema.parse(data);
    const supabase = await getSupabaseAdmin();

    const payload = {
      ...validated,
      project_id: validated.project_id || null,
      location_id: validated.location_id || null,
    };

    let query;
    if (id) {
      query = supabase.from('gallery_items').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      query = supabase.from('gallery_items').insert(payload);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/gallery');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save gallery media item.' };
  }
}

export async function deleteGalleryItemAction(id: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/gallery');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete gallery item.' };
  }
}

// -------------------------------------------------------------
// 6. CONTENT PAGES & SEO METADATA ACTIONS
// -------------------------------------------------------------
export async function saveContentPageAction(
  pageKey: ContentPageKey,
  title: string,
  content: Record<string, unknown>,
  published = true
) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const supabase = await getSupabaseAdmin();

    const { error } = await supabase.from('content_pages').upsert(
      {
        page_key: pageKey,
        title,
        content: content as unknown as Record<string, string>,
        published,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_key' }
    );

    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/about-us');
    revalidatePath('/services');
    revalidatePath('/contact');
    revalidatePath('/contact-us');
    revalidatePath('/privacy-policy');
    revalidatePath('/terms-and-conditions');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update content page.' };
  }
}

export async function saveSeoMetadataAction(data: Record<string, unknown>, id?: string) {
  try {
    await requireAdmin(['super_admin', 'content_admin']);
    const validated = seoMetadataCrudSchema.parse(data);
    const supabase = await getSupabaseAdmin();

    let query;
    if (id) {
      query = supabase.from('seo_metadata').update({ ...validated, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      query = supabase.from('seo_metadata').insert(validated);
    }

    const { error } = await query;
    if (error) return { success: false, error: error.message };

    revalidatePath('/', 'layout');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save SEO metadata entry.' };
  }
}
