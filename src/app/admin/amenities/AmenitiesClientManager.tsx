'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Sparkles } from 'lucide-react';
import { Amenity } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { saveAmenityAction, deleteAmenityAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const AmenitiesClientManager: React.FC<{ initialAmenities: Amenity[] }> = ({ initialAmenities }) => {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    active: true,
  });

  const handleOpenCreate = () => {
    setEditingAmenity(null);
    setFormData({ name: '', active: true });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (a: Amenity) => {
    setEditingAmenity(a);
    setFormData({ name: a.name, active: a.active });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveAmenityAction(formData, editingAmenity?.id);

    if (res.success) {
      toast({ type: 'success', title: 'Amenity Record Saved' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving Amenity', message: res.error });
    }
  };

  const handleDelete = async (a: Amenity) => {
    if (!confirm(`Delete amenity "${a.name}"?`)) return;
    const res = await deleteAmenityAction(a.id);

    if (res.success) {
      toast({ type: 'success', title: 'Amenity Deleted' });
      setAmenities(amenities.filter((item) => item.id !== a.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" /> Township Amenities Master List
          </h1>
          <p className="text-xs text-slate-400">Manage master list of township infrastructure features (Water, Blacktop Roads, Electricity, Parks)</p>
        </div>
        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> Add Amenity
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((item) => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">{item.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-amber-400 cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item)} className="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Amenity Name</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Blacktop Roads" />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">Save Amenity</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
