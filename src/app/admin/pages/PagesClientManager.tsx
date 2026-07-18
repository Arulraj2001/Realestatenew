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

const ICON_OPTIONS = [
  { value: 'Award',     label: '🏆 Award' },
  { value: 'Building2', label: '🏢 Building' },
  { value: 'Users',     label: '👥 Users' },
  { value: 'Maximize',  label: '⊡ Maximize (Area)' },
  { value: 'Home',      label: '🏠 Home' },
];

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
    text_alignment: 'center',
    intro_h2: '',
    intro_content: '',
    stats_visible: true,
    stats_list: [] as Array<{ label: string; value: string; icon?: string }>,
    why_choose_us_items: [] as Array<{ title: string; description: string }>,
    gallery_heading: '',
    gallery_description: '',
    gallery_cta: '',
    final_cta_heading: '',
    final_cta_description: '',

    // About Page Extended Admin Controls
    about_h1: '',
    about_bg_image: '',
    about_intro: '',
    founder_name: '',
    founder_role: '',
    founder_content: '',
    founder_image: '',
    founder_quote: '',
    timeline_milestones: [] as Array<{ year: string; title: string; subtitle: string; description: string; badge?: string }>,
    why_left_title: '',
    why_left_desc: '',
    why_left_checklist: [] as string[],

    // Services Page Extended Admin Controls
    services_h1: '',
    services_intro: '',
    cta_heading: '',
    cta_description: '',
    services_list: [] as Array<{ id: string; title: string; content: string; image_url?: string }>,

    // Contact Page
    subtitle: '',
    contact_bg_image: '',
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

    const defaultHomeStats = [
      { label: "Years of Trust", value: "12+", icon: "Award" },
      { label: "Happy Homeowners", value: "1,200+", icon: "Users" },
      { label: "DTCP Layouts Completed", value: "25+", icon: "Building2" },
      { label: "Sq.Ft Developed", value: "1.5M+", icon: "Maximize" }
    ];

    const defaultAboutStats = [
      { label: 'Years of Experience', value: '13+', icon: 'Award' },
      { label: 'Successful Projects', value: '5', icon: 'Building2' },
      { label: 'Happy Customers', value: '135+', icon: 'Users' },
      { label: 'Plots Sold', value: '120+', icon: 'Maximize' },
      { label: 'Villas Sold', value: '15+', icon: 'Home' }
    ];

    const defaultWhyChooseUs = [
      {
        title: 'Clear Documentation',
        description: 'We explain the available property documents clearly before booking.',
      },
      {
        title: 'Good Locations',
        description: 'Our projects are placed near useful roads, schools, hospitals and growing areas.',
      },
      {
        title: 'Site-Visit Support',
        description: 'Our team helps you visit and compare the projects before deciding.',
      },
      {
        title: 'Loan Guidance',
        description: 'We guide eligible buyers in understanding available home-loan options.',
      }
    ];

    const resolvedStatsList = (Array.isArray(c.stats_list) && c.stats_list.length > 0)
      ? c.stats_list
      : key === 'home'
      ? defaultHomeStats
      : key === 'about'
      ? defaultAboutStats
      : [];

    const resolvedWhyChooseUs = (Array.isArray(c.why_choose_us_items) && c.why_choose_us_items.length > 0)
      ? c.why_choose_us_items
      : key === 'home'
      ? defaultWhyChooseUs
      : [];

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
      text_alignment: String(c.text_alignment || 'center'),
      intro_h2: String(c.intro_h2 || 'Find Residential Plots and Dream Villas in Namakkal and Paramathi Velur'),
      intro_content: String(c.intro_content || ''),
      stats_visible: c.stats_visible !== false,
      stats_list: resolvedStatsList,
      why_choose_us_items: resolvedWhyChooseUs,
      gallery_heading: String(c.gallery_heading || 'See Our Projects'),
      gallery_description: String(c.gallery_description || 'View real site photos, villa designs, roads, layouts and construction updates from our projects.'),
      gallery_cta: String(c.gallery_cta || 'View Gallery'),
      final_cta_heading: String(c.final_cta_heading || 'Visit the Project Before You Decide'),
      final_cta_description: String(c.final_cta_description || 'Tell us which location or property you are interested in, and our team will arrange a guided site visit.'),

      // About
      about_h1: String(c.about_h1 || 'Your Trusted Real Estate Partner in Namakkal and Paramathi Velur'),
      about_bg_image: String(c.about_bg_image || ''),
      about_intro: String(c.about_intro || ''),
      founder_name: String(c.founder_name || 'Thennarasu Sambathkumar'),
      founder_role: String(c.founder_role || 'Managing Director'),
      founder_content: String(c.founder_content || ''),
      founder_image: String(c.founder_image || ''),
      founder_quote: String(c.founder_quote || 'We do not just sell plots and houses. We help people find a property that matches their choice, budget and future.'),
      timeline_milestones: (Array.isArray(c.timeline_milestones) && c.timeline_milestones.length > 0) ? c.timeline_milestones : [],
      why_left_title: String(c.why_left_title || 'Your Preferred Real Estate Developer'),
      why_left_desc: String(c.why_left_desc || 'We combine DTCP regulatory compliance, transparent sub-registrar documentation, and strategic layout locations to protect your capital and build genuine long-term value.'),
      why_left_checklist: Array.isArray(c.why_left_checklist) ? c.why_left_checklist : [
        '100% Verified Legal Documents',
        'Zero Hidden Fees or Charges',
        'Guided Private Site Visit Transport'
      ],

      // Services
      services_h1: String(c.services_h1 || 'Our Real Estate Services in Namakkal and Paramathi Velur'),
      services_intro: String(c.services_intro || 'Our team helps you choose the right plot or villa and supports you from your first enquiry through site visit, documentation and registration.'),
      cta_heading: String(c.cta_heading || 'Need Help Choosing the Right Plot or Villa?'),
      cta_description: String(c.cta_description || 'Talk to our team and explore suitable property options in Namakkal and Paramathi Velur.'),
      services_list: (Array.isArray(c.services_list) && c.services_list.length > 0)
        ? c.services_list
        : [
            {
              id: 'srv-1',
              title: 'Residential Plot Sales',
              content: 'We offer DTCP-approved residential plots in Namakkal and Paramathi Velur for buyers who want to build a home or invest in land. Our team explains the location, available plot sizes, documents and current price before you decide.',
              image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'srv-2',
              title: 'Villa and House Sales — 2BHK, 3BHK and 4BHK',
              content: 'We help families explore 2BHK, 3BHK and 4BHK villas and independent houses across Rasi Garden, Kongu Nagar and Kongu Garden. Available choices depend on the project and current construction status.',
              image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'srv-3',
              title: 'Site Visits and Consultation',
              content: 'Our local team arranges guided site visits so you can compare the location, roads, layout, villa design and nearby facilities before making a decision.',
              image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'srv-4',
              title: 'Documentation and Registration Support',
              content: 'We guide buyers through available title documents, patta-related information, booking paperwork and registration. Buyers should independently verify all legal documents before purchase.',
              image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
            },
            {
              id: 'srv-5',
              title: 'Home-Loan Assistance',
              content: 'We guide eligible buyers in understanding available loan and financing options. Final approval, interest rates and terms are decided by the bank or financial institution.',
              image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
            },
          ],

      // Contact Page
      subtitle: String(c.subtitle || 'Looking for your dream home or the perfect investment?'),
      contact_bg_image: String(c.contact_bg_image || ''),
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
        text_alignment: formData.text_alignment,
        intro_h2: formData.intro_h2,
        intro_content: formData.intro_content,
        stats_visible: formData.stats_visible,
        stats_list: formData.stats_list,
        why_choose_us_items: formData.why_choose_us_items,
        gallery_heading: formData.gallery_heading,
        gallery_description: formData.gallery_description,
        gallery_cta: formData.gallery_cta,
        final_cta_heading: formData.final_cta_heading,
        final_cta_description: formData.final_cta_description,
      };
    } else if (selectedKey === 'about') {
      updatedContent = {
        ...existingObj,
        about_h1: formData.about_h1,
        about_bg_image: formData.about_bg_image,
        about_intro: formData.about_intro,
        founder_name: formData.founder_name,
        founder_role: formData.founder_role,
        founder_content: formData.founder_content,
        founder_image: formData.founder_image,
        founder_quote: formData.founder_quote,
        stats_visible: formData.stats_visible,
        stats_list: formData.stats_list,
        why_choose_us_items: formData.why_choose_us_items,
        why_left_title: formData.why_left_title,
        why_left_desc: formData.why_left_desc,
        why_left_checklist: formData.why_left_checklist,
        timeline_milestones: formData.timeline_milestones,
        cta_heading: formData.cta_heading,
        cta_description: formData.cta_description,
      };
    } else if (selectedKey === 'services') {
      updatedContent = {
        ...existingObj,
        services_h1: formData.services_h1,
        services_intro: formData.services_intro,
        cta_heading: formData.cta_heading,
        cta_description: formData.cta_description,
        services_list: formData.services_list,
      };
    } else if (selectedKey === 'contact') {
      updatedContent = {
        ...existingObj,
        heading: formData.heading,
        subtitle: formData.subtitle,
        body: formData.body,
        contact_bg_image: formData.contact_bg_image,
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

      <Dialog isOpen={Boolean(selectedKey)} onClose={() => setSelectedKey(null)} title={`Edit Page Content: ${selectedKey}`} className="max-w-4xl">
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

              {/* #### MISSING FIELDS ADDED #### */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Additional Hero & Section Controls</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Secondary CTA Label</Label>
                    <Input value={formData.secondary_cta_label} onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })} placeholder="Contact Us" />
                  </div>
                  <div>
                    <Label>Text Alignment</Label>
                    <select value={formData.text_alignment} onChange={(e) => setFormData({ ...formData, text_alignment: e.target.value as 'left' | 'center' | 'right' })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white">
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                <div>
                  <MediaUploader label="Mobile Hero Image" value={formData.mobile_image} folder="content" onChange={(url) => setFormData({ ...formData, mobile_image: url })} />
                </div>

                <div>
                  <Label>Mobile Video URL (.mp4)</Label>
                  <Input value={formData.mobile_video} onChange={(e) => setFormData({ ...formData, mobile_video: e.target.value })} placeholder="https://your-storage/mobile-video.mp4" />
                </div>

                <div>
                  <Label>Gallery CTA Label</Label>
                  <Input value={formData.gallery_cta} onChange={(e) => setFormData({ ...formData, gallery_cta: e.target.value })} placeholder="View Gallery" />
                </div>

                <div>
                  <Label>Primary CTA Link</Label>
                  <Input value={formData.primary_cta_link} onChange={(e) => setFormData({ ...formData, primary_cta_link: e.target.value })} placeholder="/projects" />
                </div>

                {/* Stats List Editor */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Homepage Stats List ({formData.stats_list.length})</h4>
                    <button type="button" onClick={() => setFormData({ ...formData, stats_list: [...formData.stats_list, { label: '', value: '', icon: 'Award' }] })} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors">
                      + Add Stat
                    </button>
                  </div>
                  {formData.stats_list.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Stat #{idx + 1}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, stats_list: formData.stats_list.filter((_, i) => i !== idx) })} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Value (e.g. 12+)</Label>
                          <Input value={stat.value} onChange={(e) => { const updated = [...formData.stats_list]; updated[idx] = { ...updated[idx], value: e.target.value }; setFormData({ ...formData, stats_list: updated }); }} placeholder="12+" />
                        </div>
                        <div>
                          <Label>Label</Label>
                          <Input value={stat.label} onChange={(e) => { const updated = [...formData.stats_list]; updated[idx] = { ...updated[idx], label: e.target.value }; setFormData({ ...formData, stats_list: updated }); }} placeholder="Years of Trust" />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <select
                            value={stat.icon || 'Award'}
                            onChange={(e) => {
                              const updated = [...formData.stats_list];
                              updated[idx] = { ...updated[idx], icon: e.target.value };
                              setFormData({ ...formData, stats_list: updated });
                            }}
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors font-sans"
                          >
                            {ICON_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why Choose Us Items Editor */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Why Choose Us Items ({formData.why_choose_us_items.length})</h4>
                    <button type="button" onClick={() => setFormData({ ...formData, why_choose_us_items: [...formData.why_choose_us_items, { title: '', description: '' }] })} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors">
                      + Add Item
                    </button>
                  </div>
                  {formData.why_choose_us_items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Item #{idx + 1}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, why_choose_us_items: formData.why_choose_us_items.filter((_, i) => i !== idx) })} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">
                          Remove
                        </button>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input value={item.title} onChange={(e) => { const updated = [...formData.why_choose_us_items]; updated[idx] = { ...updated[idx], title: e.target.value }; setFormData({ ...formData, why_choose_us_items: updated }); }} placeholder="Clear Documentation" />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea rows={2} value={item.description} onChange={(e) => { const updated = [...formData.why_choose_us_items]; updated[idx] = { ...updated[idx], description: e.target.value }; setFormData({ ...formData, why_choose_us_items: updated }); }} placeholder="We explain the available property documents clearly before booking." />
                      </div>
                    </div>
                  ))}
                </div>
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
                <MediaUploader
                  label="Company Profile Section Background Image"
                  value={formData.about_bg_image}
                  folder="about"
                  onChange={(url) => setFormData({ ...formData, about_bg_image: url })}
                />
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

              {/* About Page Stats List */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">About Page Stats List ({formData.stats_list.length})</h4>
                  <button type="button" onClick={() => setFormData({ ...formData, stats_list: [...formData.stats_list, { label: '', value: '', icon: 'Award' }] })} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors">
                    + Add Stat
                  </button>
                </div>
                {formData.stats_list.map((stat, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Stat #{idx + 1}</span>
                      <button type="button" onClick={() => setFormData({ ...formData, stats_list: formData.stats_list.filter((_, i) => i !== idx) })} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">Remove</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label>Value (e.g. 13+)</Label>
                        <Input value={stat.value} onChange={(e) => { const updated = [...formData.stats_list]; updated[idx] = { ...updated[idx], value: e.target.value }; setFormData({ ...formData, stats_list: updated }); }} placeholder="13+" />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input value={stat.label} onChange={(e) => { const updated = [...formData.stats_list]; updated[idx] = { ...updated[idx], label: e.target.value }; setFormData({ ...formData, stats_list: updated }); }} placeholder="Years of Experience" />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <select
                          value={stat.icon || 'Award'}
                          onChange={(e) => {
                            const updated = [...formData.stats_list];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setFormData({ ...formData, stats_list: updated });
                          }}
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors font-sans"
                        >
                          {ICON_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* About Page Why Choose Us Items */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Why Choose Us Items ({formData.why_choose_us_items.length})</h4>
                  <button type="button" onClick={() => setFormData({ ...formData, why_choose_us_items: [...formData.why_choose_us_items, { title: '', description: '' }] })} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors">
                    + Add Item
                  </button>
                </div>
                {formData.why_choose_us_items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Item #{idx + 1}</span>
                      <button type="button" onClick={() => setFormData({ ...formData, why_choose_us_items: formData.why_choose_us_items.filter((_, i) => i !== idx) })} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">Remove</button>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={item.title} onChange={(e) => { const updated = [...formData.why_choose_us_items]; updated[idx] = { ...updated[idx], title: e.target.value }; setFormData({ ...formData, why_choose_us_items: updated }); }} placeholder="Prime Location" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={2} value={item.description} onChange={(e) => { const updated = [...formData.why_choose_us_items]; updated[idx] = { ...updated[idx], description: e.target.value }; setFormData({ ...formData, why_choose_us_items: updated }); }} placeholder="Projects in fast-growing areas..." />
                    </div>
                  </div>
                ))}
              </div>

              {/* Why We're the Right Choice Left Highlight Card Controls */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Why Choose Us Left Highlight Card</h4>
                <div>
                  <Label>Card Title</Label>
                  <Input value={formData.why_left_title} onChange={(e) => setFormData({ ...formData, why_left_title: e.target.value })} placeholder="Your Preferred Real Estate Developer" />
                </div>
                <div>
                  <Label>Card Description</Label>
                  <Textarea rows={3} value={formData.why_left_desc} onChange={(e) => setFormData({ ...formData, why_left_desc: e.target.value })} placeholder="We combine DTCP regulatory compliance..." />
                </div>
                <div>
                  <Label>Checklist Highlights (One item per line)</Label>
                  <Textarea
                    rows={3}
                    value={Array.isArray(formData.why_left_checklist) ? formData.why_left_checklist.join('\n') : ''}
                    onChange={(e) => setFormData({ ...formData, why_left_checklist: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="100% Verified Legal Documents&#10;Zero Hidden Fees or Charges&#10;Guided Private Site Visit Transport"
                  />
                </div>
              </div>

              {/* About Page Timeline Milestones */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Company Timeline Milestones ({formData.timeline_milestones.length})</h4>
                  <button type="button" onClick={() => setFormData({ ...formData, timeline_milestones: [...formData.timeline_milestones, { year: '', title: '', subtitle: '', description: '', badge: '' }] })} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors">
                    + Add Milestone
                  </button>
                </div>
                {formData.timeline_milestones.map((milestone, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Milestone #{idx + 1}</span>
                      <button type="button" onClick={() => setFormData({ ...formData, timeline_milestones: formData.timeline_milestones.filter((_, i) => i !== idx) })} className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Year</Label>
                        <Input value={milestone.year} onChange={(e) => { const updated = [...formData.timeline_milestones]; updated[idx] = { ...updated[idx], year: e.target.value }; setFormData({ ...formData, timeline_milestones: updated }); }} placeholder="2011" />
                      </div>
                      <div>
                        <Label>Badge (optional)</Label>
                        <Input value={milestone.badge || ''} onChange={(e) => { const updated = [...formData.timeline_milestones]; updated[idx] = { ...updated[idx], badge: e.target.value }; setFormData({ ...formData, timeline_milestones: updated }); }} placeholder="Foundation" />
                      </div>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={milestone.title} onChange={(e) => { const updated = [...formData.timeline_milestones]; updated[idx] = { ...updated[idx], title: e.target.value }; setFormData({ ...formData, timeline_milestones: updated }); }} placeholder="Foundational Real Estate Mastery" />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input value={milestone.subtitle} onChange={(e) => { const updated = [...formData.timeline_milestones]; updated[idx] = { ...updated[idx], subtitle: e.target.value }; setFormData({ ...formData, timeline_milestones: updated }); }} placeholder="Land Acquisition & Legal Due Diligence" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={2} value={milestone.description} onChange={(e) => { const updated = [...formData.timeline_milestones]; updated[idx] = { ...updated[idx], description: e.target.value }; setFormData({ ...formData, timeline_milestones: updated }); }} placeholder="Key leadership entered real estate development..." />
                    </div>
                  </div>
                ))}
              </div>

              {/* About Page Bottom CTA */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div>
                  <Label>Bottom CTA Heading</Label>
                  <Input value={formData.cta_heading} onChange={(e) => setFormData({ ...formData, cta_heading: e.target.value })} placeholder="Let Us Help You Find the Right Property" />
                </div>
                <div>
                  <Label>Bottom CTA Description</Label>
                  <Input value={formData.cta_description} onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })} placeholder="Talk to our team or schedule a visit..." />
                </div>
              </div>
            </div>
          ) : selectedKey === 'services' ? (
            <div className="space-y-6 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Services Page Controls</h3>

              <div>
                <Label>Services Main H1</Label>
                <Input value={formData.services_h1} onChange={(e) => setFormData({ ...formData, services_h1: e.target.value })} />
              </div>

              <div>
                <Label>Services Overview Intro</Label>
                <Textarea rows={3} value={formData.services_intro} onChange={(e) => setFormData({ ...formData, services_intro: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <Label>Bottom CTA Heading</Label>
                  <Input value={formData.cta_heading} onChange={(e) => setFormData({ ...formData, cta_heading: e.target.value })} placeholder="Need Help Choosing the Right Plot or Villa?" />
                </div>
                <div>
                  <Label>Bottom CTA Description</Label>
                  <Input value={formData.cta_description} onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })} placeholder="Talk to our team and explore suitable property options." />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Service Cards & Images ({formData.services_list?.length || 0})</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newSrv = {
                        id: `srv-${Date.now()}`,
                        title: 'New Real Estate Service',
                        content: 'Description of the new service.',
                        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                      };
                      setFormData({
                        ...formData,
                        services_list: [...(formData.services_list || []), newSrv],
                      });
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    + Add Service Card
                  </button>
                </div>

                {formData.services_list?.map((srv: { id: string; title: string; content: string; image_url?: string }, index: number) => (
                  <div key={srv.id || index} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Service #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.services_list.filter((_: unknown, idx: number) => idx !== index);
                          setFormData({ ...formData, services_list: updated });
                        }}
                        className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <Label>Card Title</Label>
                      <Input
                        value={srv.title}
                        onChange={(e) => {
                          const updated = [...formData.services_list];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setFormData({ ...formData, services_list: updated });
                        }}
                      />
                    </div>

                    <div>
                      <Label>Card Description</Label>
                      <Textarea
                        rows={3}
                        value={srv.content}
                        onChange={(e) => {
                          const updated = [...formData.services_list];
                          updated[index] = { ...updated[index], content: e.target.value };
                          setFormData({ ...formData, services_list: updated });
                        }}
                      />
                    </div>

                    <div>
                      <MediaUploader
                        label="Card Cover Image"
                        value={srv.image_url || ''}
                        folder="services"
                        onChange={(url) => {
                          const updated = [...formData.services_list];
                          updated[index] = { ...updated[index], image_url: url };
                          setFormData({ ...formData, services_list: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Main Heading (H1)</Label>
                <Input value={formData.heading} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} placeholder="Contact Your Choice Properties" />
              </div>

              {selectedKey === 'contact' && (
                <div>
                  <Label>Sub-heading / Question (H2)</Label>
                  <Input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Looking for your dream home or the perfect investment?" />
                </div>
              )}

              <div>
                <Label>Main Description / Body (H3)</Label>
                <Textarea rows={4} value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} />
              </div>

              {selectedKey === 'contact' && (
                <div>
                  <MediaUploader
                    label="Contact Banner Background Image"
                    value={formData.contact_bg_image || ''}
                    folder="banners"
                    onChange={(url) => setFormData({ ...formData, contact_bg_image: url })}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Upload an image to show as the background of the Contact page header banner.</p>
                </div>
              )}
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
