'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Filter } from 'lucide-react';
import { GalleryItem, Project } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { saveGalleryItemAction, deleteGalleryItemAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

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

  const [formData, setFormData] = useState({
    title: '',
    media_type: 'image' as const,
    storage_path_or_url: '',
    caption: '',
    category: 'Overview',
    project_id: projects[0]?.id || '',
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
      project_id: projects[0]?.id || '',
      display_order: items.length + 1,
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storage_path_or_url) {
      toast({ type: 'error', title: 'Missing Media', message: 'Please upload or select an image asset.' });
      return;
    }

    const res = await saveGalleryItemAction(formData);

    if (res.success) {
      toast({ type: 'success', title: 'Gallery Photo Added' });
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
        {['All', 'Overview', 'Roads', 'Villas', 'Parks', 'floor_plan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {cat === 'floor_plan' ? 'Floor Plans' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Photo Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative group shadow-lg">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
              <img src={item.storage_path_or_url} alt={item.title || 'Gallery asset'} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white truncate">{item.title || 'Untitled Asset'}</h4>
                <span className="text-[10px] text-amber-400 uppercase font-bold">
                  {item.category === 'floor_plan' ? 'Floor Plan' : item.category}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Asset Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Add Photo / Floor Plan Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <MediaUploader
              label="Select Image or Floor Plan"
              value={formData.storage_path_or_url}
              folder="gallery"
              onChange={(url) => setFormData({ ...formData, storage_path_or_url: url })}
            />
          </div>

          <div>
            <Label required>Asset Title</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Entrance Arch Vista / Master Layout Plan"
            />
          </div>

          <div>
            <Label required>Tag Project</Label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              <option value="Overview">Overview & Aerial View</option>
              <option value="Roads">Roads & Avenues</option>
              <option value="Villas">Villa Builds</option>
              <option value="Parks">Parks & Greenery</option>
              <option value="floor_plan">Master Floor Plan Diagram</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">
              Save Photo Asset
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
