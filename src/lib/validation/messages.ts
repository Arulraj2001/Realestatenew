import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[+0-9\s-]{10,18}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  location_id: z.string().uuid().optional().or(z.literal('')),
  project_id: z.string().uuid().optional().or(z.literal('')),
  property_configuration_id: z.string().uuid().optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted regarding property details',
  }),
  website_url: z.string().optional(), // Honeypot trap field
  source_page: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export const siteVisitSchema = contactMessageSchema.extend({
  preferred_visit_date: z.string().optional().or(z.literal('')),
  preferred_visit_time: z.string().optional().or(z.literal('')),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type SiteVisitInput = z.infer<typeof siteVisitSchema>;
