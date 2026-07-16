-- =====================================================================
-- MIGRATION: 20260716020000_content_pages_privacy_terms_support.sql
-- Description: Expand content_pages page_key check constraint to allow privacy & terms
-- =====================================================================

ALTER TABLE public.content_pages
DROP CONSTRAINT IF EXISTS content_pages_page_key_check;

ALTER TABLE public.content_pages
ADD CONSTRAINT content_pages_page_key_check
CHECK (page_key IN ('home', 'about', 'services', 'contact', 'privacy', 'terms'));
