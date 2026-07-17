import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_RULES: MetadataRoute.Robots['rules'] = [
  {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin/', '/api/'],
  },
];

interface RobotsRule {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = siteConfig.domain;

  let rules: MetadataRoute.Robots['rules'] = DEFAULT_RULES;

  try {
    const supabase = await createClient();
    const result = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'robots_config')
      .maybeSingle();

    const data = result.data as { value: unknown } | null;

    if (data?.value && Array.isArray(data.value)) {
      const dbRules = data.value as RobotsRule[];
      rules = dbRules.map((r) => ({
        userAgent: r.userAgent ?? '*',
        allow: r.allow ?? '/',
        disallow: r.disallow ?? [],
      }));
    }
  } catch {
    // Fallback to static defaults on any error
  }

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
