'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Sliders, Search } from 'lucide-react';
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
    starting_price: 1800000,
    availability_status: 'Available' as PropertyConfiguration['availability_status'],
    short_description: '',
    full_description: '',
    feature_list: [] as string[],
    hero_image_path: '',
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
      starting_price: 1800000,
      availability_status: 'Available',
      short_description: '',
      full_description: '',
      feature_list: [],
      hero_image_path: '',
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
      starting_price: config.starting_price || 1800000,
      availability_status: config.availability_status,
      short_description: config.short_description || '',
      full_description: config.full_description || '',
      feature_list: parsedFeatures,
      hero_image_path: config.hero_image_path || '',
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

          <div>
            <MediaUploader
              label="Layout Media Image"
              value={formData.hero_image_path}
              folder="properties"
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
