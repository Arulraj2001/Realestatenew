import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import { getPublishedLocations, getPublishedProjects, getPublishedConfigurations } from '@/lib/data';
import { SeoClientManager } from './SeoClientManager';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  await requireAdmin(['super_admin', 'content_admin']);
  const supabase = await createAdminClient();

  const [
    { data: seoRecords },
    locations,
    projects,
    configurations,
    robotsResult,
  ] = await Promise.all([
    supabase.from('seo_metadata').select('*'),
    getPublishedLocations(),
    getPublishedProjects(),
    getPublishedConfigurations(),
    supabase.from('site_settings').select('value').eq('key', 'robots_config').maybeSingle(),
  ]);

  const robotsSetting = robotsResult.data as { value: unknown } | null;

  const defaultRobots = JSON.stringify(
    [{ userAgent: '*', allow: ['/'], disallow: ['/admin/', '/api/'] }],
    null,
    2,
  );

  return (
    <SeoClientManager
      initialSeoRecords={seoRecords || []}
      locations={locations.map((l) => ({ id: l.id, name: l.name, slug: l.slug }))}
      projects={projects.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))}
      configurations={configurations.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        projectName: c.project?.name ?? '',
      }))}
      initialRobotsConfig={
        robotsSetting?.value ? JSON.stringify(robotsSetting.value, null, 2) : defaultRobots
      }
    />
  );
}
