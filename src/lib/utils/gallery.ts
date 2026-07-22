/** Shared Gallery Utility — single source of truth for type detection, thumbnails, grouping. */
import { GalleryItem } from '@/types/database';
import { getMediaUrl } from '@/lib/utils/media';

const FALLBACK = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

// ─── Type Detectors ───────────────────────────────────────────────────────────

export function isYouTubeItem(item: GalleryItem): boolean {
  if (item.media_type === 'youtube' || item.embed_type === 'youtube') return true;
  const url = item.video_url || item.storage_path_or_url || '';
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export function isInstagramItem(item: GalleryItem): boolean {
  if (item.media_type === 'instagram' || item.embed_type === 'instagram') return true;
  const url = item.video_url || item.storage_path_or_url || '';
  return url.includes('instagram.com');
}

export function isVideoItem(item: GalleryItem): boolean {
  return (
    (item.media_type === 'video' || item.embed_type === 'supabase') &&
    !isYouTubeItem(item) &&
    !isInstagramItem(item)
  );
}

export function isPhotoItem(item: GalleryItem): boolean {
  return !isYouTubeItem(item) && !isInstagramItem(item) && !isVideoItem(item);
}

export type GalleryMediaKind = 'photo' | 'youtube' | 'instagram' | 'video';

export function getMediaKind(item: GalleryItem): GalleryMediaKind {
  if (isYouTubeItem(item)) return 'youtube';
  if (isInstagramItem(item)) return 'instagram';
  if (isVideoItem(item)) return 'video';
  return 'photo';
}

// ─── YouTube Helpers ──────────────────────────────────────────────────────────

export function getYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeId(url);
  if (!id) return null;
  return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
}

export function getYoutubeThumbnail(url: string, quality: 'hq' | 'mq' = 'hq'): string | null {
  const id = getYoutubeId(url);
  if (!id) return null;
  const suffix = quality === 'hq' ? '/hqdefault.jpg' : '/mqdefault.jpg';
  return 'https://img.youtube.com/vi/' + id + suffix;
}

// ─── Instagram Helpers ────────────────────────────────────────────────────────

export function getInstagramId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([\w-]+)/);
  return match ? match[1] : null;
}

export function getInstagramEmbedUrl(url?: string | null): string | null {
  const id = getInstagramId(url);
  if (!id) return null;
  return `https://www.instagram.com/p/${id}/embed`;
}

export function getInstagramThumbnail(url?: string | null): string | null {
  const id = getInstagramId(url);
  if (!id) return null;
  return `https://www.instagram.com/p/${id}/media/?size=m`;
}

// ─── Thumbnail Resolver ───────────────────────────────────────────────────────

export function getMediaThumb(item: GalleryItem, fallback = FALLBACK): string {
  if (item.thumbnail_path) return getMediaUrl(item.thumbnail_path);
  if (isYouTubeItem(item)) {
    const url = item.video_url || item.storage_path_or_url;
    return getYoutubeThumbnail(url, 'hq') || fallback;
  }
  if (isInstagramItem(item)) {
    const url = item.video_url || item.storage_path_or_url;
    return getInstagramThumbnail(url) || fallback;
  }
  if (isVideoItem(item)) return fallback;
  return getMediaUrl(item.storage_path_or_url) || fallback;
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

export interface GroupedByKind {
  photos: GalleryItem[];
  youtube: GalleryItem[];
  instagram: GalleryItem[];
  videos: GalleryItem[];
}

export function groupByKind(items: GalleryItem[]): GroupedByKind {
  const r: GroupedByKind = { photos: [], youtube: [], instagram: [], videos: [] };
  for (const item of items) {
    const k = getMediaKind(item);
    if (k === 'youtube') r.youtube.push(item);
    else if (k === 'instagram') r.instagram.push(item);
    else if (k === 'video') r.videos.push(item);
    else r.photos.push(item);
  }
  return r;
}

export function totalCount(g: GroupedByKind): number {
  return g.photos.length + g.youtube.length + g.instagram.length + g.videos.length;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export function getKindLabel(kind: GalleryMediaKind): string {
  if (kind === 'photo') return 'Photos';
  if (kind === 'youtube') return 'YouTube';
  if (kind === 'instagram') return 'Instagram';
  return 'Videos';
}

export function getKindBadgeClass(kind: GalleryMediaKind): string {
  if (kind === 'youtube') return 'bg-red-500/90 text-white border-red-400';
  if (kind === 'instagram') return 'bg-pink-500/90 text-white border-pink-400';
  if (kind === 'video') return 'bg-amber-500/90 text-slate-950 border-amber-400';
  return 'bg-slate-800/90 text-slate-200 border-slate-700';
}
