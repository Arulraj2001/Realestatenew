import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const RESERVED_SLUGS = [
  'admin',
  'locations',
  'projects',
  'properties',
  'services',
  'about',
  'about-us',
  'contact',
  'contact-us',
  'gallery',
  'privacy-policy',
  'terms-and-conditions',
  'api',
  'login',
];

export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

export async function isSlugUnique(
  table: 'locations' | 'projects' | 'property_configurations' | 'content_pages',
  slug: string,
  excludeId?: string
): Promise<boolean> {
  if (isReservedSlug(slug)) return false;

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let query = supabase.from(table).select('id').eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query.maybeSingle();
    return !data;
  } catch {
    return true;
  }
}
