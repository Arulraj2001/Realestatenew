-- =====================================================================
-- MIGRATION: 20260715000000_initial_schema.sql
-- PROJECT: Your Choice Properties - Supabase Data Foundation
-- =====================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Automated updated_at trigger function
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

CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- HELPER FUNCTIONS FOR SECURITY DEFINER AUTH CHECKS
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
    hero_image_path TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_property_configurations_updated_at
BEFORE UPDATE ON public.property_configurations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. AMENITIES TABLE
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon_key TEXT,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. CONTENT PAGES TABLE
CREATE TABLE IF NOT EXISTS public.content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT UNIQUE NOT NULL CHECK (page_key IN ('home', 'about', 'services', 'contact')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_content_pages_updated_at
BEFORE UPDATE ON public.content_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. SEO METADATA TABLE
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'page', 'location', 'project', 'configuration'
    entity_id UUID,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT,
    open_graph_title TEXT,
    open_graph_description TEXT,
    open_graph_image_path TEXT,
    index_enabled BOOLEAN NOT NULL DEFAULT true,
    json_ld_override JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_seo_metadata_updated_at
BEFORE UPDATE ON public.seo_metadata
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. MESSAGES TABLE (Contact and Site-Visit submissions)
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

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to prevent public users from overriding privileged fields on INSERT
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

-- ADMIN PROFILES RLS
CREATE POLICY "Super admins can manage all admin profiles"
ON public.admin_profiles FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- PUBLIC CONTENT READ POLICIES
CREATE POLICY "Public read published locations"
ON public.locations FOR SELECT
USING (published = true OR public.is_active_admin());

CREATE POLICY "Public read published projects"
ON public.projects FOR SELECT
USING (published = true OR public.is_active_admin());

CREATE POLICY "Public read published configurations"
ON public.property_configurations FOR SELECT
USING (published = true OR public.is_active_admin());

CREATE POLICY "Public read active amenities"
ON public.amenities FOR SELECT
USING (active = true OR public.is_active_admin());

CREATE POLICY "Public read project amenities"
ON public.project_amenities FOR SELECT
USING (true);

CREATE POLICY "Public read landmarks"
ON public.landmarks FOR SELECT
USING (true);

CREATE POLICY "Public read published gallery items"
ON public.gallery_items FOR SELECT
USING (published = true OR public.is_active_admin());

CREATE POLICY "Public read published content pages"
ON public.content_pages FOR SELECT
USING (published = true OR public.is_active_admin());

CREATE POLICY "Public read seo metadata"
ON public.seo_metadata FOR SELECT
USING (true);

CREATE POLICY "Public read site settings"
ON public.site_settings FOR SELECT
USING (true);

-- PUBLIC MESSAGES INSERT POLICY (Strict Insert Only)
CREATE POLICY "Public insert valid messages"
ON public.messages FOR INSERT
TO public
WITH CHECK (true);

-- ADMIN MANAGEMENT WRITE POLICIES
CREATE POLICY "Active admins manage locations"
ON public.locations FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage projects"
ON public.projects FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage configurations"
ON public.property_configurations FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage amenities"
ON public.amenities FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage project amenities"
ON public.project_amenities FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage landmarks"
ON public.landmarks FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage gallery items"
ON public.gallery_items FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage content pages"
ON public.content_pages FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage seo metadata"
ON public.seo_metadata FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins manage site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE POLICY "Active admins view & manage messages"
ON public.messages FOR ALL TO authenticated
USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

-- =====================================================================
-- STORAGE BUCKETS & STORAGE POLICIES
-- =====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-documents', 'private-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Public Media Storage Policies
CREATE POLICY "Public read public-media storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-media');

CREATE POLICY "Admins manage public-media storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'public-media' AND public.is_active_admin())
WITH CHECK (bucket_id = 'public-media' AND public.is_active_admin());

-- Private Documents Storage Policies
CREATE POLICY "Admins read private-documents storage"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'private-documents' AND public.is_active_admin());

CREATE POLICY "Admins manage private-documents storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'private-documents' AND public.is_active_admin())
WITH CHECK (bucket_id = 'private-documents' AND public.is_active_admin());
