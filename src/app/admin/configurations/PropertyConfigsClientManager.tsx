'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Sliders, Search } from 'lucide-react';
import Image from 'next/image';
import { PropertyConfiguration, Project } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { generateSlug } from '@/lib/utils/slug';
import { savePropertyConfigAction, deletePropertyConfigAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const PropertyConfigsClientManager: React.FC<{
  initialConfigs: PropertyConfiguration[];
  projects: Project[];
}> = ({ initialConfigs, projects }) => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<PropertyConfiguration[]>(initialConfigs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PropertyConfiguration | null>(null);

  const [formData, setFormData] = useState({
    project_id: projects[0]?.id || '',
    name: '',
    slug: '',
    property_type: 'Plot' as PropertyConfiguration['property_type'],
    bhk: 2,
    plot_area: '1200 Sq.Ft (30x40)',
    built_up_area: '',
    bedrooms: 2,
    bathrooms: 2,
    starting_price: 1800000 as number | null,
    availability_status: 'Available' as PropertyConfiguration['availability_status'],
    short_description: '',
    full_description: '',
    feature_list: [] as string[],
    hero_image_path: '',
    gallery_images: [] as string[],
    display_order: 0,
    published: true,
    featured: false,
  });

  const handleOpenCreate = () => {
    setEditingConfig(null);
    setFormData({
      project_id: projects[0]?.id || '',
      name: '',
      slug: '',
      property_type: 'Plot',
      bhk: 2,
      plot_area: '1200 Sq.Ft (30x40)',
      built_up_area: '',
      bedrooms: 2,
      bathrooms: 2,
      starting_price: 1800000 as number | null,
      availability_status: 'Available',
      short_description: '',
      full_description: '',
      feature_list: [],
      hero_image_path: '',
      gallery_images: [],
      display_order: configs.length + 1,
      published: true,
      featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (config: PropertyConfiguration) => {
    setEditingConfig(config);
    const parsedFeatures = Array.isArray(config.feature_list)
      ? (config.feature_list as string[])
      : typeof config.feature_list === 'string'
      ? JSON.parse(config.feature_list || '[]')
      : [];

    const parsedGallery = Array.isArray(config.gallery_images)
      ? (config.gallery_images as string[])
      : typeof config.gallery_images === 'string'
      ? JSON.parse(config.gallery_images || '[]')
      : [];

    setFormData({
      project_id: config.project_id,
      name: config.name,
      slug: config.slug,
      property_type: config.property_type,
      bhk: config.bhk || 2,
      plot_area: config.plot_area || '',
      built_up_area: config.built_up_area || '',
      bedrooms: config.bedrooms || 2,
      bathrooms: config.bathrooms || 2,
      starting_price: config.starting_price,
      availability_status: config.availability_status,
      short_description: config.short_description || '',
      full_description: config.full_description || '',
      feature_list: parsedFeatures,
      hero_image_path: config.hero_image_path || '',
      gallery_images: parsedGallery,
      display_order: config.display_order,
      published: config.published,
      featured: config.featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await savePropertyConfigAction(formData, editingConfig?.id);

    if (res.success) {
      toast({ type: 'success', title: 'Property Configuration Saved' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving Configuration', message: res.error });
    }
  };

  const handleDelete = async (config: PropertyConfiguration) => {
    if (!confirm(`Are you sure you want to delete "${config.name}"?`)) return;
    const res = await deletePropertyConfigAction(config.id);

    if (res.success) {
      toast({ type: 'success', title: 'Configuration Deleted' });
      setConfigs(configs.filter((c) => c.id !== config.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const filteredConfigs = configs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-500" /> Property Configurations
          </h1>
          <p className="text-xs text-slate-400">Manage plot dimensions, villa floor plans, and BHK options</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Configuration
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <Input
          placeholder="Search configurations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] font-bold text-slate-400">
              <tr>
                <th className="p-4">Configuration Name</th>
                <th className="p-4">Project</th>
                <th className="p-4">Type & BHK</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredConfigs.map((cfg) => (
                <tr key={cfg.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {cfg.name}
                    <span className="block text-[11px] font-mono text-amber-400 font-normal">{cfg.slug}</span>
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">{cfg.project?.name}</td>
                  <td className="p-4">
                    <Badge variant="gold">
                      {cfg.property_type} {cfg.bhk ? `(${cfg.bhk} BHK)` : ''}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono">{cfg.plot_area || cfg.built_up_area || 'Standard'}</td>
                  <td className="p-4">
                    <Badge variant="emerald">{cfg.availability_status}</Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cfg)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cfg)}
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

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Parent Project</Label>
            <select
              required
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Configuration Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: editingConfig ? formData.slug : generateSlug(e.target.value),
                })
              }
              placeholder="East Facing 30x40 Plot"
            />
          </div>

          <div>
            <Label required>URL Slug</Label>
            <Input
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
              placeholder="east-facing-30x40-plot"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <select
                value={formData.property_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    property_type: e.target.value as PropertyConfiguration['property_type'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="Plot">Plot</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <Label>Plot Dimensions</Label>
              <Input
                value={formData.plot_area}
                onChange={(e) => setFormData({ ...formData, plot_area: e.target.value })}
                placeholder="1200 Sq.Ft (30x40)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Starting Price (₹)</Label>
              <Input
                type="number"
                value={formData.starting_price || ''}
                onChange={(e) => setFormData({ ...formData, starting_price: e.target.value ? Number(e.target.value) : null })}
                placeholder="1800000"
              />
            </div>

            <div>
              <Label>Availability Status</Label>
              <select
                value={formData.availability_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability_status: e.target.value as PropertyConfiguration['availability_status'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="Available">Available</option>
                <option value="Fast Filling">Fast Filling</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span>Featured Option</span>
              </label>
            </div>
          </div>

          {(formData.property_type === 'Villa' || formData.property_type === 'Apartment') && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <div>
                <Label>BHK</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.bhk}
                  onChange={(e) => setFormData({ ...formData, bhk: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label>Built-Up Area</Label>
                <Input
                  value={formData.built_up_area}
                  onChange={(e) => setFormData({ ...formData, built_up_area: e.target.value })}
                  placeholder="e.g. 1500 Sq.Ft"
                />
              </div>
            </div>
          )}

          <div>
            <Label>Key Highlights & Features (One item per line)</Label>
            <textarea
              rows={4}
              value={
                Array.isArray(formData.feature_list)
                  ? formData.feature_list.join('\n')
                  : typeof formData.feature_list === 'string'
                  ? formData.feature_list
                  : ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  feature_list: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="Premium Duplex Villa&#10;Internal Staircase&#10;Covered Car Parking&#10;3 Bedrooms with Attached Bathrooms"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <MediaUploader
                label="Layout Media Image (Hero)"
                value={formData.hero_image_path}
                folder="properties"
                cropAspectRatio={16 / 10}
                onChange={(url) => setFormData({ ...formData, hero_image_path: url })}
              />
            </div>

            <div>
              <MediaUploader
                label="Add Photo to Gallery (Multiple)"
                folder="properties"
                onChange={(url) => {
                  if (url) {
                    setFormData((prev) => ({
                      ...prev,
                      gallery_images: [...prev.gallery_images, url],
                    }));
                  }
                }}
              />
            </div>
          </div>

          {/* Previews Grid for gallery_images */}
          {formData.gallery_images && formData.gallery_images.length > 0 && (
            <div className="space-y-2">
              <Label>Current Gallery Preview ({formData.gallery_images.length} images)</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                {formData.gallery_images.map((imgUrl, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 group/img">
                    <Image
                      unoptimized
                      src={imgUrl}
                      alt={`Gallery item ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          gallery_images: prev.gallery_images.filter((_, idx) => idx !== index),
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="text-xs text-slate-300 flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span>Published</span>
            </label>

            <Button type="submit" variant="gold" size="md">
              Save Configuration
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
