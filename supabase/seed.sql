-- =====================================================================
-- SEED DATA: supabase/seed.sql
-- PROJECT: Your Choice Properties
-- =====================================================================

-- 1. SEED LOCATIONS
INSERT INTO public.locations (id, name, slug, short_description, full_description, address, display_order, published, featured)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'Namakkal',
    'namakkal',
    'Rapidly growing educational and industrial hub with prime residential communities.',
    'Namakkal is renowned for its strategic connectivity, bustling institutional network, and peaceful residential layouts ideal for modern villa homes and plotted developments.',
    'Namakkal City, Tamil Nadu - 637001',
    1,
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Paramathi Velur',
    'paramathi-velur',
    'Scenic riverside town offering peaceful, high-appreciation residential properties.',
    'Located along the banks of the Cauvery, Paramathi Velur offers excellent agrarian vistas combined with modern gated township amenities.',
    'Paramathi Velur, Namakkal District, Tamil Nadu - 637207',
    2,
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PROJECTS
INSERT INTO public.projects (id, location_id, name, slug, short_description, full_description, project_status, approval_type, total_plots, total_villas, starting_price, address, featured, published, display_order)
VALUES 
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111', -- Namakkal
    'Rasi Garden',
    'rasi-garden',
    'Premium DTCP approved villa plots and luxury independent homes in Namakkal.',
    'Rasi Garden offers meticulously planned residential plots with blacktop roads, underground drainage, street lights, and instant villa construction readiness.',
    'Ongoing',
    'DTCP Approved',
    45,
    12,
    1850000,
    'Near Salem Main Road Bypass, Namakkal',
    true,
    true,
    1
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111', -- Namakkal
    'Kongu Nagar',
    'kongu-nagar',
    'Gated residential layout featuring custom 2BHK and 3BHK villas.',
    'Kongu Nagar is designed for modern family living with compound wall security, dedicated children play area, and solar street lighting.',
    'Ongoing',
    'DTCP & RERA Approved',
    30,
    18,
    3200000,
    'Tiruchengodu Highway, Namakkal',
    true,
    true,
    2
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222', -- Paramathi Velur
    'Kongu Garden',
    'kongu-garden',
    'Serene green township in Paramathi Velur with riverside proximity.',
    'Kongu Garden brings affordable luxury with 24x7 security, water supply line, and wide blacktop avenues.',
    'Ongoing',
    'DTCP Approved',
    60,
    20,
    1450000,
    'Velur Main Road, Paramathi Velur',
    true,
    true,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PROPERTY CONFIGURATIONS
INSERT INTO public.property_configurations (project_id, name, slug, property_type, bhk, plot_area, built_up_area, bedrooms, bathrooms, starting_price, availability_status, short_description, featured, published, display_order)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Rasi Garden
    'Rasi Garden - Residential Plot 1200 Sq.Ft',
    'rasi-garden-plot-1200',
    'Plot',
    0,
    '1200 Sq.Ft (30x40)',
    'N/A',
    0,
    0,
    1850000,
    'Available',
    'Corner & regular DTCP approved residential plot with 30ft blacktop road access.',
    true,
    true,
    1
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Rasi Garden
    'Rasi Garden - 3BHK Luxury Villa',
    'rasi-garden-3bhk-villa',
    'Villa',
    3,
    '1500 Sq.Ft',
    '1850 Sq.Ft',
    3,
    3,
    4800000,
    'Fast Filling',
    'Contemporary 2-level 3BHK elevation with covered parking, modular kitchen setup, and teakwood doors.',
    true,
    true,
    2
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Kongu Nagar
    'Kongu Nagar - 2BHK Modern Villa',
    'kongu-nagar-2bhk-villa',
    'Villa',
    2,
    '1200 Sq.Ft',
    '1350 Sq.Ft',
    2,
    2,
    3450000,
    'Available',
    'Vastu-compliant 2BHK ground floor villa with open terrace and garden space.',
    true,
    true,
    1
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Kongu Garden
    'Kongu Garden - Green Residential Plot',
    'kongu-garden-plot-1500',
    'Plot',
    0,
    '1500 Sq.Ft',
    'N/A',
    0,
    0,
    1450000,
    'Available',
    'High-appreciation plot ready for immediate construction with clear legal titles.',
    true,
    true,
    1
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED INITIAL AMENITIES
INSERT INTO public.amenities (id, name, icon_key, description, active)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'DTCP & RERA Approved', 'shield-check', '100% legal title clearance and government approved layout plans.', true),
  ('a2222222-2222-2222-2222-222222222222', '30ft & 40ft Blacktop Roads', 'road', 'Heavy-duty asphalt TAR roads throughout the gated layout.', true),
  ('a3333333-3333-3333-3333-333333333333', 'Gated Community Security', 'lock', '24x7 security personnel with perimeter wall and entrance arch.', true),
  ('a4444444-4444-4444-4444-444444444444', 'Underground Drainage & Water', 'droplet', 'Individual water connection tap and concealed drainage lines.', true),
  ('a5555555-5555-5555-5555-555555555555', 'Solar Street Lighting', 'sun', 'Energy-efficient automated LED solar lighting along all avenues.', true),
  ('a6666666-6666-6666-6666-666666666666', 'Children Park & Green Belt', 'trees', 'Landscaped park with play equipment and tree-lined walkways.', true)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'contact_info',
    '{
      "company_name": "Your Choice Properties",
      "phone": "+91 98765 43210",
      "whatsapp": "+919876543210",
      "email": "info@yourchoiceproperties.in",
      "address": "Main Road, Namakkal, Tamil Nadu - 637001",
      "working_hours": "Mon - Sun: 9:00 AM - 8:00 PM"
    }'::jsonb
  ),
  (
    'social_links',
    '{
      "facebook": "https://facebook.com/yourchoiceproperties",
      "instagram": "https://instagram.com/yourchoiceproperties",
      "youtube": "https://youtube.com/@yourchoiceproperties"
    }'::jsonb
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. SEED CONTENT PAGES
INSERT INTO public.content_pages (page_key, title, slug, content, published)
VALUES
  (
    'home',
    'Home - Your Choice Properties',
    'home',
    '{
      "hero_title": "Discover Your Dream Villa & Plot in Namakkal & Surrounding Hubs",
      "hero_subtitle": "DTCP Approved Gated Communities, Premium Villa Plots, and Turnkey Homes with 100% Title Clearance.",
      "cta_text": "Schedule Site Visit"
    }'::jsonb,
    true
  ),
  (
    'about',
    'About Us - Your Choice Properties',
    'about',
    '{
      "heading": "Building Trust, Delighting Homeowners across Tamil Nadu",
      "body": "Your Choice Properties is a premier real-estate development firm dedicated to crafting high-value gated townships, villa projects, and residential plot layouts."
    }'::jsonb,
    true
  ),
  (
    'services',
    'Our Services - Your Choice Properties',
    'services',
    '{
      "heading": "Comprehensive Real Estate Solutions",
      "body": "From DTCP layout development and custom villa construction to land title verification and housing bank loan assistance."
    }'::jsonb,
    true
  ),
  (
    'contact',
    'Contact Us - Your Choice Properties',
    'contact',
    '{
      "heading": "Get in Touch With Our Property Experts",
      "body": "Call or drop a message to schedule an exclusive site visit with free pickup & drop facility."
    }'::jsonb,
    true
  )
ON CONFLICT (page_key) DO UPDATE SET content = EXCLUDED.content;
