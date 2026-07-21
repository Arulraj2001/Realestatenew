export function getMediaUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return '';
  let clean = pathOrUrl.trim();

  // Strip wrapping quotes if string was JSON-serialized with extra quotes
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }

  if (!clean) return '';

  // Already an absolute HTTP(S), Data, or Blob URL
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');

  // Absolute path on domain (e.g. /storage/... or /images/...)
  if (clean.startsWith('/')) {
    if (clean.startsWith('/storage/') && supabaseUrl) {
      return `${supabaseUrl}${clean}`;
    }
    return clean;
  }

  // Relative storage path (e.g. "properties/123.jpg" or "public-media/properties/123.jpg")
  if (supabaseUrl) {
    const cleanPath = clean.replace(/^public-media\//, '');
    return `${supabaseUrl}/storage/v1/object/public/public-media/${cleanPath}`;
  }

  return `/${clean}`;
}

export function parseGalleryImages(galleryImages: unknown): string[] {
  if (!galleryImages) return [];
  let items: unknown[] = [];

  if (Array.isArray(galleryImages)) {
    items = galleryImages;
  } else if (typeof galleryImages === 'string') {
    const str = galleryImages.trim();
    if (!str || str === '[]') return [];

    try {
      let parsed = JSON.parse(str);
      // Support double-encoded JSON strings
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          // Keep single parsed string
        }
      }

      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (typeof parsed === 'string' && parsed.trim().length > 0) {
        items = [parsed];
      }
    } catch {
      // Single unparsed URL or path string
      items = [str];
    }
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        return (
          obj.url ||
          obj.publicUrl ||
          obj.public_url ||
          obj.path ||
          obj.src ||
          obj.storage_path_or_url ||
          ''
        ) as string;
      }
      return '';
    })
    .filter((str): str is string => Boolean(str && str.length > 0))
    .map((str) => getMediaUrl(str))
    .filter((str) => str.length > 0);
}
