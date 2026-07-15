'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit3 } from 'lucide-react';
import { SEOMetadata } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { saveSeoMetadataAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const SeoClientManager: React.FC<{ initialSeoRecords: SEOMetadata[] }> = ({ initialSeoRecords }) => {
  const { toast } = useToast();
  const [seoRecords] = useState<SEOMetadata[]>(initialSeoRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SEOMetadata | null>(null);

  const [formData, setFormData] = useState({
    entity_type: 'page',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    open_graph_title: '',
    open_graph_description: '',
    index_enabled: true,
  });

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormData({
      entity_type: 'page',
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      open_graph_title: '',
      open_graph_description: '',
      index_enabled: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rec: SEOMetadata) => {
    setEditingRecord(rec);
    setFormData({
      entity_type: rec.entity_type || 'page',
      meta_title: rec.meta_title || '',
      meta_description: rec.meta_description || '',
      canonical_url: rec.canonical_url || '',
      open_graph_title: rec.open_graph_title || '',
      open_graph_description: rec.open_graph_description || '',
      index_enabled: rec.index_enabled,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveSeoMetadataAction(formData, editingRecord?.id);

    if (res.success) {
      toast({ type: 'success', title: 'SEO Override Saved & Cache Cleared' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving SEO', message: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-amber-400" /> SEO Overrides & Meta Control
          </h1>
          <p className="text-xs text-slate-400">Configure page-level meta titles, descriptions, and OpenGraph tags</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add SEO Override
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] font-bold text-slate-400">
              <tr>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Meta Title</th>
                <th className="p-4">Meta Description</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {seoRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{rec.entity_type}</td>
                  <td className="p-4 font-bold text-white max-w-xs truncate">{rec.meta_title}</td>
                  <td className="p-4 max-w-sm truncate text-slate-400">{rec.meta_description}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(rec)} className="p-1.5 text-slate-400 hover:text-amber-400 cursor-pointer">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingRecord ? 'Edit SEO Entry' : 'Add SEO Entry'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Entity Type / Key</Label>
            <Input required value={formData.entity_type} onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })} placeholder="page_about" />
          </div>

          <div>
            <Label required>Meta Title</Label>
            <Input required value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="About Us | Your Choice Properties" />
          </div>

          <div>
            <Label required>Meta Description</Label>
            <Textarea required rows={3} value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} placeholder="Enter page meta description..." />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">Save SEO Record</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
