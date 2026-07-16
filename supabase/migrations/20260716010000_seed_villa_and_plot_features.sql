-- =====================================================================
-- MIGRATION: 20260716010000_seed_villa_and_plot_features.sql
-- Description: Populate comprehensive interior & plot feature lists
-- =====================================================================

-- 1. Rasi Garden 3BHK Luxury Villa
UPDATE public.property_configurations
SET feature_list = jsonb_build_array(
  'Premium Duplex Villa',
  'Internal Staircase',
  'Fully Designed Premium Interiors',
  'Spacious Living Hall',
  'Covered Car Parking',
  '3 Bedrooms with Attached Bathrooms',
  'Designer Wooden Pooja Unit',
  'Modular Kitchen with Dining Area',
  'First Floor Family Lounge with TV Unit',
  'Bedroom with Built-in Cot',
  'Ready-to-Move-In Luxury Home'
)
WHERE slug = 'rasi-garden-3bhk-villa' OR name ILIKE '%3BHK%';

-- 2. Kongu Nagar 2BHK Villa
UPDATE public.property_configurations
SET feature_list = jsonb_build_array(
  'Modern Single-Floor Independent Villa',
  'Spacious Open-Concept Living Room',
  'Covered Private Car Parking Space',
  '2 Bedrooms with Attached Bathrooms',
  'Custom Modular Kitchen & Utility Space',
  '100% Vastu Compliant Floor Layout',
  'Individual Borewell & Water Storage Line',
  'Compound Wall with Grand Entry Gate',
  'DTCP Approved Ready-to-Move House'
)
WHERE slug = 'kongu-nagar-2bhk-villa' OR name ILIKE '%2BHK%';

-- 3. Rasi Garden Plot 1200 Sq.Ft
UPDATE public.property_configurations
SET feature_list = jsonb_build_array(
  'DTCP & RERA Approved Corner House Plot',
  '40ft & 30ft Blacktop Tar Access Roads',
  'Underground Sewage & Drainage Lines',
  'Individual Electricity Pole & Water Line Points',
  '24/7 Gated Security & Perimeter Fencing',
  'Immediate Construction-Ready Land',
  'High Appreciation Investment Site'
)
WHERE slug = 'rasi-garden-plot-1200' OR property_type = 'Plot';

-- 4. Kongu Garden Plot 1500 Sq.Ft
UPDATE public.property_configurations
SET feature_list = jsonb_build_array(
  'Premium Gated House Site in Paramathi Velur',
  'Wide Avenue Tar Roads with Solar Streetlights',
  'Potable Underground Fresh Water Hub',
  'Avenue Tree Plantation & Park Reserve',
  'Bank Loan Approved Clear Title Deed',
  'Quick Access to NH Highway & Bus Stand'
)
WHERE slug = 'kongu-garden-plot-1500';
