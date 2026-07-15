export type ConversionEvent =
  | 'contact_submitted'
  | 'site_visit_submitted'
  | 'whatsapp_clicked'
  | 'call_clicked'
  | 'map_clicked';

type GtagFn = (...args: unknown[]) => void;

export function trackConversionEvent(
  event: ConversionEvent,
  metadata?: Record<string, string | number | boolean | undefined | null>
) {
  if (typeof window !== 'undefined') {
    // Log event to browser console for verification
    console.log(`[CONVERSION EVENT] ${event}:`, metadata || {});

    // Integrate with window.gtag if present
    const win = window as unknown as { gtag?: GtagFn };
    if (typeof win.gtag === 'function') {
      win.gtag('event', event, metadata);
    }
  }
}
