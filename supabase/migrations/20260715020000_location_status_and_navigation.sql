-- =====================================================================
-- MIGRATION: 20260715020000_location_status_and_navigation.sql
-- =====================================================================

ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS location_status TEXT CHECK (location_status IN ('current', 'upcoming')) NOT NULL DEFAULT 'current',
ADD COLUMN IF NOT EXISTS show_in_navigation BOOLEAN NOT NULL DEFAULT true;

-- Update existing default seed locations to current
UPDATE public.locations SET location_status = 'current', show_in_navigation = true WHERE location_status IS NULL;
