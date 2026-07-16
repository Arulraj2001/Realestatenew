-- =====================================================================
-- MIGRATION: 20260716030000_landmarks_and_config_gallery.sql
-- Description: Add image_url to landmarks and gallery_images to property_configurations
-- =====================================================================

ALTER TABLE public.landmarks
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.property_configurations
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
