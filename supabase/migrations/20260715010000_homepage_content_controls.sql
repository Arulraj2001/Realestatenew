-- =====================================================================
-- MIGRATION: 20260715010000_homepage_content_controls.sql
-- =====================================================================

-- Ensure content_pages JSON schema supports hero media types, opacities, section visibilities, and Why Choose Us content
COMMENT ON COLUMN public.content_pages.content IS 'Extended JSONB for homepage hero controls, section visibilities, and why choose us content';
