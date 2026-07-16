-- =====================================================================
-- SEED: supabase/seeds/homepage-v2.sql
-- =====================================================================

INSERT INTO public.content_pages (id, page_key, title, slug, content, published)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'home',
  'Your Choice Properties | Home',
  'home',
  '{
    "hero_enabled": true,
    "hero_media_type": "image",
    "desktop_image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
    "mobile_image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    "desktop_video": "",
    "mobile_video": "",
    "poster_image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "overlay_opacity": 70,
    "text_alignment": "center",
    "hero_h1": "Your Choice Properties – Trusted Plots, Villas and Houses in Namakkal and Paramathi Velur",
    "hero_description": "Explore residential plots, gated-community villas and independent houses across our projects in Namakkal and Paramathi Velur.",
    "primary_cta_label": "Explore Projects",
    "primary_cta_link": "/projects",
    "secondary_cta_label": "Schedule a Site Visit",
    "intro_h2": "Find Residential Plots and Dream Villas in Namakkal and Paramathi Velur",
    "intro_content": "Looking for residential plots for sale in Namakkal or a dream villa in Namakkal or Paramathi Velur?\n\nYour Choice Properties is a trusted name for families looking to buy residential land, villas and independent houses at honest prices. Across our three main projects—Rasi Garden, Kongu Nagar and Kongu Garden—we offer investment-ready residential plots and thoughtfully planned 2BHK, 3BHK and 4BHK villas.\n\nWhether you are buying your first home, investing from abroad or looking for a larger family home, our team helps you understand the location, layout, documents and available property choices before you decide.",
    "why_choose_us_items": [
      {
        "title": "Clear Documentation",
        "description": "We explain the available property documents clearly before booking."
      },
      {
        "title": "Good Locations",
        "description": "Our projects are placed near useful roads, schools, hospitals and growing areas."
      },
      {
        "title": "Site-Visit Support",
        "description": "Our team helps you visit and compare the projects before deciding."
      },
      {
        "title": "Loan Guidance",
        "description": "We guide eligible buyers in understanding available home-loan options."
      }
    ],
    "gallery_heading": "See Our Projects",
    "gallery_description": "View real site photos, villa designs, roads, layouts and construction updates from our projects.",
    "gallery_cta": "View Gallery",
    "final_cta_heading": "Visit the Project Before You Decide",
    "final_cta_description": "Tell us which location or property you are interested in, and our team will arrange a guided site visit."
  }'::jsonb,
  true
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = public.content_pages.content || EXCLUDED.content,
  published = true,
  updated_at = NOW();

-- Update Homepage SEO record
INSERT INTO public.seo_metadata (entity_type, entity_id, meta_title, meta_description, canonical_url, index_enabled)
VALUES (
  'page',
  '11111111-0000-0000-0000-000000000001',
  'Your Choice Properties | Plots & Villas in Namakkal',
  'Buy DTCP-approved plots, 2BHK, 3BHK and 4BHK villas and houses in Namakkal and Paramathi Velur. Explore Rasi Garden, Kongu Nagar and Kongu Garden. Enquire today.',
  'https://yourchoiceproperties.in',
  true
)
ON CONFLICT (entity_type, entity_id) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();
