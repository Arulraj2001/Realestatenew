-- =====================================================================
-- SEED MIGRATION: 10 Frequently Asked Questions (FAQs)
-- =====================================================================
-- Upserts the 10 FAQs into site_settings under key 'faqs'
-- This updates both the Admin Panel (Admin -> Settings) and public FAQ section!
-- =====================================================================

INSERT INTO public.site_settings (key, value)
VALUES (
  'faqs',
  '[
    {
      "id": "faq-1",
      "title": "Are your plots DTCP approved?",
      "content": "Yes, our residential layouts — including Rasi Garden, Kongu Nagar, and Kongu Garden — are developed as DTCP-approved plots with clear documentation."
    },
    {
      "id": "faq-2",
      "title": "Do you provide clear title and patta for plots?",
      "content": "Yes, every plot sold by Your Choice Properties comes with clear title documents and patta, along with full support during the registration process."
    },
    {
      "id": "faq-3",
      "title": "What plot sizes are available?",
      "content": "Plot sizes vary by project and layout. Our team can share available dimensions and pricing for Rasi Garden, Kongu Nagar, and Kongu Garden during a site visit or consultation."
    },
    {
      "id": "faq-4",
      "title": "Do villas come with basic amenities like roads, drainage, and lighting?",
      "content": "Yes, all our residential layouts include internal roads, underground drainage, and street lighting as part of the planned infrastructure."
    },
    {
      "id": "faq-5",
      "title": "What villa configurations do you offer?",
      "content": "We offer 2BHK, 3BHK, and 4BHK villas and independent houses across our projects, so families of different sizes and budgets can find the right fit."
    },
    {
      "id": "faq-6",
      "title": "Are the villas ready to move in?",
      "content": "Many of our villas are ready-to-occupy, while some are available at various stages of construction. Our team can confirm current availability for each project."
    },
    {
      "id": "faq-7",
      "title": "Do you help with home loans or financing?",
      "content": "Yes, our team assists buyers with loan and financing guidance to make purchasing a plot or villa in Namakkal or Paramathy Velur more accessible."
    },
    {
      "id": "faq-8",
      "title": "What is the process to book a plot or villa?",
      "content": "The process typically starts with a free site visit, followed by document verification, booking, and registration — our team guides you through each step personally."
    },
    {
      "id": "faq-9",
      "title": "Can NRIs purchase property with Your Choice Properties?",
      "content": "Yes, we regularly assist NRI buyers looking to invest in plots and villas back home in Namakkal and Paramathy Velur, with remote consultation and documentation support available."
    },
    {
      "id": "faq-10",
      "title": "Do you offer support after the property is registered?",
      "content": "Yes, our relationship doesn''t end at registration — we provide after-sales support for documentation, queries, and any assistance you may need as a homeowner."
    }
  ]'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
