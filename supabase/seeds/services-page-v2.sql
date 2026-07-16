-- =====================================================================
-- SEED: supabase/seeds/services-page-v2.sql
-- =====================================================================

INSERT INTO public.content_pages (id, page_key, title, slug, content, published)
VALUES (
  '33333333-0000-0000-0000-000000000003',
  'services',
  'Our Real Estate Services in Namakkal and Paramathi Velur',
  'services',
  '{
    "services_h1": "Our Real Estate Services in Namakkal and Paramathi Velur",
    "services_intro": "Our team helps you choose the right plot or villa and supports you from your first enquiry through site visit, documentation and registration.",
    "services_list": [
      {
        "id": "srv-1",
        "title": "Residential Plot Sales",
        "icon": "Maximize",
        "content": "We offer DTCP-approved residential plots in Namakkal and Paramathi Velur for buyers who want to build a home or invest in land. Our team explains the location, available plot sizes, documents and current price before you decide."
      },
      {
        "id": "srv-2",
        "title": "Villa and House Sales — 2BHK, 3BHK and 4BHK",
        "icon": "Building2",
        "content": "We help families explore 2BHK, 3BHK and 4BHK villas and independent houses across Rasi Garden, Kongu Nagar and Kongu Garden. Available choices depend on the project and current construction status."
      },
      {
        "id": "srv-3",
        "title": "Site Visits and Consultation",
        "icon": "Car",
        "content": "Our local team arranges guided site visits so you can compare the location, roads, layout, villa design and nearby facilities before making a decision."
      },
      {
        "id": "srv-4",
        "title": "Documentation and Registration Support",
        "icon": "FileCheck",
        "content": "We guide buyers through available title documents, patta-related information, booking paperwork and registration. Buyers should independently verify all legal documents before purchase."
      },
      {
        "id": "srv-5",
        "title": "Home-Loan Assistance",
        "icon": "Landmark",
        "content": "We guide eligible buyers in understanding available loan and financing options. Final approval, interest rates and terms are decided by the bank or financial institution."
      }
    ],
    "cta_heading": "Need Help Choosing the Right Plot or Villa?",
    "cta_description": "Talk to our team and explore suitable property options in Namakkal and Paramathi Velur.",
    "primary_cta_label": "Talk to Our Team",
    "secondary_cta_label": "Schedule a Site Visit"
  }'::jsonb,
  true
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = public.content_pages.content || EXCLUDED.content,
  published = true,
  updated_at = NOW();
