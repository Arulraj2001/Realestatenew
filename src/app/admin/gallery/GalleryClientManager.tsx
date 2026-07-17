'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit3, Filter } from 'lucide-react';
import { GalleryItem, Project } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { saveGalleryItemAction, deleteGalleryItemAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';

export interface GalleryClientManagerProps {
  initialItems: GalleryItem[];
  projects: Project[];
}

export const GalleryClientManager: React.FC<GalleryClientManagerProps> = ({
  initialItems,
  projects,
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    media_type: 'image' as 'image' | 'video' | 'youtube' | 'instagram',
    storage_path_or_url: '',
    thumbnail_path: '',
    video_url: '',
    embed_type: null as 'supabase' | 'youtube' | 'instagram' | null,
    caption: '',
    alt_text: '',
    category: 'Site Pictures',
    project_id: projects[0]?.id || '',
    location_id: '',
    display_order: 0,
    featured: false,
    published: true,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      media_type: 'image',
      storage_path_or_url: '',
      thumbnail_path: '',
      video_url: '',
      embed_type: null,
      caption: '',
      alt_text: '',
      category: 'Site Pictures',
      project_id: projects[0]?.id || '',
      location_id: '',
      display_order: items.length + 1,
      featured: false,
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      media_type: item.media_type || 'image',
      storage_path_or_url: item.storage_path_or_url || '',
      thumbnail_path: item.thumbnail_path || '',
      video_url: item.video_url || item.storage_path_or_url || '',
      embed_type: item.embed_type || null,
      caption: item.caption || '',
      alt_text: item.alt_text || '',
      category: item.category || 'Site Pictures',
      project_id: item.project_id || projects[0]?.id || '',
      location_id: item.location_id || '',
      display_order: item.display_order,
      featured: item.featured,
      published: item.published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storage_path_or_url && !formData.video_url) {
      toast({ type: 'error', title: 'Missing Media', message: 'Please upload an image asset or enter a video URL.' });
      return;
    }

    const payload = {
      ...formData,
      storage_path_or_url: formData.media_type === 'youtube' || formData.media_type === 'instagram' ? (formData.video_url || formData.storage_path_or_url) : formData.storage_path_or_url,
      video_url: formData.video_url || formData.storage_path_or_url,
      embed_type: formData.media_type === 'youtube' ? 'youtube' : formData.media_type === 'instagram' ? 'instagram' : formData.media_type === 'video' ? 'supabase' : null,
    };

    const res = await saveGalleryItemAction(payload, editingItem?.id);

    if (res.success) {
      toast({ type: 'success', title: editingItem ? 'Gallery Item Updated' : 'Gallery Asset Added' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Save Failed', message: res.error });
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Remove photo asset from gallery?')) return;
    const res = await deleteGalleryItemAction(item.id);

    if (res.success) {
      toast({ type: 'success', title: 'Gallery Item Removed' });
      setItems(items.filter((i) => i.id !== item.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const allCategories = Array.from(new Set(items.map((i) => i.category || 'Uncategorized')));

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" /> Photo & Layout Gallery Albums
          </h1>
          <p className="text-xs text-slate-400">Manage high-resolution photography, entrance arch photos, and master floor plan diagrams</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Photo Asset
        </Button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {['All', ...allCategories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {cat === 'All' ? 'All' : cat === 'floor_plan' ? 'Floor Plans' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Photo Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative group shadow-lg">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
              <img src={item.storage_path_or_url} alt={item.alt_text || item.title || 'Gallery asset'} className="w-full h-full object-cover" />
              {item.featured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-bold rounded-full">
                  ★ Featured
                </span>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white truncate">{item.title || 'Untitled Asset'}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold">
                  {item.category === 'floor_plan' ? 'Floor Plan' : item.category}
                </span>
                {item.published ? (
                  <Badge variant="emerald" className="text-[9px] px-1.5 py-0">Published</Badge>
                ) : (
                  <Badge variant="slate" className="text-[9px] px-1.5 py-0">Draft</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 border-t border-slate-800 pt-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Photo Asset Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingItem ? 'Edit Gallery Asset' : 'Add Photo / Floor Plan Asset'}
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Media Type</Label>
              <select
                value={formData.media_type}
                onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' | 'youtube' | 'instagram' })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-bold"
              >
                <option value="image">🖼️ Picture / Photo</option>
                <option value="youtube">🎥 YouTube Video Walkthrough</option>
                <option value="instagram">📸 Instagram Influencer Reel</option>
                <option value="video">🎞️ Direct Upload Video</option>
              </select>
            </div>
            <div>
              <Label required>Tag Project</Label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="">— General / No Project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.media_type === 'image' || formData.media_type === 'video' ? (
            <div>
              <MediaUploader
                label={formData.media_type === 'video' ? 'Select MP4 Video File' : 'Select Photo Image Asset'}
                value={formData.storage_path_or_url}
                folder="gallery"
                onChange={(url) => setFormData({ ...formData, storage_path_or_url: url })}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label required>{formData.media_type === 'youtube' ? 'YouTube Video URL' : 'Instagram Influencer Reel URL'}</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value, storage_path_or_url: e.target.value })}
                  placeholder={formData.media_type === 'youtube' ? 'https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID' : 'https://www.instagram.com/reel/REEL_ID/'}
                />
              </div>
              <div>
                <MediaUploader
                  label="Custom Cover / Preview Image (Optional)"
                  value={formData.thumbnail_path}
                  folder="gallery"
                  onChange={(url) => setFormData({ ...formData, thumbnail_path: url })}
                />
              </div>
            </div>
          )}

          <div>
            <Label required>Asset Title</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Rasi Garden Site Walkthrough Video / 3BHK Villa Front View"
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              <option value="Site Pictures">Site Pictures</option>
              <option value="Villas & Houses">Villas & Houses (2BHK, 3BHK, 4BHK)</option>
              <option value="Roads & Infrastructure">Roads & Infrastructure</option>
              <option value="YouTube Videos">YouTube Videos</option>
              <option value="Instagram Influencer Videos">Instagram Influencer Videos</option>
              <option value="Master Floor Plan">Master Floor Plan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                placeholder="1"
              />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <label className="text-xs text-slate-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Featured (Homepage)</span>
              </label>
              <label className="text-xs text-slate-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <span>Published</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">
              {editingItem ? 'Update Gallery Asset' : 'Save Photo Asset'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};