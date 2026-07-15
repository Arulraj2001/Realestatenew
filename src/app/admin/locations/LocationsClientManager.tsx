'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, MapPin, Search } from 'lucide-react';
import { Location } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { generateSlug } from '@/lib/utils/slug';
import { saveLocationAction, deleteLocationAction, togglePublishLocationAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const LocationsClientManager: React.FC<{ initialLocations: Location[] }> = ({ initialLocations }) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    address: '',
    map_url: '',
    hero_image_path: '',
    display_order: 0,
    published: true,
    featured: false,
  });

  const handleOpenCreate = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      full_description: '',
      address: '',
      map_url: '',
      hero_image_path: '',
      display_order: locations.length + 1,
      published: true,
      featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      slug: loc.slug,
      short_description: loc.short_description || '',
      full_description: loc.full_description || '',
      address: loc.address || '',
      map_url: loc.map_url || '',
      hero_image_path: loc.hero_image_path || '',
      display_order: loc.display_order,
      published: loc.published,
      featured: loc.featured,
    });
    setIsDialogOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData({
      ...formData,
      name: val,
      slug: editingLocation ? formData.slug : generateSlug(val),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveLocationAction(formData, editingLocation?.id);

    if (res.success) {
      toast({ type: 'success', title: 'Location Record Saved' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving Location', message: res.error });
    }
  };

  const handleDelete = async (loc: Location) => {
    if (!confirm(`Are you sure you want to delete "${loc.name}"?`)) return;
    const res = await deleteLocationAction(loc.id);

    if (res.success) {
      toast({ type: 'success', title: 'Location Deleted' });
      setLocations(locations.filter((l) => l.id !== loc.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const handleTogglePublish = async (loc: Location) => {
    const res = await togglePublishLocationAction(loc.id, loc.published);
    if (res.success) {
      setLocations(
        locations.map((l) => (l.id === loc.id ? { ...l, published: !l.published } : l))
      );
      toast({ type: 'info', title: 'Publication Status Updated' });
    }
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" /> Location Management
          </h1>
          <p className="text-xs text-slate-400">Manage region hubs in Tamil Nadu (Namakkal, Paramathi Velur, etc.)</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Location
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] font-bold text-slate-400">
              <tr>
                <th className="p-4">Name & Slug</th>
                <th className="p-4">Address</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {loc.name}
                    <span className="block text-[11px] font-mono text-amber-400 font-normal">{loc.slug}</span>
                  </td>
                  <td className="p-4 max-w-xs truncate">{loc.address || 'Namakkal District'}</td>
                  <td className="p-4 font-mono">{loc.display_order}</td>
                  <td className="p-4">
                    <button onClick={() => handleTogglePublish(loc)} className="cursor-pointer">
                      {loc.published ? (
                        <Badge variant="emerald">
                          <Eye className="w-3 h-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="slate">
                          <EyeOff className="w-3 h-3 mr-1" /> Draft
                        </Badge>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(loc)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Location Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Namakkal"
            />
          </div>

          <div>
            <Label required>URL Slug</Label>
            <Input
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
              placeholder="namakkal"
            />
          </div>

          <div>
            <Label>Short Overview</Label>
            <Input
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Premier residential hub..."
            />
          </div>

          <div>
            <Label>Address / Region Summary</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Namakkal, Tamil Nadu"
            />
          </div>

          <div>
            <MediaUploader
              label="Hero Cover Media"
              value={formData.hero_image_path}
              folder="locations"
              onChange={(url) => setFormData({ ...formData, hero_image_path: url })}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-xs text-slate-300 flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span>Published on Live Site</span>
            </label>

            <Button type="submit" variant="gold" size="md">
              Save Location Record
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
