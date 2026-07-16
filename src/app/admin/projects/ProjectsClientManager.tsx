'use client';

import React, { useState } from 'react';
import { Building2, Plus, Edit3, Trash2, Eye, EyeOff, Search, MapPin, Video } from 'lucide-react';
import { Location, Project } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { saveProjectAction, deleteProjectAction, togglePublishProjectAction } from '@/app/actions/crud';
import { generateSlug } from '@/lib/utils/slug';
import { useToast } from '@/components/ui/toast';

export interface ProjectsClientManagerProps {
  initialProjects: Project[];
  locations: Location[];
}

export const ProjectsClientManager: React.FC<ProjectsClientManagerProps> = ({
  initialProjects,
  locations,
}) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    location_id: locations[0]?.id || '',
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    project_status: 'Ongoing' as Project['project_status'],
    approval_type: 'DTCP Approved',
    address: '',
    map_url: '',
    hero_image_path: '',
    hero_video_path: '',
    published: true,
    featured: true,
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      location_id: locations[0]?.id || '',
      name: '',
      slug: '',
      short_description: '',
      full_description: '',
      project_status: 'Ongoing',
      approval_type: 'DTCP Approved',
      address: '',
      map_url: '',
      hero_image_path: '',
      hero_video_path: '',
      published: true,
      featured: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      location_id: proj.location_id,
      name: proj.name,
      slug: proj.slug,
      short_description: proj.short_description || '',
      full_description: proj.full_description || '',
      project_status: proj.project_status || 'Ongoing',
      approval_type: proj.approval_type || 'DTCP Approved',
      address: proj.address || '',
      map_url: proj.map_url || '',
      hero_image_path: proj.hero_image_path || '',
      hero_video_path: proj.hero_video_path || '',
      published: proj.published,
      featured: proj.featured || true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveProjectAction(formData, editingProject?.id);

    if (res.success) {
      toast({
        type: 'success',
        title: editingProject ? 'Project Updated' : 'Project Created',
      });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving Project', message: res.error });
    }
  };

  const handleDelete = async (proj: Project) => {
    if (!confirm(`Are you sure you want to delete project "${proj.name}"?`)) return;
    const res = await deleteProjectAction(proj.id);

    if (res.success) {
      toast({ type: 'success', title: 'Project Deleted' });
      setProjects(projects.filter((p) => p.id !== proj.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    const res = await togglePublishProjectAction(proj.id, proj.published);
    if (res.success) {
      setProjects(
        projects.map((p) => (p.id === proj.id ? { ...p, published: !p.published } : p))
      );
      toast({ type: 'info', title: 'Publication Status Updated' });
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" /> Township Projects Management
          </h1>
          <p className="text-xs text-slate-400">Manage residential gated community layouts, video links, addresses & map locations</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <Input
          placeholder="Search projects..."
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
                <th className="p-4">Project Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Approval</th>
                <th className="p-4">Video Link</th>
                <th className="p-4">Map & Address</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {proj.name}
                    <span className="block text-[11px] font-mono text-amber-400 font-normal">{proj.slug}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{proj.location?.name}</td>
                  <td className="p-4">
                    <Badge variant="gold">{proj.project_status}</Badge>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">{proj.approval_type || 'DTCP'}</td>
                  <td className="p-4 text-[11px]">
                    {proj.hero_video_path ? (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> Video Set
                      </span>
                    ) : (
                      <span className="text-slate-500">No Video</span>
                    )}
                  </td>
                  <td className="p-4 text-[11px] text-slate-400 max-w-xs truncate">
                    {proj.map_url ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Map Set
                      </span>
                    ) : (
                      <span className="text-slate-500">No Map</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleTogglePublish(proj)} className="cursor-pointer">
                      {proj.published ? (
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
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj)}
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
        title={editingProject ? 'Edit Township Project' : 'Add New Township Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <Label required>Parent Location</Label>
            <select
              required
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Project Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editingProject ? formData.slug : generateSlug(e.target.value),
                  })
                }
                placeholder="Rasi Garden"
              />
            </div>

            <div>
              <Label required>URL Slug</Label>
              <Input
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                placeholder="rasi-garden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Project Status</Label>
              <select
                value={formData.project_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_status: e.target.value as Project['project_status'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <Label>Approval Type</Label>
              <Input
                value={formData.approval_type}
                onChange={(e) => setFormData({ ...formData, approval_type: e.target.value })}
                placeholder="DTCP Approved"
              />
            </div>
          </div>

          <div>
            <Label>Project Walkthrough Video Link (YouTube / Instagram Reel URL)</Label>
            <Input
              value={formData.hero_video_path}
              onChange={(e) => setFormData({ ...formData, hero_video_path: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or Instagram Reel link"
            />
            <p className="text-[11px] text-slate-500 mt-1">Paste YouTube video URL or Instagram Reel URL to play walkthrough video on the project page.</p>
          </div>

          <div>
            <Label>Google Maps Link / Share URL</Label>
            <Input
              value={formData.map_url}
              onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
              placeholder="https://maps.google.com/?q=Rasi+Garden+Namakkal"
            />
            <p className="text-[11px] text-slate-500 mt-1">Paste Google Maps share link or iframe embed URL for real interactive map.</p>
          </div>

          <div>
            <Label>Physical Street Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Main Road, Mohanur Road Junction, Namakkal - 637001"
            />
          </div>

          <div>
            <Label>Short Card Summary</Label>
            <Input
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Premium DTCP approved villa plots and luxury independent homes."
            />
          </div>

          <div>
            <Label>Full Project Overview Description</Label>
            <Textarea
              rows={3}
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="Detailed description of the township project..."
            />
          </div>

          <div>
            <MediaUploader
              label="Hero Layout Cover Image"
              value={formData.hero_image_path}
              folder="projects"
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
              Save Project Record
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
