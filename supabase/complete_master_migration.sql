-- =====================================================================
-- COMPLETE MASTER MIGRATION FILE FOR SUPABASE SQL EDITOR
-- PROJECT: Your Choice Properties (All Tables, Columns, Policies & Seed Data)
-- =====================================================================
-- Safe to run multiple times! Uses IF NOT EXISTS / NOT EXISTS checks / DROP POLICY IF EXISTS.
-- =====================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('super_admin', 'content_admin', 'sales_admin')) NOT NULL DEFAULT 'sales_admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_profiles
        WHERE id = auth.uid()
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_profiles
        WHERE id = auth.uid()
          AND is_active = true
          AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    hero_image_path TEXT,
    hero_video_path TEXT,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    map_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    location_status TEXT CHECK (location_status IN ('current', 'upcoming')) NOT NULL DEFAULT 'current',
    show_in_navigation BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS location_status TEXT CHECK (location_status IN ('current', 'upcoming')) NOT NULL DEFAULT 'current',
ADD COLUMN IF NOT EXISTS show_in_navigation BOOLEAN NOT NULL DEFAULT true;

DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    project_status TEXT CHECK (project_status IN ('Upcoming', 'Ongoing', 'Completed')) DEFAULT 'Ongoing',
    approval_type TEXT,
    approval_number TEXT,
    total_area TEXT,
    total_plots INT DEFAULT 0,
    total_villas INT DEFAULT 0,
    starting_price NUMERIC,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    map_url TEXT,
    hero_image_path TEXT,
    hero_video_path TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. PROPERTY CONFIGURATIONS TABLE
CREATE TABLE IF NOT EXISTS public.property_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    property_type TEXT CHECK (property_type IN ('Plot', 'Villa', 'Apartment', 'Commercial')) NOT NULL,
    bhk INT DEFAULT 0,
    plot_area TEXT,
    built_up_area TEXT,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    parking TEXT,
    floors INT DEFAULT 1,
    starting_price NUMERIC,
    price_display_mode TEXT CHECK (price_display_mode IN ('On Request', 'Starting From', 'Fixed')) DEFAULT 'Starting From',
    availability_status TEXT CHECK (availability_status IN ('Available', 'Sold Out', 'Fast Filling')) DEFAULT 'Available',
    short_description TEXT,
    full_description TEXT,
    feature_list JSONB NOT NULL DEFAULT '[]'::jsonb,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    hero_image_path TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.property_configurations
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

DROP TRIGGER IF EXISTS update_property_configurations_updated_at ON public.property_configurations;
CREATE TRIGGER update_property_configurations_updated_at
BEFORE UPDATE ON public.property_configurations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. AMENITIES TABLE
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_key TEXT,
    description TEXT,
    category TEXT DEFAULT 'general',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.amenities ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

DROP TRIGGER IF EXISTS update_amenities_updated_at ON public.amenities;
CREATE TRIGGER update_amenities_updated_at
BEFORE UPDATE ON public.amenities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. PROJECT AMENITIES (JOIN TABLE)
CREATE TABLE IF NOT EXISTS public.project_amenities (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES public.amenities(id) ON DELETE CASCADE,
    custom_description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, amenity_id)
);

-- 8. LANDMARKS TABLE
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    distance_label TEXT NOT NULL,
    travel_time_label TEXT,
    category TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_project_landmark_name UNIQUE (project_id, name)
);

ALTER TABLE public.landmarks ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.landmarks ADD COLUMN IF NOT EXISTS category TEXT;

DROP TRIGGER IF EXISTS update_landmarks_updated_at ON public.landmarks;
CREATE TRIGGER update_landmarks_updated_at
BEFORE UPDATE ON public.landmarks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    property_configuration_id UUID REFERENCES public.property_configurations(id) ON DELETE CASCADE,
    media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL DEFAULT 'image',
    storage_path_or_url TEXT NOT NULL,
    thumbnail_path TEXT,
    title TEXT,
    caption TEXT,
    alt_text TEXT,
    category TEXT DEFAULT 'Overview',
    video_url TEXT,
    embed_type TEXT CHECK (embed_type IN ('supabase', 'youtube', 'instagram')) DEFAULT 'supabase',
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_items
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS embed_type TEXT CHECK (embed_type IN ('supabase', 'youtube', 'instagram')) DEFAULT 'supabase';

DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. CONTENT PAGES TABLE
CREATE TABLE IF NOT EXISTS public.content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.content_pages DROP CONSTRAINT IF EXISTS content_pages_page_key_check;
ALTER TABLE public.content_pages ADD CONSTRAINT content_pages_page_key_check
CHECK (page_key IN ('home', 'about', 'services', 'contact', 'privacy', 'terms'));

DROP TRIGGER IF EXISTS update_content_pages_updated_at ON public.content_pages;
CREATE TRIGGER update_content_pages_updated_at
BEFORE UPDATE ON public.content_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. SEO METADATA TABLE
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT,
    open_graph_title TEXT,
    open_graph_description TEXT,
    open_graph_image_path TEXT,
    index_enabled BOOLEAN NOT NULL DEFAULT true,
    sitemap_priority DECIMAL(3,1) DEFAULT NULL CHECK (sitemap_priority IS NULL OR (sitemap_priority >= 0.0 AND sitemap_priority <= 1.0)),
    sitemap_change_frequency VARCHAR(10) DEFAULT NULL CHECK (sitemap_change_frequency IS NULL OR sitemap_change_frequency IN ('always','hourly','daily','weekly','monthly','yearly','never')),
    json_ld_override JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.seo_metadata
  ADD COLUMN IF NOT EXISTS sitemap_priority DECIMAL(3,1) DEFAULT NULL CHECK (sitemap_priority IS NULL OR (sitemap_priority >= 0.0 AND sitemap_priority <= 1.0)),
  ADD COLUMN IF NOT EXISTS sitemap_change_frequency VARCHAR(10) DEFAULT NULL CHECK (sitemap_change_frequency IS NULL OR sitemap_change_frequency IN ('always','hourly','daily','weekly','monthly','yearly','never'));

DROP TRIGGER IF EXISTS update_seo_metadata_updated_at ON public.seo_metadata;
CREATE TRIGGER update_seo_metadata_updated_at
BEFORE UPDATE ON public.seo_metadata
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_type TEXT CHECK (message_type IN ('contact', 'site_visit')) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    property_configuration_id UUID REFERENCES public.property_configurations(id) ON DELETE SET NULL,
    preferred_visit_date DATE,
    preferred_visit_time TEXT,
    message TEXT,
    source_page TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    status TEXT CHECK (status IN ('new', 'contacted', 'site_visit_scheduled', 'completed', 'closed', 'spam')) NOT NULL DEFAULT 'new',
    assigned_admin_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    admin_notes TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.sanitize_public_message_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.role() != 'authenticated' OR NOT public.is_active_admin() THEN
        NEW.status := 'new';
        NEW.assigned_admin_id := NULL;
        NEW.admin_notes := NULL;
        NEW.read_at := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sanitize_message_insert_trigger ON public.messages;
CREATE TRIGGER sanitize_message_insert_trigger
BEFORE INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.sanitize_public_message_insert();

-- 13. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_locations_slug ON public.locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_published ON public.locations(published);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_location ON public.projects(location_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);

CREATE INDEX IF NOT EXISTS idx_configs_slug ON public.property_configurations(slug);
CREATE INDEX IF NOT EXISTS idx_configs_project ON public.property_configurations(project_id);
CREATE INDEX IF NOT EXISTS idx_configs_published ON public.property_configurations(published);

CREATE INDEX IF NOT EXISTS idx_landmarks_project ON public.landmarks(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_project ON public.gallery_items(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_location ON public.gallery_items(location_id);

CREATE INDEX IF NOT EXISTS idx_seo_entity ON public.seo_metadata(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages(message_type);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Drop existing policies safely to prevent duplicates
    DROP POLICY IF EXISTS "Super admins can manage all admin profiles" ON public.admin_profiles;
    DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_profiles;
    DROP POLICY IF EXISTS "Public read published locations" ON public.locations;
    DROP POLICY IF EXISTS "Public read published projects" ON public.projects;
    DROP POLICY IF EXISTS "Public read published configurations" ON public.property_configurations;
    DROP POLICY IF EXISTS "Public read active amenities" ON public.amenities;
    DROP POLICY IF EXISTS "Public read project amenities" ON public.project_amenities;
    DROP POLICY IF EXISTS "Public read landmarks" ON public.landmarks;
    DROP POLICY IF EXISTS "Public read published gallery items" ON public.gallery_items;
    DROP POLICY IF EXISTS "Public read published content pages" ON public.content_pages;
    DROP POLICY IF EXISTS "Public read seo metadata" ON public.seo_metadata;
    DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Public insert valid messages" ON public.messages;
    DROP POLICY IF EXISTS "Active admins manage locations" ON public.locations;
    DROP POLICY IF EXISTS "Active admins manage projects" ON public.projects;
    DROP POLICY IF EXISTS "Active admins manage configurations" ON public.property_configurations;
    DROP POLICY IF EXISTS "Active admins manage amenities" ON public.amenities;
    DROP POLICY IF EXISTS "Active admins manage project amenities" ON public.project_amenities;
    DROP POLICY IF EXISTS "Active admins manage landmarks" ON public.landmarks;
    DROP POLICY IF EXISTS "Active admins manage gallery items" ON public.gallery_items;
    DROP POLICY IF EXISTS "Active admins manage content pages" ON public.content_pages;
    DROP POLICY IF EXISTS "Active admins manage seo metadata" ON public.seo_metadata;
    DROP POLICY IF EXISTS "Active admins manage site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Active admins view & manage messages" ON public.messages;
END $$;

CREATE POLICY "Super admins can manage all admin profiles" ON public.admin_profiles FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Admins can view their own profile" ON public.admin_profiles FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Public read published locations" ON public.locations FOR SELECT USING (published = true OR public.is_active_admin());
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (published = true OR public.is_active_admin());
CREATE POLICY "Public read published configurations" ON public.property_configurations FOR SELECT USING (published = true OR public.is_active_admin());
CREATE POLICY "Public read active amenities" ON public.amenities FOR SELECT USING (active = true OR public.is_active_admin());
CREATE POLICY "Public read project amenities" ON public.project_amenities FOR SELECT USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT USING (true);
CREATE POLICY "Public read published gallery items" ON public.gallery_items FOR SELECT USING (published = true OR public.is_active_admin());
CREATE POLICY "Public read published content pages" ON public.content_pages FOR SELECT USING (published = true OR public.is_active_admin());
CREATE POLICY "Public read seo metadata" ON public.seo_metadata FOR SELECT USING (true);
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert valid messages" ON public.messages FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Active admins manage locations" ON public.locations FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage configurations" ON public.property_configurations FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage amenities" ON public.amenities FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage project amenities" ON public.project_amenities FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage landmarks" ON public.landmarks FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage gallery items" ON public.gallery_items FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage content pages" ON public.content_pages FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage seo metadata" ON public.seo_metadata FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());
CREATE POLICY "Active admins view & manage messages" ON public.messages FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('public-media', 'public-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('private-documents', 'private-documents', false) ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- SEED DATA & SITE SETTINGS CONFIGURATIONS
-- =====================================================================

-- 1. Seed Site Settings (Stats, Testimonials, FAQs, Robots Config)
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'homepage_stats',
    '[
      {"label": "Years of Trust", "value": "12+"},
      {"label": "Happy Homeowners", "value": "1,200+"},
      {"label": "DTCP Layouts Completed", "value": "25+"},
      {"label": "Sq.Ft Developed", "value": "1.5M+"}
    ]'::jsonb
  ),
  (
    'testimonials',
    '[
      {
        "name": "Dr. K. Senthil Nathan",
        "location": "Rasi Garden, Namakkal",
        "rating": 5,
        "comment": "Purchased a 1,500 Sq.Ft villa plot at Rasi Garden. Clear title documents, instant registration, and top-tier blacktop roads. Highly recommend Your Choice Properties for hassle-free buying."
      },
      {
        "name": "Mr. P. Subramaniam",
        "location": "Kongu Nagar, Namakkal",
        "rating": 5,
        "comment": "Constructed a 3BHK independent villa through their construction team. Excellent floor plan customization, transparent pricing, and finished 15 days ahead of schedule!"
      },
      {
        "name": "Mrs. Jayanthi Viswanathan",
        "location": "Kongu Garden, Paramathi Velur",
        "rating": 5,
        "comment": "The free pickup and drop facility for site visits was extremely helpful for our family. Bank housing loan process was completed within 7 working days thanks to their staff."
      }
    ]'::jsonb
  ),
  (
    'faqs',
    '[
      {
        "id": "faq-1",
        "title": "Are all plots and villas DTCP & RERA approved?",
        "content": "Yes, 100% of our layout developments in Namakkal and Paramathi Velur hold full DTCP and RERA statutory approvals. All planning permissions and title deeds are verified by senior legal advisors."
      },
      {
        "id": "faq-2",
        "title": "How do I book a site visit?",
        "content": "You can click \"Schedule Site Visit\" on our website or call +91 98765 43210. We provide free private car pickup and drop facilities for families anywhere in Namakkal, Tiruchengodu, or Paramathi Velur."
      },
      {
        "id": "faq-3",
        "title": "Do you offer assistance with bank housing loans?",
        "content": "Yes, our dedicated documentation team manages the complete bank loan application process. We are pre-approved with nationalized banks including State Bank of India, HDFC Bank, and Canara Bank."
      },
      {
        "id": "faq-4",
        "title": "Can I request custom villa construction on my purchased plot?",
        "content": "Absolutely. We offer complete turn-key villa construction services. Our architects will customize floor plans (2BHK, 3BHK, 4BHK) according to your family requirements and vastu preferences."
      },
      {
        "id": "faq-5",
        "title": "What basic infrastructure is provided in the gated layouts?",
        "content": "All townships are delivered with 30ft & 40ft blacktop asphalt roads, underground drainage network, individual water supply tap connections, street lighting, compound wall, and children park zones."
      }
    ]'::jsonb
  ),
  (
    'robots_config',
    '[
      {
        "userAgent": "*",
        "allow": ["/"],
        "disallow": ["/admin/", "/api/"]
      }
    ]'::jsonb
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Seed Master Amenities for Land Layouts and Villas (Using WHERE NOT EXISTS for safe insertion)
INSERT INTO public.amenities (name, icon_key, description, category, active)
SELECT v.name, v.icon_key, v.description, v.category, v.active
FROM (VALUES
  ('DTCP & RERA Approved', 'shield-check', '100% legal title clearance and approved layout design records for secure resale value.', 'land', true),
  ('30ft & 40ft Blacktop Roads', 'road', 'Wide, heavy-duty asphalt avenues built to local municipal road specifications.', 'land', true),
  ('Gated Community Security', 'lock', 'Fully secured perimeter wall fencing with grand entrance archway & security post.', 'land', true),
  ('Individual Water Taps', 'droplet', 'Concealed sweet groundwater lines routed to every single plot in the layout.', 'land', true),
  ('Concealed Drainage System', 'check-circle-2', 'Underground pipeline network for efficient wastewater and stormwater flow.', 'land', true),
  ('Children Play Park & Trees', 'trees', 'Lush landscaped green buffer zones, children play area, and tree-lined pathways.', 'land', true),
  ('Architectural Customization', 'check-circle-2', 'Work with our expert planners to customize 2BHK, 3BHK, or 4BHK floor plans.', 'house', true),
  ('Covered Car Parking', 'car', 'Spacious portico designed for secure car parking and simple washing access.', 'house', true),
  ('Premium Woodwork & UPVC', 'home', 'Teakwood main frame & doors paired with weatherproof sliding UPVC windows.', 'house', true),
  ('Modern Modular Kitchen', 'utensils', 'Equipped with heavy-duty granite slab counters, stainless sink, and exhaust provisions.', 'house', true),
  ('Dedicated Water Storage', 'droplet', 'Individual overhead water storage tank and underground sump connections.', 'house', true),
  ('100% Vaastu-Compliant', 'compass', 'All construction strictly adheres to traditional Vaastu design principles for peace and prosperity.', 'house', true)
) AS v(name, icon_key, description, category, active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.amenities a WHERE a.name = v.name
);

-- Update existing amenities categories if they exist under different names
UPDATE public.amenities SET category = 'land' WHERE name ILIKE '%road%' OR name ILIKE '%security%' OR name ILIKE '%water%' OR name ILIKE '%drainage%' OR name ILIKE '%park%';
UPDATE public.amenities SET category = 'house' WHERE name ILIKE '%villa%' OR name ILIKE '%kitchen%' OR name ILIKE '%woodwork%' OR name ILIKE '%car%' OR name ILIKE '%vaastu%';

-- 3. Seed Key Nearby Landmarks for Rasi Garden, Kongu Nagar & Kongu Garden (with deduplication)
DELETE FROM public.landmarks a
USING public.landmarks b
WHERE a.project_id = b.project_id
  AND LOWER(TRIM(a.name)) = LOWER(TRIM(b.name))
  AND a.id > b.id;

ALTER TABLE public.landmarks DROP CONSTRAINT IF EXISTS unique_project_landmark_name;
ALTER TABLE public.landmarks ADD CONSTRAINT unique_project_landmark_name UNIQUE (project_id, name);

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
