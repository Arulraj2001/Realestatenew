'use client';

import React, { useState } from 'react';
import { FileText, Edit3, Save } from 'lucide-react';
import { ContentPage, ContentPageKey, Json } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { saveContentPageAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export const PagesClientManager: React.FC<{ initialPages: ContentPage[] }> = ({ initialPages }) => {
  const { toast } = useToast();
  const [pages, setPages] = useState<ContentPage[]>(initialPages);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    body: '',
    // Homepage Extended Admin Controls
    hero_enabled: true,
    hero_media_type: 'image',
    desktop_image: '',
    mobile_image: '',
    desktop_video: '',
    mobile_video: '',
    poster_image: '',
    overlay_opacity: 70,
    hero_blur: 0,
    hero_h1: '',
    hero_description: '',
    primary_cta_label: '',
    primary_cta_link: '',
    secondary_cta_label: '',
    intro_h2: '',
    intro_content: '',
    gallery_heading: '',
    gallery_description: '',
    final_cta_heading: '',
    final_cta_description: '',

    // About Page Extended Admin Controls
    about_h1: '',
    about_intro: '',
    founder_name: '',
    founder_role: '',
    founder_content: '',
    founder_image: '',
    founder_quote: '',
    stats_visible: true,

    // Services Page Extended Admin Controls
    services_h1: '',
    services_intro: '',
  });

  const availablePages = [
    { key: 'home', title: 'Public Homepage Content & Hero Controls' },
    { key: 'about', title: 'About Us & Founder Story' },
    { key: 'services', title: 'Real Estate Services Overview' },
    { key: 'contact', title: 'Contact Us Information' },
    { key: 'privacy', title: 'Privacy Policy Text' },
    { key: 'terms', title: 'Terms & Conditions Legal Text' },
  ];

  const handleEditPage = (key: string) => {
    const existing = pages.find((p) => p.page_key === key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = (existing?.content as Record<string, any>) || {};

    setSelectedKey(key);
    setFormData({
      title: existing?.title || availablePages.find((p) => p.key === key)?.title || '',
      heading: String(c.heading || ''),
      body: String(c.body || ''),
      hero_enabled: c.hero_enabled !== false,
      hero_media_type: String(c.hero_media_type || 'image'),
      desktop_image: String(c.desktop_image || ''),
      mobile_image: String(c.mobile_image || ''),
      desktop_video: String(c.desktop_video || ''),
      mobile_video: String(c.mobile_video || ''),
      poster_image: String(c.poster_image || ''),
      overlay_opacity: c.overlay_opacity !== undefined ? Number(c.overlay_opacity) : 70,
      hero_blur: c.hero_blur !== undefined ? Number(c.hero_blur) : 0,
      hero_h1: String(c.hero_h1 || c.hero_title || 'Your Choice Properties – Trusted Plots, Villas and Houses in Namakkal and Paramathi Velur'),
      hero_description: String(c.hero_description || c.hero_subtitle || 'Explore residential plots, gated-community villas and independent houses across our projects in Namakkal and Paramathi Velur.'),
      primary_cta_label: String(c.primary_cta_label || 'Explore Projects'),
      primary_cta_link: String(c.primary_cta_link || '/projects'),
      secondary_cta_label: String(c.secondary_cta_label || 'Contact Us'),
      intro_h2: String(c.intro_h2 || 'Find Residential Plots and Dream Villas in Namakkal and Paramathi Velur'),
      intro_content: String(c.intro_content || ''),
      gallery_heading: String(c.gallery_heading || 'See Our Projects'),
      gallery_description: String(c.gallery_description || 'View real site photos, villa designs, roads, layouts and construction updates from our projects.'),
      final_cta_heading: String(c.final_cta_heading || 'Visit the Project Before You Decide'),
      final_cta_description: String(c.final_cta_description || 'Tell us which location or property you are interested in, and our team will arrange a guided site visit.'),

      // About
      about_h1: String(c.about_h1 || 'Your Trusted Real Estate Partner in Namakkal and Paramathi Velur'),
      about_intro: String(c.about_intro || ''),
      founder_name: String(c.founder_name || 'Thennarasu Sambathkumar'),
      founder_role: String(c.founder_role || 'Managing Director'),
      founder_content: String(c.founder_content || ''),
      founder_image: String(c.founder_image || ''),
      founder_quote: String(c.founder_quote || 'We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.'),
      stats_visible: c.stats_visible !== false,

      // Services
      services_h1: String(c.services_h1 || 'Our Real Estate Services in Namakkal and Paramathi Velur'),
      services_intro: String(c.services_intro || 'Our team helps you choose the right plot or villa and supports you from your first enquiry through site visit, documentation and registration.'),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    const existingObj = ((pages.find((p) => p.page_key === selectedKey)?.content as Record<string, unknown>) || {});

    let updatedContent: Record<string, unknown> = { ...existingObj };

    if (selectedKey === 'home') {
      updatedContent = {
        ...existingObj,
        hero_enabled: formData.hero_enabled,
        hero_media_type: formData.hero_media_type,
        desktop_image: formData.desktop_image,
        mobile_image: formData.mobile_image,
        desktop_video: formData.desktop_video,
        mobile_video: formData.mobile_video,
        poster_image: formData.poster_image,
        overlay_opacity: Math.max(0, Math.min(100, Number(formData.overlay_opacity))),
        hero_blur: Math.max(0, Math.min(100, Number(formData.hero_blur))),
        hero_h1: formData.hero_h1,
        hero_description: formData.hero_description,
        primary_cta_label: formData.primary_cta_label,
        primary_cta_link: formData.primary_cta_link,
        secondary_cta_label: formData.secondary_cta_label,
        intro_h2: formData.intro_h2,
        intro_content: formData.intro_content,
        gallery_heading: formData.gallery_heading,
        gallery_description: formData.gallery_description,
        final_cta_heading: formData.final_cta_heading,
        final_cta_description: formData.final_cta_description,
      };
    } else if (selectedKey === 'about') {
      updatedContent = {
        ...existingObj,
        about_h1: formData.about_h1,
        about_intro: formData.about_intro,
        founder_name: formData.founder_name,
        founder_role: formData.founder_role,
        founder_content: formData.founder_content,
        founder_image: formData.founder_image,
        founder_quote: formData.founder_quote,
        stats_visible: formData.stats_visible,
      };
    } else if (selectedKey === 'services') {
      updatedContent = {
        ...existingObj,
        services_h1: formData.services_h1,
        services_intro: formData.services_intro,
      };
    } else {
      updatedContent = {
        ...existingObj,
        heading: formData.heading,
        body: formData.body,
      };
    }

    const res = await saveContentPageAction(selectedKey as ContentPageKey, formData.title, updatedContent);

    if (res.success) {
      toast({ type: 'success', title: 'Page Content & Controls Saved' });
      setPages((prev) => {
        const index = prev.findIndex((p) => p.page_key === selectedKey);
        const updatedPage: ContentPage = {
          id: prev[index]?.id || `page-${selectedKey}`,
          page_key: selectedKey as ContentPageKey,
          title: formData.title,
          slug: selectedKey === 'home' ? 'home' : selectedKey === 'about' ? 'about-us' : selectedKey === 'privacy' ? 'privacy-policy' : selectedKey === 'terms' ? 'terms-and-conditions' : selectedKey,
          content: updatedContent as unknown as Json,
          published: true,
          created_at: prev[index]?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (index >= 0) {
          const next = [...prev];
          next[index] = updatedPage;
          return next;
        }
        return [...prev, updatedPage];
      });
      setSelectedKey(null);
    } else {
      toast({ type: 'error', title: 'Update Failed', message: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400 pointer-events-none" /> Editable Content Pages
        </h1>
        <p className="text-xs text-slate-400">Manage headlines, founder media, hero videos, and page copy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePages.map((item) => {
          const existing = pages.find((p) => p.page_key === item.key);
          const isConfigured = Boolean(existing);
          const updatedAt = existing?.updated_at ? new Date(existing.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
          const previewPath = item.key === 'home' ? '/' : item.key === 'privacy' ? '/privacy-policy' : item.key === 'terms' ? '/terms-and-conditions' : `/${item.key}`;

          return (
            <div
              key={item.key}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Key: {item.key}</span>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {isConfigured ? '✓ Custom Configured' : '◌ Default Wording'}
                    </span>
                    {updatedAt && <span className="text-[10px] text-slate-500">Updated {updatedAt}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditPage(item.key)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 pointer-events-none" /> Edit Content
                </button>
                <a
                  href={previewPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  title="Preview live page"
                >
                  ↗ Preview
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog isOpen={Boolean(selectedKey)} onClose={() => setSelectedKey(null)} title={`Edit Page Content: ${selectedKey}`}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <Label required>Page Display Title</Label>
            <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          {selectedKey === 'home' ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Hero Section Controls</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hero Enabled</Label>
                  <select
                    value={formData.hero_enabled ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, hero_enabled: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <Label>Media Type</Label>
                  <select
                    value={formData.hero_media_type}
                    onChange={(e) => setFormData({ ...formData, hero_media_type: e.target.value as 'video' | 'image' })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="image">Image Background</option>
                    <option value="video">Video Background</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <Label>Overlay Opacity ({formData.overlay_opacity}%)</Label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.overlay_opacity}
                  onChange={(e) => setFormData({ ...formData, overlay_opacity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <Label>Media Background Blur (0 - 100%)</Label>
                  <span className="text-amber-400 font-mono font-bold text-xs">{formData.hero_blur}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.hero_blur}
                  onChange={(e) => setFormData({ ...formData, hero_blur: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">Drag left to clear (0%), drag right to blur background image or video (up to 100%)</span>
              </div>

              <div>
                <MediaUploader
                  label="Desktop Hero Image"
                  value={formData.desktop_image}
                  folder="content"
                  onChange={(url) => setFormData({ ...formData, desktop_image: url })}
                />
              </div>

              <div>
                <Label>Desktop Video URL (.mp4)</Label>
                <Input
                  value={formData.desktop_video}
                  onChange={(e) => setFormData({ ...formData, desktop_video: e.target.value })}
                  placeholder="https://your-storage/video.mp4"
                />
              </div>

              <div>
                <Label>Hero H1 Title</Label>
                <Textarea rows={2} value={formData.hero_h1} onChange={(e) => setFormData({ ...formData, hero_h1: e.target.value })} />
              </div>

              <div>
                <Label>Hero Subtitle / Description</Label>
                <Textarea rows={3} value={formData.hero_description} onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })} />
              </div>
            </div>
          ) : selectedKey === 'about' ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">About Us Controls</h3>

              <div>
                <Label>Main Page H1</Label>
                <Input value={formData.about_h1} onChange={(e) => setFormData({ ...formData, about_h1: e.target.value })} />
              </div>

              <div>
                <Label>Introduction Paragraphs</Label>
                <Textarea rows={5} value={formData.about_intro} onChange={(e) => setFormData({ ...formData, about_intro: e.target.value })} />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Founder Section</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Founder Name</Label>
                    <Input value={formData.founder_name} onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Founder Role</Label>
                    <Input value={formData.founder_role} onChange={(e) => setFormData({ ...formData, founder_role: e.target.value })} />
                  </div>
                </div>

                <div>
                  <MediaUploader
                    label="Founder Photo (Supabase Upload)"
                    value={formData.founder_image}
                    folder="founder"
                    onChange={(url) => setFormData({ ...formData, founder_image: url })}
                  />
                </div>

                <div>
                  <Label>Founder Bio / Story</Label>
                  <Textarea rows={6} value={formData.founder_content} onChange={(e) => setFormData({ ...formData, founder_content: e.target.value })} />
                </div>

                <div>
                  <Label>Founder Quote</Label>
                  <Input value={formData.founder_quote} onChange={(e) => setFormData({ ...formData, founder_quote: e.target.value })} />
                </div>

                <div>
                  <Label>Display Statistics Bar</Label>
                  <select
                    value={formData.stats_visible ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, stats_visible: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
            </div>
          ) : selectedKey === 'services' ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Services Page Controls</h3>

              <div>
                <Label>Services Main H1</Label>
                <Input value={formData.services_h1} onChange={(e) => setFormData({ ...formData, services_h1: e.target.value })} />
              </div>

              <div>
                <Label>Services Overview Intro</Label>
                <Textarea rows={4} value={formData.services_intro} onChange={(e) => setFormData({ ...formData, services_intro: e.target.value })} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Section Heading</Label>
                <Input value={formData.heading} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} />
              </div>

              <div>
                <Label>Main Content Text</Label>
                <Textarea rows={6} value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="gold" size="md" className="font-bold">
              <Save className="w-4 h-4 mr-1 pointer-events-none" /> Save &amp; Publish Page Controls
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
