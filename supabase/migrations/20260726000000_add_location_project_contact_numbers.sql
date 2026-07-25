-- Migration: Add phone and whatsapp columns to locations and projects tables for location-based contact routing

ALTER TABLE locations 
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50) DEFAULT NULL;

ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50) DEFAULT NULL;

COMMENT ON COLUMN locations.phone IS 'Optional location-specific phone hotline number';
COMMENT ON COLUMN locations.whatsapp IS 'Optional location-specific WhatsApp number';
COMMENT ON COLUMN projects.phone IS 'Optional project-specific phone hotline override';
COMMENT ON COLUMN projects.whatsapp IS 'Optional project-specific WhatsApp override';
