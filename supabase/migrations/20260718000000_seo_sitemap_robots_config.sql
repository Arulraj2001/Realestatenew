-- Migration: Add sitemap control fields to seo_metadata table
-- Run this in Supabase SQL Editor

ALTER TABLE seo_metadata
  ADD COLUMN IF NOT EXISTS sitemap_priority   DECIMAL(3,1) DEFAULT NULL CHECK (sitemap_priority IS NULL OR (sitemap_priority >= 0.0 AND sitemap_priority <= 1.0)),
  ADD COLUMN IF NOT EXISTS sitemap_change_frequency VARCHAR(10) DEFAULT NULL CHECK (sitemap_change_frequency IS NULL OR sitemap_change_frequency IN ('always','hourly','daily','weekly','monthly','yearly','never'));

COMMENT ON COLUMN seo_metadata.sitemap_priority          IS 'Override sitemap priority (0.0–1.0). NULL = use default for entity type.';
COMMENT ON COLUMN seo_metadata.sitemap_change_frequency  IS 'Override sitemap changeFrequency. NULL = use default for entity type.';

-- Seed the default robots_config in site_settings (safe upsert)
INSERT INTO site_settings (key, value)
VALUES (
  'robots_config',
  '[
    {
      "userAgent": "*",
      "allow": ["/"],
      "disallow": ["/admin/", "/api/"]
    }
  ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
