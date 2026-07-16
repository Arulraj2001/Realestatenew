'use client';

import React, { useState } from 'react';
import {
  Settings,
  Phone,
  Share2,
  Megaphone,
  Save,
  BarChart3,
  Star,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { saveSiteSettingAction } from '@/app/actions/crud';
import { useToast } from '@/components/ui/toast';

export interface SiteSettingRecord {
  key: string;
  value: Record<string, unknown>;
}

// ─────────────────────────────────────────────
// Sub-types for each setting panel
// ─────────────────────────────────────────────
interface StatItem { label: string; value: string }
interface TestimonialItem { name: string; location: string; rating: number; comment: string }
interface FAQItem { id: string; title: string; content: string }

// ─────────────────────────────────────────────
// Defaults (mirrors the component-level defaults)
// ─────────────────────────────────────────────
const DEFAULT_STATS: StatItem[] = [
  { label: 'Years of Trust', value: '12+' },
  { label: 'Happy Homeowners', value: '1,200+' },
  { label: 'DTCP Layouts Completed', value: '25+' },
  { label: 'Sq.Ft Developed', value: '1.5M+' },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Dr. K. Senthil Nathan',
    location: 'Rasi Garden, Namakkal',
    rating: 5,
    comment: 'Purchased a 1,500 Sq.Ft villa plot at Rasi Garden. Clear title documents, instant registration, and top-tier blacktop roads. Highly recommend Your Choice Properties for hassle-free buying.',
  },
  {
    name: 'Mr. P. Subramaniam',
    location: 'Kongu Nagar, Namakkal',
    rating: 5,
    comment: 'Constructed a 3BHK independent villa through their construction team. Excellent floor plan customization, transparent pricing, and finished 15 days ahead of schedule!',
  },
  {
    name: 'Mrs. Jayanthi Viswanathan',
    location: 'Kongu Garden, Paramathi Velur',
    rating: 5,
    comment: 'The free pickup and drop facility for site visits was extremely helpful for our family. Bank housing loan process was completed within 7 working days thanks to their staff.',
  },
];

const DEFAULT_FAQS: FAQItem[] = [
  { id: 'faq-1', title: 'Are all plots and villas DTCP & RERA approved?', content: 'Yes, 100% of our layout developments in Namakkal and Paramathi Velur hold full DTCP and RERA statutory approvals. All planning permissions and title deeds are verified by senior legal advisors.' },
  { id: 'faq-2', title: 'How do I book a site visit?', content: 'You can click "Schedule Site Visit" on our website or call +91 98765 43210. We provide free private car pickup and drop facilities for families anywhere in Namakkal, Tiruchengodu, or Paramathi Velur.' },
  { id: 'faq-3', title: 'Do you offer assistance with bank housing loans?', content: 'Yes, our dedicated documentation team manages the complete bank loan application process. We are pre-approved with nationalized banks including State Bank of India, HDFC Bank, and Canara Bank.' },
  { id: 'faq-4', title: 'Can I request custom villa construction on my purchased plot?', content: 'Absolutely. We offer complete turn-key villa construction services. Our architects will customize floor plans (2BHK, 3BHK, 4BHK) according to your family requirements and vastu preferences.' },
  { id: 'faq-5', title: 'What basic infrastructure is provided in the gated layouts?', content: 'All townships are delivered with 30ft & 40ft blacktop asphalt roads, underground drainage network, individual water supply tap connections, street lighting, compound wall, and children park zones.' },
];

// ─────────────────────────────────────────────
// Helper: parse array from setting record
// ─────────────────────────────────────────────
function parseArray<T>(settings: SiteSettingRecord[], key: string, defaults: T[]): T[] {
  const rec = settings.find((s) => s.key === key)?.value;
  if (Array.isArray(rec) && rec.length > 0) return rec as T[];
  return defaults;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export const SettingsClientManager: React.FC<{ initialSettings: SiteSettingRecord[] }> = ({
  initialSettings,
}) => {
  const { toast } = useToast();

  // ── Contact & Social & Announcement ──────────────────────────────────────
  const contactRec = initialSettings.find((s) => s.key === 'contact_info')?.value || {};
  const socialRec = initialSettings.find((s) => s.key === 'social_links')?.value || {};
  const announcementRec = initialSettings.find((s) => s.key === 'global_announcement')?.value || {};

  const [contactData, setContactData] = useState({
    company_name: String(contactRec.company_name || 'Your Choice Properties'),
    phone: String(contactRec.phone || '+91 98427 22123'),
    whatsapp: String(contactRec.whatsapp || '+919842722123'),
    email: String(contactRec.email || 'info@yourchoiceproperties.in'),
    address: String(contactRec.address || 'Main Road, Namakkal, Tamil Nadu - 637001'),
    working_hours: String(contactRec.working_hours || 'Mon - Sun: 9:00 AM - 8:00 PM'),
  });

  const [socialData, setSocialData] = useState({
    facebook: String(socialRec.facebook || 'https://facebook.com/yourchoiceproperties'),
    instagram: String(socialRec.instagram || 'https://instagram.com/yourchoiceproperties'),
    youtube: String(socialRec.youtube || 'https://youtube.com/@yourchoiceproperties'),
  });

  const [announcementData, setAnnouncementData] = useState({
    enabled: announcementRec.enabled !== false,
    message: String(
      announcementRec.message ||
        '✨ DTCP & RERA Approved Residential Plots & Luxury Villas in Namakkal & Paramathi Velur'
    ),
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatItem[]>(
    parseArray<StatItem>(initialSettings, 'homepage_stats', DEFAULT_STATS)
  );

  const updateStat = (idx: number, field: keyof StatItem, val: string) => {
    setStats((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };
  const addStat = () => setStats((prev) => [...prev, { label: '', value: '' }]);
  const removeStat = (idx: number) => setStats((prev) => prev.filter((_, i) => i !== idx));

  // ── Testimonials ──────────────────────────────────────────────────────────
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    parseArray<TestimonialItem>(initialSettings, 'testimonials', DEFAULT_TESTIMONIALS)
  );

  const updateTestimonial = (idx: number, field: keyof TestimonialItem, val: string | number) => {
    setTestimonials((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: val } : t)));
  };
  const addTestimonial = () =>
    setTestimonials((prev) => [...prev, { name: '', location: '', rating: 5, comment: '' }]);
  const removeTestimonial = (idx: number) =>
    setTestimonials((prev) => prev.filter((_, i) => i !== idx));

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const [faqs, setFaqs] = useState<FAQItem[]>(
    parseArray<FAQItem>(initialSettings, 'faqs', DEFAULT_FAQS)
  );

  const updateFaq = (idx: number, field: keyof FAQItem, val: string) => {
    setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, [field]: val } : f)));
  };
  const addFaq = () =>
    setFaqs((prev) => [...prev, { id: `faq-${Date.now()}`, title: '', content: '' }]);
  const removeFaq = (idx: number) => setFaqs((prev) => prev.filter((_, i) => i !== idx));

  // ── Save handlers ─────────────────────────────────────────────────────────
  const save = async (key: string, value: unknown, label: string) => {
    const res = await saveSiteSettingAction(key, value as Record<string, unknown>);
    if (res.success) {
      toast({ type: 'success', title: `${label} Saved` });
    } else {
      toast({ type: 'error', title: 'Save Failed', message: res.error });
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => { e.preventDefault(); await save('contact_info', contactData, 'Contact Settings'); };
  const handleSaveSocial = async (e: React.FormEvent) => { e.preventDefault(); await save('social_links', socialData, 'Social Media Links'); };
  const handleSaveAnnouncement = async (e: React.FormEvent) => { e.preventDefault(); await save('global_announcement', announcementData, 'Announcement Bar'); };
  const handleSaveStats = async (e: React.FormEvent) => { e.preventDefault(); await save('homepage_stats', stats, 'Stats Bar'); };
  const handleSaveTestimonials = async (e: React.FormEvent) => { e.preventDefault(); await save('testimonials', testimonials, 'Testimonials'); };
  const handleSaveFaqs = async (e: React.FormEvent) => { e.preventDefault(); await save('faqs', faqs, 'FAQ Section'); };

  // ─────────────────────────────────────────────────────────────────────────
  // Shared panel header style
  const panelClass = 'p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl';
  const panelTitleClass = 'flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3';

  return (
    <div className="space-y-12">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" /> Global Website Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage contact info, announcement bar, social handles, homepage stats, testimonials, and FAQ.
        </p>
      </div>

      {/* ── Section 1: Contact & Social & Announcement ──────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Contact & Navigation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact */}
          <form onSubmit={handleSaveContact} className={panelClass}>
            <div className={panelTitleClass}>
              <Phone className="w-4 h-4 text-amber-400" /> Corporate Contact Info
            </div>
            <div>
              <Label required>Company Name</Label>
              <Input value={contactData.company_name} onChange={(e) => setContactData({ ...contactData, company_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Phone Number</Label>
                <Input value={contactData.phone} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} />
              </div>
              <div>
                <Label required>WhatsApp Number</Label>
                <Input value={contactData.whatsapp} onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })} />
              </div>
            </div>
            <div>
              <Label required>Official Email</Label>
              <Input value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} />
            </div>
            <div>
              <Label required>Office Address</Label>
              <Textarea rows={2} value={contactData.address} onChange={(e) => setContactData({ ...contactData, address: e.target.value })} />
            </div>
            <div>
              <Label required>Working Hours</Label>
              <Input value={contactData.working_hours} onChange={(e) => setContactData({ ...contactData, working_hours: e.target.value })} />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="gold" size="sm" className="font-bold">
                <Save className="w-3.5 h-3.5 mr-1" /> Save Contact Info
              </Button>
            </div>
          </form>

          <div className="space-y-8">
            {/* Announcement */}
            <form onSubmit={handleSaveAnnouncement} className={panelClass}>
              <div className={panelTitleClass}>
                <Megaphone className="w-4 h-4 text-emerald-400" /> Header Announcement Banner
              </div>
              <div>
                <Label>Banner Enabled</Label>
                <select
                  value={announcementData.enabled ? 'true' : 'false'}
                  onChange={(e) => setAnnouncementData({ ...announcementData, enabled: e.target.value === 'true' })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                >
                  <option value="true">Enabled (Visible in top bar)</option>
                  <option value="false">Disabled (Hidden)</option>
                </select>
              </div>
              <div>
                <Label required>Banner Announcement Message</Label>
                <Textarea rows={3} value={announcementData.message} onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="gold" size="sm" className="font-bold">
                  <Save className="w-3.5 h-3.5 mr-1" /> Save Announcement Bar
                </Button>
              </div>
            </form>

            {/* Social */}
            <form onSubmit={handleSaveSocial} className={panelClass}>
              <div className={panelTitleClass}>
                <Share2 className="w-4 h-4 text-blue-400" /> Social Media Links
              </div>
              <div>
                <Label>Facebook URL</Label>
                <Input value={socialData.facebook} onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })} />
              </div>
              <div>
                <Label>Instagram URL</Label>
                <Input value={socialData.instagram} onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })} />
              </div>
              <div>
                <Label>YouTube Channel URL</Label>
                <Input value={socialData.youtube} onChange={(e) => setSocialData({ ...socialData, youtube: e.target.value })} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="gold" size="sm" className="font-bold">
                  <Save className="w-3.5 h-3.5 mr-1" /> Save Social Links
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Section 2: Homepage Stats ────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Homepage Stats Bar</h2>
        <form onSubmit={handleSaveStats} className={panelClass}>
          <div className={panelTitleClass}>
            <BarChart3 className="w-4 h-4 text-amber-400" /> Stats Numbers (shown on amber bar on homepage)
          </div>
          <p className="text-xs text-slate-400">These 4 numbers appear in the golden stats bar. Keep value short (e.g. &quot;12+&quot;, &quot;1,200+&quot;).</p>

          <div className="space-y-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <Label>Value (e.g. 12+)</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      placeholder="12+"
                    />
                  </div>
                  <div>
                    <Label>Label (e.g. Years of Trust)</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      placeholder="Years of Trust"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  className="mt-4 p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                  title="Remove stat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={addStat} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
            <Button type="submit" variant="gold" size="sm" className="font-bold">
              <Save className="w-3.5 h-3.5 mr-1" /> Save Stats
            </Button>
          </div>
        </form>
      </div>

      {/* ── Section 3: Testimonials ──────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Client Testimonials</h2>
        <form onSubmit={handleSaveTestimonials} className={panelClass}>
          <div className={panelTitleClass}>
            <Star className="w-4 h-4 text-amber-400" /> Testimonials (shown in Hear From Our Homeowners section)
          </div>
          <p className="text-xs text-slate-400">Add up to 6 testimonials. Each will appear as a card on the testimonials section.</p>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Review #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(idx)}
                    className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove testimonial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label required>Customer Name</Label>
                    <Input value={t.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} placeholder="Dr. K. Senthil Nathan" />
                  </div>
                  <div>
                    <Label required>Location / Project</Label>
                    <Input value={t.location} onChange={(e) => updateTestimonial(idx, 'location', e.target.value)} placeholder="Rasi Garden, Namakkal" />
                  </div>
                </div>
                <div>
                  <Label>Star Rating (1–5)</Label>
                  <select
                    value={t.rating}
                    onChange={(e) => updateTestimonial(idx, 'rating', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label required>Testimonial Text</Label>
                  <Textarea
                    rows={3}
                    value={t.comment}
                    onChange={(e) => updateTestimonial(idx, 'comment', e.target.value)}
                    placeholder="Share the customer's experience..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={addTestimonial} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add Testimonial
            </button>
            <Button type="submit" variant="gold" size="sm" className="font-bold">
              <Save className="w-3.5 h-3.5 mr-1" /> Save Testimonials
            </Button>
          </div>
        </form>
      </div>

      {/* ── Section 4: FAQ ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">FAQ Section</h2>
        <form onSubmit={handleSaveFaqs} className={panelClass}>
          <div className={panelTitleClass}>
            <HelpCircle className="w-4 h-4 text-emerald-400" /> FAQ Questions & Answers (shown on Contact Us page)
          </div>
          <p className="text-xs text-slate-400">Edit existing questions or add new ones. They appear in the accordion on the Contact page.</p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">FAQ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <Label required>Question</Label>
                  <Input
                    value={faq.title}
                    onChange={(e) => updateFaq(idx, 'title', e.target.value)}
                    placeholder="Are all plots DTCP approved?"
                  />
                </div>
                <div>
                  <Label required>Answer</Label>
                  <Textarea
                    rows={3}
                    value={faq.content}
                    onChange={(e) => updateFaq(idx, 'content', e.target.value)}
                    placeholder="Yes, all our layouts..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={addFaq} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
            <Button type="submit" variant="gold" size="sm" className="font-bold">
              <Save className="w-3.5 h-3.5 mr-1" /> Save FAQs
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
