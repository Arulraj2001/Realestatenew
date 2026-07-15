'use client';

import React, { useState } from 'react';
import { FileText, Edit3 } from 'lucide-react';
import { ContentPage, ContentPageKey } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { saveContentPageAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const PagesClientManager: React.FC<{ initialPages: ContentPage[] }> = ({ initialPages }) => {
  const { toast } = useToast();
  const [pages] = useState<ContentPage[]>(initialPages);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    body: '',
  });

  const availablePages = [
    { key: 'home', title: 'Public Homepage Content' },
    { key: 'about', title: 'About Us & Leadership Story' },
    { key: 'services', title: 'Real Estate Services Overview' },
    { key: 'contact', title: 'Contact Us Information' },
    { key: 'privacy', title: 'Privacy Policy Text' },
    { key: 'terms', title: 'Terms & Conditions Legal Text' },
  ];

  const handleEditPage = (key: string) => {
    const existing = pages.find((p) => p.page_key === key);
    const contentObj = (existing?.content as Record<string, string>) || {};

    setSelectedKey(key);
    setFormData({
      title: existing?.title || availablePages.find((p) => p.key === key)?.title || '',
      heading: contentObj.heading || '',
      body: contentObj.body || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    const res = await saveContentPageAction(selectedKey as ContentPageKey, formData.title, {
      heading: formData.heading,
      body: formData.body,
    });

    if (res.success) {
      toast({ type: 'success', title: 'Page Content Updated & Revalidated' });
      setSelectedKey(null);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Update Failed', message: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" /> Editable Content Pages
        </h1>
        <p className="text-xs text-slate-400">Manage headlines, company history text, and legal terms safely</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePages.map((p) => {
          const existing = pages.find((item) => item.page_key === p.key);
          return (
            <div key={p.key} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Key: {p.key}</span>
                <h3 className="font-serif text-lg font-bold text-white mt-1">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {((existing?.content as Record<string, string>)?.body) || 'Default fallback content active.'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditPage(p.key)} className="w-full">
                <Edit3 className="w-4 h-4 mr-1 text-amber-400" /> Edit Content
              </Button>
            </div>
          );
        })}
      </div>

      <Dialog isOpen={selectedKey !== null} onClose={() => setSelectedKey(null)} title={`Edit Page Content (${selectedKey})`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Page Display Title</Label>
            <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div>
            <Label>Main Headline / Subtitle</Label>
            <Input value={formData.heading} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} placeholder="Building Trust Across Tamil Nadu" />
          </div>

          <div>
            <Label>Main Body Content</Label>
            <Textarea rows={6} value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} placeholder="Enter page narrative text..." />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" size="md">Save Page Content</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
