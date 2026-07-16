-- =====================================================================
-- MIGRATION: 20260715030000_media_categories_and_urls.sql
-- =====================================================================

ALTER TABLE public.gallery_items
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS embed_type TEXT CHECK (embed_type IN ('supabase', 'youtube', 'instagram')) DEFAULT 'supabase';

COMMENT ON COLUMN public.gallery_items.video_url IS 'External YouTube or Instagram video URL for embeds';
COMMENT ON COLUMN public.gallery_items.embed_type IS 'Platform type for video rendering (supabase, youtube, instagram)';
