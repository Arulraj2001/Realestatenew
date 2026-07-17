'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit3, Trash2, Eye, EyeOff, Globe, ExternalLink, Link2,
  Map, Bot, BarChart3,
} from 'lucide-react';
import { SEOMetadata } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { saveSeoMetadataAction, deleteSeoMetadataAction, saveRobotsConfigAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';
import { siteConfig } from '@/config/site';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EntityOption { id: string; name: string; slug: string; projectName?: string }

interface Props {
  initialSeoRecords: SEOMetadata[];
  locations: EntityOption[];
  projects: EntityOption[];
  configurations: EntityOption[];
  initialRobotsConfig: string;
}

const ENTITY_TYPES = [
  { value: 'page',          label: '📄 Static Page',    hasEntities: false, urlPrefix: '' },
  { value: 'location',      label: '📍 Location',        hasEntities: true,  urlPrefix: '/locations/' },
  { value: 'project',       label: '🏗️ Project',         hasEntities: true,  urlPrefix: '/projects/' },
  { value: 'configuration', label: '🏠 Property',        hasEntities: true,  urlPrefix: '/properties/' },
] as const;

const CHANGE_FREQ_OPTIONS = ['always','hourly','daily','weekly','monthly','yearly','never'];
const PRIORITY_OPTIONS = [
  { value: '1.0', label: '1.0 — Highest' },
  { value: '0.9', label: '0.9 — Very High' },
  { value: '0.8', label: '0.8 — High' },
  { value: '0.7', label: '0.7 — Medium-High' },
  { value: '0.6', label: '0.6 — Medium' },
  { value: '0.5', label: '0.5 — Default' },
  { value: '0.4', label: '0.4 — Medium-Low' },
  { value: '0.3', label: '0.3 — Low' },
  { value: '0.2', label: '0.2 — Very Low' },
  { value: '0.1', label: '0.1 — Minimal' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? 'text-red-400' : len > max * 0.85 ? 'text-amber-400' : 'text-slate-500';
  return <span className={`text-xs font-mono ml-auto ${color}`}>{len}/{max}</span>;
}

function GooglePreview({ title, description, url }: { title: string; description: string; url?: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-2">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Eye className="w-3 h-3" /> Google Search Preview
      </p>
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-0.5">
        <p className="text-xs text-[#006621] truncate font-sans">
          {(url || 'yoursite.com').replace(/^https?:\/\//, '')}
        </p>
        <p className="text-[17px] text-[#1a0dab] leading-tight truncate font-sans hover:underline cursor-pointer">
          {(title || 'Page Title').slice(0, 60)}{(title || '').length > 60 && '…'}
        </p>
        <p className="text-sm text-[#545454] font-sans leading-snug line-clamp-2">
          {(description || 'Meta description will appear here…').slice(0, 160)}{(description || '').length > 160 && '…'}
        </p>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-amber-500' : 'bg-slate-700'}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ─── Default form state ───────────────────────────────────────────────────────

const defaultForm = {
  entity_type: 'page', entity_id: '',
  meta_title: '', meta_description: '', canonical_url: '',
  open_graph_title: '', open_graph_description: '', open_graph_image_path: '',
  index_enabled: true, json_ld_override: '',
  sitemap_priority: '', sitemap_change_frequency: '',
};

// ─── Tab type ─────────────────────────────────────────────────────────────────
type Tab = 'seo' | 'sitemap' | 'robots';

// ─── Main component ───────────────────────────────────────────────────────────

export const SeoClientManager: React.FC<Props> = ({
  initialSeoRecords, locations, projects, configurations, initialRobotsConfig,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('seo');
  const [seoRecords, setSeoRecords] = useState<SEOMetadata[]>(initialSeoRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SEOMetadata | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SEOMetadata | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [formData, setFormData] = useState(defaultForm);

  // Robots state
  const [robotsJson, setRobotsJson] = useState(initialRobotsConfig);
  const [robotsError, setRobotsError] = useState('');
  const [isSavingRobots, setIsSavingRobots] = useState(false);

  const patch = (key: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const entityTypeConfig = ENTITY_TYPES.find((t) => t.value === formData.entity_type)!;
  const entityOptions: EntityOption[] = (() => {
    switch (formData.entity_type) {
      case 'location': return locations;
      case 'project': return projects;
      case 'configuration': return configurations;
      default: return [];
    }
  })();
  const selectedEntity = entityOptions.find((e) => e.id === formData.entity_id) ?? null;

  useEffect(() => {
    if (selectedEntity && !editingRecord) {
      const url = `${siteConfig.domain}${entityTypeConfig.urlPrefix}${selectedEntity.slug}`;
      patch('canonical_url', url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.entity_id, formData.entity_type]);

  const handleEntityTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev, entity_type: type, entity_id: '',
      canonical_url: type === 'page' ? siteConfig.domain : '',
    }));
  };

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormData({ ...defaultForm, canonical_url: siteConfig.domain });
    setJsonError('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rec: SEOMetadata) => {
    setEditingRecord(rec);
    setFormData({
      entity_type: rec.entity_type || 'page',
      entity_id: rec.entity_id || '',
      meta_title: rec.meta_title || '',
      meta_description: rec.meta_description || '',
      canonical_url: rec.canonical_url || '',
      open_graph_title: rec.open_graph_title || '',
      open_graph_description: rec.open_graph_description || '',
      open_graph_image_path: rec.open_graph_image_path || '',
      index_enabled: rec.index_enabled ?? true,
      json_ld_override: rec.json_ld_override ? JSON.stringify(rec.json_ld_override, null, 2) : '',
      sitemap_priority: rec.sitemap_priority != null ? String(rec.sitemap_priority) : '',
      sitemap_change_frequency: rec.sitemap_change_frequency || '',
    });
    setJsonError('');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.json_ld_override.trim()) {
      try { JSON.parse(formData.json_ld_override); setJsonError(''); }
      catch { setJsonError('Invalid JSON — please fix before saving.'); return; }
    }
    setIsSaving(true);
    const payload: Record<string, unknown> = {
      ...formData,
      entity_id: formData.entity_id || null,
      json_ld_override: formData.json_ld_override.trim() ? JSON.parse(formData.json_ld_override) : null,
      sitemap_priority: formData.sitemap_priority ? parseFloat(formData.sitemap_priority) : null,
      sitemap_change_frequency: formData.sitemap_change_frequency || null,
    };
    const res = await saveSeoMetadataAction(payload, editingRecord?.id);
    setIsSaving(false);
    if (res.success) {
      toast({ type: 'success', title: 'SEO Record Saved & Cache Cleared' });
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      toast({ type: 'error', title: 'Error Saving SEO', message: res.error });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteSeoMetadataAction(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (res.success) {
      toast({ type: 'success', title: 'SEO Record Deleted' });
      setSeoRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const handleSaveRobots = async () => {
    try { JSON.parse(robotsJson); setRobotsError(''); }
    catch { setRobotsError('Invalid JSON — fix before saving.'); return; }
    setIsSavingRobots(true);
    const res = await saveRobotsConfigAction(robotsJson);
    setIsSavingRobots(false);
    if (res.success) toast({ type: 'success', title: 'Robots.txt Updated' });
    else toast({ type: 'error', title: 'Save Failed', message: res.error });
  };

  const previewUrl = formData.canonical_url ||
    (selectedEntity ? `${siteConfig.domain}${entityTypeConfig.urlPrefix}${selectedEntity.slug}` : siteConfig.domain);

  // ─── Tab bar ───────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'seo',     label: 'SEO Records',    icon: <Search className="w-4 h-4" /> },
    { id: 'sitemap', label: 'Sitemap Status',  icon: <Map className="w-4 h-4" /> },
    { id: 'robots',  label: 'Robots.txt',      icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-amber-400" /> SEO & Technical Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Meta tags · OpenGraph · Structured data · Sitemap · Robots.txt
          </p>
        </div>
        {activeTab === 'seo' && (
          <Button variant="gold" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" /> Add SEO Override
          </Button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: SEO Records ══════════════ */}
      {activeTab === 'seo' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Records',     value: seoRecords.length },
              { label: 'Indexing Enabled',  value: seoRecords.filter((r) => r.index_enabled).length },
              { label: 'Has OG Image',      value: seoRecords.filter((r) => r.open_graph_image_path).length },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-400">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] font-bold text-slate-400">
                  <tr>
                    <th className="p-4">Entity Type</th>
                    <th className="p-4">Linked Entity</th>
                    <th className="p-4">Meta Title</th>
                    <th className="p-4">Meta Description</th>
                    <th className="p-4 text-center">Index</th>
                    <th className="p-4 text-center">Sitemap</th>
                    <th className="p-4 text-center">OG</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {seoRecords.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-slate-500">No SEO records yet. Click &ldquo;Add SEO Override&rdquo; to get started.</td></tr>
                  )}
                  {seoRecords.map((rec) => {
                    const linkedName = (() => {
                      if (!rec.entity_id) return null;
                      const loc = locations.find((l) => l.id === rec.entity_id);
                      if (loc) return loc.name;
                      const proj = projects.find((p) => p.id === rec.entity_id);
                      if (proj) return proj.name;
                      const cfg = configurations.find((c) => c.id === rec.entity_id);
                      if (cfg) return `${cfg.name}${cfg.projectName ? ` (${cfg.projectName})` : ''}`;
                      return rec.entity_id.slice(0, 8) + '…';
                    })();
                    return (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-amber-400">{rec.entity_type}</td>
                        <td className="p-4 max-w-[140px]">
                          {linkedName
                            ? <span className="flex items-center gap-1 text-slate-300 truncate"><Link2 className="w-3 h-3 shrink-0 text-blue-400" />{linkedName}</span>
                            : <span className="text-slate-600 italic">global</span>}
                        </td>
                        <td className="p-4 font-bold text-white max-w-[160px] truncate">{rec.meta_title}</td>
                        <td className="p-4 max-w-[200px] truncate text-slate-400">{rec.meta_description}</td>
                        <td className="p-4 text-center">
                          {rec.index_enabled
                            ? <Globe className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                            : <EyeOff className="w-3.5 h-3.5 text-red-400 mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {rec.sitemap_priority != null || rec.sitemap_change_frequency
                            ? <BarChart3 className="w-3.5 h-3.5 text-purple-400 mx-auto" />
                            : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="p-4 text-center">
                          {rec.open_graph_image_path
                            ? <ExternalLink className="w-3.5 h-3.5 text-blue-400 mx-auto" />
                            : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEdit(rec)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget(rec)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ══════════════ TAB: Sitemap Status ══════════════ */}
      {activeTab === 'sitemap' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-amber-300 mb-1">How sitemap overrides work</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each SEO record linked to a location, project, or property controls that URL&apos;s sitemap entry.
              Set <strong className="text-slate-300">sitemap priority</strong> (0.0–1.0) and{' '}
              <strong className="text-slate-300">change frequency</strong> per entity in the SEO Records tab.
              Setting <strong className="text-slate-300">Search Engine Indexing = OFF</strong> will exclude
              that URL from the sitemap entirely.
            </p>
          </div>

          {/* Sitemap overview table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-200">Current Sitemap Overrides</p>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> View sitemap.xml
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] font-bold text-slate-400">
                  <tr>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-center">In Sitemap</th>
                    <th className="p-4 text-center">Priority Override</th>
                    <th className="p-4 text-center">Frequency Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {seoRecords.filter((r) => r.entity_id).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No entity-level overrides yet. Add an SEO record linked to a project/location/property to override its sitemap settings.
                      </td>
                    </tr>
                  )}
                  {seoRecords
                    .filter((r) => r.entity_id)
                    .map((rec) => {
                      const name = (() => {
                        const loc = locations.find((l) => l.id === rec.entity_id);
                        if (loc) return loc.name;
                        const proj = projects.find((p) => p.id === rec.entity_id);
                        if (proj) return proj.name;
                        const cfg = configurations.find((c) => c.id === rec.entity_id);
                        return cfg ? cfg.name : rec.entity_id?.slice(0, 8) + '…';
                      })();
                      return (
                        <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-medium text-slate-200">{name}</td>
                          <td className="p-4 font-mono text-amber-400 text-[11px]">{rec.entity_type}</td>
                          <td className="p-4 text-center">
                            {rec.index_enabled
                              ? <span className="text-emerald-400 text-xs font-medium">✓ Yes</span>
                              : <span className="text-red-400 text-xs font-medium">✗ Excluded</span>}
                          </td>
                          <td className="p-4 text-center text-slate-300">
                            {rec.sitemap_priority != null ? rec.sitemap_priority : <span className="text-slate-600">default</span>}
                          </td>
                          <td className="p-4 text-center text-slate-300">
                            {rec.sitemap_change_frequency || <span className="text-slate-600">default</span>}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Default values reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Values (when no override)</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { type: 'Location',      freq: 'weekly',  priority: '0.8' },
                { type: 'Project',       freq: 'daily',   priority: '0.9' },
                { type: 'Property',      freq: 'weekly',  priority: '0.8' },
              ].map((row) => (
                <div key={row.type} className="bg-slate-950 rounded-lg p-3">
                  <p className="font-semibold text-amber-400 mb-1">{row.type}</p>
                  <p className="text-slate-400">Priority: <span className="text-slate-200">{row.priority}</span></p>
                  <p className="text-slate-400">Frequency: <span className="text-slate-200">{row.freq}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB: Robots.txt ══════════════ */}
      {activeTab === 'robots' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
            <p className="text-sm font-semibold text-blue-300 mb-1">Dynamic Robots.txt</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edit the JSON array below to control what search engine bots can and cannot crawl.
              Each object specifies a <code className="text-blue-300">userAgent</code>, optional{' '}
              <code className="text-blue-300">allow</code> paths, and{' '}
              <code className="text-blue-300">disallow</code> paths.
              Changes take effect at <a href="/robots.txt" target="_blank" rel="noreferrer"
                className="text-blue-400 underline">/robots.txt</a> immediately after saving.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div className="space-y-3">
              <Label>Rules JSON</Label>
              <Textarea
                rows={18}
                value={robotsJson}
                onChange={(e) => { setRobotsJson(e.target.value); setRobotsError(''); }}
                className="font-mono text-xs"
                placeholder={`[\n  {\n    "userAgent": "*",\n    "allow": ["/"],\n    "disallow": ["/admin/", "/api/"]\n  }\n]`}
              />
              {robotsError && <p className="text-xs text-red-400">⚠ {robotsError}</p>}
              <div className="flex gap-3">
                <Button variant="gold" size="sm" onClick={handleSaveRobots} isLoading={isSavingRobots}>
                  Save Robots.txt
                </Button>
                <a href="/robots.txt" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3.5 h-3.5" /> Preview
                  </Button>
                </a>
              </div>
            </div>

            {/* Reference */}
            <div className="space-y-3">
              <Label>Schema Reference</Label>
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-3">
                <p className="text-slate-500 not-italic font-sans text-[11px] uppercase tracking-wider mb-2">Example structure</p>
                <pre className="whitespace-pre-wrap text-emerald-400">{`[
  {
    "userAgent": "*",
    "allow": ["/"],
    "disallow": [
      "/admin/",
      "/api/"
    ]
  },
  {
    "userAgent": "Googlebot",
    "allow": ["/"],
    "disallow": []
  }
]`}</pre>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">Common user-agents</p>
                {['* (all bots)', 'Googlebot', 'Bingbot', 'DuckDuckBot', 'Slurp (Yahoo)'].map((b) => (
                  <p key={b} className="flex items-center gap-2">
                    <Bot className="w-3 h-3 text-slate-600" /> {b}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}
        title={editingRecord ? 'Edit SEO Entry' : 'Add SEO Entry'}
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <GooglePreview
            title={formData.open_graph_title || formData.meta_title}
            description={formData.open_graph_description || formData.meta_description}
            url={previewUrl}
          />

          {/* Step 1: Entity */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1 · Target Entity</p>
            <div className="grid grid-cols-2 gap-2">
              {ENTITY_TYPES.map((et) => (
                <button key={et.value} type="button" onClick={() => handleEntityTypeChange(et.value)}
                  className={`text-left text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                    formData.entity_type === et.value
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'
                  }`}>{et.label}</button>
              ))}
            </div>
            {entityTypeConfig.hasEntities && (
              <div>
                <Label>
                  {formData.entity_type === 'location' ? 'Select Location'
                    : formData.entity_type === 'project' ? 'Select Project'
                    : 'Select Property'}
                </Label>
                <select value={formData.entity_id} onChange={(e) => patch('entity_id', e.target.value)} required
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors">
                  <option value="" disabled>— pick one —</option>
                  {entityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-slate-900">
                      {opt.name}{opt.projectName ? ` — ${opt.projectName}` : ''}
                    </option>
                  ))}
                </select>
                {selectedEntity && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-blue-400">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {siteConfig.domain}{entityTypeConfig.urlPrefix}{selectedEntity.slug}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Meta */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">2 · Meta Tags</p>
            <div>
              <div className="flex items-center mb-1"><Label required>Meta Title</Label><CharCounter value={formData.meta_title} max={60} /></div>
              <Input required value={formData.meta_title} onChange={(e) => patch('meta_title', e.target.value)} placeholder="Page Title | Your Choice Properties" />
              {formData.meta_title.length > 60 && <p className="text-xs text-red-400 mt-1">⚠ Exceeds 60 chars — will be truncated</p>}
            </div>
            <div>
              <div className="flex items-center mb-1"><Label required>Meta Description</Label><CharCounter value={formData.meta_description} max={160} /></div>
              <Textarea required rows={3} value={formData.meta_description} onChange={(e) => patch('meta_description', e.target.value)} placeholder="Enter page meta description…" />
              {formData.meta_description.length > 160 && <p className="text-xs text-red-400 mt-1">⚠ Exceeds 160 chars — will be truncated</p>}
            </div>
            <div>
              <Label>Canonical URL</Label>
              <Input value={formData.canonical_url} onChange={(e) => patch('canonical_url', e.target.value)} placeholder="https://yoursite.com/page" />
            </div>
          </div>

          {/* Step 3: OG */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3 · OpenGraph / Social Sharing</p>
            <div>
              <div className="flex items-center mb-1"><Label>OG Title</Label><CharCounter value={formData.open_graph_title} max={60} /></div>
              <Input value={formData.open_graph_title} onChange={(e) => patch('open_graph_title', e.target.value)} placeholder="Defaults to meta title" />
            </div>
            <div>
              <div className="flex items-center mb-1"><Label>OG Description</Label><CharCounter value={formData.open_graph_description} max={160} /></div>
              <Textarea rows={2} value={formData.open_graph_description} onChange={(e) => patch('open_graph_description', e.target.value)} placeholder="Defaults to meta description" />
            </div>
            <div>
              <Label>OG Image Path / URL</Label>
              <Input value={formData.open_graph_image_path} onChange={(e) => patch('open_graph_image_path', e.target.value)} placeholder="/og-image.jpg or full URL" />
              <p className="text-[11px] text-slate-500 mt-1">Recommended: 1200×630 px</p>
            </div>
          </div>

          {/* Step 4: Sitemap */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4 · Sitemap Settings</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority Override</Label>
                <select value={formData.sitemap_priority} onChange={(e) => patch('sitemap_priority', e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors">
                  <option value="">Use default</option>
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Change Frequency Override</Label>
                <select value={formData.sitemap_change_frequency} onChange={(e) => patch('sitemap_change_frequency', e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors">
                  <option value="">Use default</option>
                  {CHANGE_FREQ_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-slate-900 capitalize">{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 5: Advanced */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">5 · Advanced</p>
            <div>
              <Label>JSON-LD Structured Data (optional)</Label>
              <Textarea rows={5} value={formData.json_ld_override}
                onChange={(e) => { patch('json_ld_override', e.target.value); setJsonError(''); }}
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'} className="font-mono text-xs" />
              {jsonError && <p className="text-xs text-red-400 mt-1">⚠ {jsonError}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Search Engine Indexing</p>
                <p className="text-xs text-slate-500">Off = noindex/nofollow + excluded from sitemap</p>
              </div>
              <Toggle checked={formData.index_enabled} onChange={(v) => patch('index_enabled', v)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="gold" size="md" isLoading={isSaving}>
              {editingRecord ? 'Update SEO Record' : 'Create SEO Record'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} isLoading={isDeleting}
        title="Delete SEO Record"
        message={`This will permanently remove the SEO override for "${deleteTarget?.entity_type}". The page will fall back to its default metadata.`}
        confirmLabel="Delete"
      />
    </div>
  );
};
