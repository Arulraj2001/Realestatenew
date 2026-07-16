-- =====================================================================
-- MIGRATION: 20260716000000_seed_stats_testimonials_faqs.sql
-- Adds default homepage_stats, testimonials, and faqs to site_settings
-- Run this once in Supabase SQL Editor after the initial schema migration
-- =====================================================================

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
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
