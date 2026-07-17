-- =====================================================================
-- SEED MIGRATION: Contact Page Content & SEO Metadata
-- =====================================================================
-- Upserts the Contact Us page heading, subtitle, body, and SEO metadata.
-- Run this in Supabase SQL Editor.
-- =====================================================================

INSERT INTO public.content_pages (page_key, title, slug, content, published)
VALUES (
  'contact',
  'Contact Your Choice Properties',
  'contact-us',
  '{
    "heading": "Contact Your Choice Properties",
    "subtitle": "Looking for your dream home or the perfect investment?",
    "body": "Our property experts are here to guide you through every step—from selecting the right plot or villa to documentation and loan assistance. Schedule your site visit today and explore our premium projects."
  }'::jsonb,
  true
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  published = true,
  updated_at = NOW();

-- SEO Metadata record for Contact Page
INSERT INTO public.seo_metadata (entity_type, meta_title, meta_description, canonical_url, index_enabled)
VALUES (
  'page',
  'Contact Your Choice Properties | Villas & Plots in Namakkal & Paramathi velur',
  'Contact Your Choice Properties today for premium villas and DTCP approved plots in Namakkal and Paramathy Velur. Schedule a free site visit.',
  'https://yourchoiceproperties.in/contact-us',
  true
)
ON CONFLICT (id) DO NOTHING;
