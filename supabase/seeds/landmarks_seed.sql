-- =====================================================================
-- SEED MIGRATION: Deduplicate & Seed Key Nearby Landmarks
-- =====================================================================
-- Run this in Supabase SQL Editor to clear duplicates and set unique constraints!
-- =====================================================================

-- 1. Ensure category column exists
ALTER TABLE public.landmarks ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Delete existing duplicate landmark rows (keep only 1 per project + name)
DELETE FROM public.landmarks a
USING public.landmarks b
WHERE a.project_id = b.project_id
  AND LOWER(TRIM(a.name)) = LOWER(TRIM(b.name))
  AND a.id > b.id;

-- 3. Add UNIQUE constraint on (project_id, name) so duplicates can NEVER happen again
ALTER TABLE public.landmarks
DROP CONSTRAINT IF EXISTS unique_project_landmark_name;

ALTER TABLE public.landmarks
ADD CONSTRAINT unique_project_landmark_name UNIQUE (project_id, name);

-- 4. Upsert Landmarks cleanly for Rasi Garden, Kongu Nagar & Kongu Garden
INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Greenwood Matriculation Higher Secondary School', '1.0 KM', '3 Mins Drive', 'education', 1 FROM public.projects WHERE slug = 'rasi-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Namakkal Central Bus Stand', '1.8 KM', '5 Mins Drive', 'transit', 2 FROM public.projects WHERE slug = 'rasi-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Namakkal Government Medical College Hospital', '2.5 KM', '7 Mins Drive', 'medical', 3 FROM public.projects WHERE slug = 'rasi-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Salem - Trichy National Highway (NH-44)', '500 M', '2 Mins Drive', 'transport', 4 FROM public.projects WHERE slug = 'rasi-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Spectrum Matriculation Higher Secondary School', '1.2 KM', '4 Mins Drive', 'education', 1 FROM public.projects WHERE slug = 'kongu-nagar'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'SPK Multi-Specialty Hospital', '2.1 KM', '6 Mins Drive', 'medical', 2 FROM public.projects WHERE slug = 'kongu-nagar'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Namakkal Railway Station', '3.5 KM', '10 Mins Drive', 'transit', 3 FROM public.projects WHERE slug = 'kongu-nagar'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Kandaswami Kandar College', '2.0 KM', '5 Mins Drive', 'education', 1 FROM public.projects WHERE slug = 'kongu-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Paramathi Velur Bus Stand', '1.5 KM', '4 Mins Drive', 'transit', 2 FROM public.projects WHERE slug = 'kongu-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;

INSERT INTO public.landmarks (project_id, name, distance_label, travel_time_label, category, display_order)
SELECT id, 'Paramathi Government Hospital', '1.8 KM', '5 Mins Drive', 'medical', 3 FROM public.projects WHERE slug = 'kongu-garden'
ON CONFLICT (project_id, name) DO UPDATE SET distance_label = EXCLUDED.distance_label, travel_time_label = EXCLUDED.travel_time_label, category = EXCLUDED.category;
