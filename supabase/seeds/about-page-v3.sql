-- =====================================================================
-- SEED: supabase/seeds/about-page-v3.sql
-- Description: Seed About Us page content including why choose us left highlight card
-- =====================================================================

INSERT INTO public.content_pages (id, page_key, title, slug, content, published)
VALUES (
  '22222222-0000-0000-0000-000000000002',
  'about',
  'About Your Choice Properties | Real Estate Company in Namakkal',
  'about-us',
  '{
    "about_h1": "Your Trusted Real Estate Partner in Namakkal and Paramathi Velur",
    "about_intro": "Your Choice Properties was started with a simple promise: honest property guidance for families in Namakkal and Paramathi Velur.\n\nWe understand that buying a plot or home is an important life decision. That is why our projects—Rasi Garden, Kongu Nagar and Kongu Garden—are developed with a focus on clear communication, useful locations, planned layouts and genuine value.\n\nOur team helps customers understand the property, arrange site visits and complete the buying process with proper support.",
    "why_choice_heading": "Why We Are the Right Choice",
    "why_left_title": "Your Preferred Real Estate Developer",
    "why_left_desc": "We combine DTCP regulatory compliance, transparent sub-registrar documentation, and strategic layout locations to protect your capital and build genuine long-term value.",
    "why_left_checklist": [
      "100% Verified Legal Documents",
      "Zero Hidden Fees or Charges",
      "Guided Private Site Visit Transport"
    ],
    "why_choose_us_items": [
      {
        "title": "Prime Location",
        "description": "Projects in growing areas with useful road access and future development potential."
      },
      {
        "title": "DTCP Approved",
        "description": "Residential plots and projects presented with the required approvals and available documents."
      },
      {
        "title": "Loan Assistance",
        "description": "Guidance for eligible buyers who want to understand available home-loan options."
      },
      {
        "title": "Clear Documentation",
        "description": "We explain the available property documents and registration process clearly."
      },
      {
        "title": "Growth Potential",
        "description": "Projects selected for residential use and long-term property value."
      },
      {
        "title": "Trusted Support",
        "description": "Personal support from site visit through booking and registration."
      }
    ],
    "founder_name": "Thennarasu Sambathkumar",
    "founder_role": "Managing Director",
    "founder_content": "Your Choice Properties is led by Thennarasu Sambathkumar, who has more than 13 years of experience in land development, villa construction and residential property sales in Tamil Nadu.\n\nBefore starting Your Choice Properties in 2024, he worked for six years as a Director at VIP Housing and Properties and another six years as a Director at MG Properties. This experience helped him understand land selection, layout planning, villa construction and the practical needs of property buyers.\n\nHis approach is simple: \"We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.\"",
    "founder_image": "",
    "founder_quote": "We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.",
    "stats_visible": true,
    "stats_list": [
      { "label": "Years of Experience", "value": "13+" },
      { "label": "Successful Projects", "value": "5" },
      { "label": "Happy Customers", "value": "135+" },
      { "label": "Plots Sold", "value": "120+" },
      { "label": "Villas Sold", "value": "15+" }
    ],
    "timeline_milestones": [
      {
        "year": "2011",
        "title": "Foundational Real Estate Mastery",
        "subtitle": "Land Acquisition & Legal Due Diligence",
        "description": "Key leadership entered real estate development in Tamil Nadu, establishing rigorous 100% title clearance standards and sub-registrar document verification procedures.",
        "badge": "Foundation"
      },
      {
        "year": "2018",
        "title": "Township Infrastructure Expansion",
        "subtitle": "Gated Layout & Blacktop Road Engineering",
        "description": "Spearheaded major residential layout planning across Namakkal and Salem highway corridors, installing 40ft blacktop avenues, underground drainage, and street lighting.",
        "badge": "Growth Era"
      },
      {
        "year": "2023",
        "title": "DTCP & RERA Sanctioned Projects",
        "subtitle": "Flagship Namakkal & Paramathi Velur Hubs",
        "description": "Launched premier layout townships with statutory DTCP and RERA approvals, introducing custom 2BHK, 3BHK, and 4BHK villa construction capabilities for homebuyers.",
        "badge": "Approval Milestone"
      },
      {
        "year": "2024",
        "title": "Establishment of Your Choice Properties",
        "subtitle": "Dedicated Customer-Centric Brand",
        "description": "Formally established Your Choice Properties as a dedicated real-estate brand to deliver plot layouts (Rasi Garden, Kongu Nagar, Kongu Garden) with end-to-end customer support.",
        "badge": "Brand Establishment"
      },
      {
        "year": "Present & Future",
        "title": "Turnkey Luxury Villa & Township Ecosystems",
        "subtitle": "Continued Legacy & Regional Leadership",
        "description": "Expanding sustainable gated layouts and turn-key custom villa communities across Tamil Nadu with complementary site-visit transport and bank loan assistance.",
        "badge": "Current Vision"
      }
    ],
    "cta_heading": "Let Us Help You Find the Right Property",
    "cta_description": "Talk to our team or schedule a visit to one of our projects in Namakkal or Paramathi Velur."
  }'::jsonb,
  true
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  content = public.content_pages.content || EXCLUDED.content,
  published = true,
  updated_at = NOW();
