-- Add category column to amenities table for grouping into 'land', 'house', or 'general'
ALTER TABLE public.amenities ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Seed/Insert existing public amenities for Land & Plot Layout and Villas & Houses safely
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
