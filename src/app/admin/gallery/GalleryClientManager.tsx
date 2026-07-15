'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { GalleryItem, Project, Location } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { saveGalleryItemAction, deleteGalleryItemAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const GalleryClientManager: React.FC<{
  initialItems: GalleryItem[];
  projects: Project[];
  locations: Location[];
}> = ({ initialItems, projects, locations }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    media_type: 'image' as const,
    storage_path_or_url: '',
    caption: '',
    category: 'Overview',
    project_id: '',
    location_id: '',
    display_order: 0,
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      media_type: 'image',
      storage_path_or_url: '',
      caption: '',
      category: 'Overview',
      project_id: '',
      location_id: '',
      display_order: items.length + 1,
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveGalleryItemAction(formData);

    if (res.success) {
      toast({ type: 'success', title: 'Gallery Media Added' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Upload Failed', message: res.error });
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Remove media item from gallery?')) return;
    const res = await deleteGalleryItemAction(item.id);

    if (res.success) {
      toast({ type: 'success', title: 'Gallery Item Removed' });
      setItems(items.filter((i) => i.id !== item.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" /> On-Site Photo & Video Gallery
          </h1>
          <p className="text-xs text-slate-400">Upload and tag high-resolution photography, entrance arch media, and avenue videos</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Gallery Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative group">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
              <img src={item.storage_path_or_url} alt={item.title || 'Gallery asset'} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white truncate">{item.title || 'Untitled'}</h4>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">{item.category}</span>
              </div>
              <button onClick={() => handleDelete(item)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Upload Gallery Media Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <MediaUploader
              label="Select Image or Video"
              value={formData.storage_path_or_url}
              folder="gallery"
              onChange={(url) => setFormData({ ...formData, storage_path_or_url: url })}
            />
          </div>

          <div>
            <Label>Media Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Entrance Arch Vista" />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              <option value="Overview">Overview</option>
              <option value="Roads">Roads & Avenues</option>
              <option value="Villas">Villa Builds</option>
              <option value="Parks">Parks</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">Save Gallery Media</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
