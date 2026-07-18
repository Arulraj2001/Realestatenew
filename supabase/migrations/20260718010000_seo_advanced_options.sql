-- Migration: Add advanced SEO controls to seo_metadata table
-- Run this in the Supabase SQL Editor

ALTER TABLE public.seo_metadata
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
  ADD COLUMN IF NOT EXISTS robots_directives TEXT DEFAULT 'index, follow',
  ADD COLUMN IF NOT EXISTS og_type TEXT DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS twitter_card TEXT DEFAULT 'summary_large_image',
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

COMMENT ON COLUMN public.seo_metadata.meta_keywords IS 'Optional keywords to index page contents (legacy search support)';
COMMENT ON COLUMN public.seo_metadata.robots_directives IS 'Granular search crawler robots meta rules (e.g. noindex, nofollow, noarchive)';
COMMENT ON COLUMN public.seo_metadata.og_type IS 'Open Graph entity classification category';
COMMENT ON COLUMN public.seo_metadata.twitter_card IS 'Twitter display card size preset layout';
COMMENT ON COLUMN public.seo_metadata.focus_keyword IS 'Focus search keyword query used to run local SEO page audits';
