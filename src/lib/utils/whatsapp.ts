import { siteConfig } from '@/config/site';

export interface WhatsAppUrlOptions {
  phone?: string;
  projectName?: string;
  propertyName?: string;
  locationName?: string;
  customMessage?: string;
}

export function buildWhatsAppUrl(options?: WhatsAppUrlOptions): string {
  const number = (options?.phone || siteConfig.contact.whatsapp).replace(/[^0-9]/g, '');

  let text = 'Hello Your Choice Properties, ';

  if (options?.propertyName) {
    text += `I am interested in inquiring about ${options.propertyName}`;
    if (options.projectName) text += ` at ${options.projectName}`;
    if (options.locationName) text += ` (${options.locationName})`;
    text += '.';
  } else if (options?.projectName) {
    text += `I am interested in exploring ${options.projectName}`;
    if (options.locationName) text += ` in ${options.locationName}`;
    text += '.';
  } else if (options?.locationName) {
    text += `I would like to inquire about available layouts in ${options.locationName}.`;
  } else if (options?.customMessage) {
    text += options.customMessage;
  } else {
    text += 'I would like to inquire about your residential plots and villa projects.';
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildCallUrl(phone?: string): string {
  const number = phone || siteConfig.contact.phone;
  return `tel:${number.replace(/[^0-[#\*\+0-9]/g, '')}`;
}
