'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Building2,
  Sliders,
  ChevronLeft,
  Trash2,
  Save,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Message, AdminProfile, MessageStatus } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { buildWhatsAppUrl, buildCallUrl } from '@/lib/utils/whatsapp';
import {
  updateMessageStatusAction,
  assignMessageAdminAction,
  saveMessageNotesAction,
  deleteMessageAction,
} from '@/app/actions/messages';
import { useToast } from '@/components/ui/toast';

export interface MessageDetailClientProps {
  currentAdmin: AdminProfile;
  message: Message;
  staffAdmins: AdminProfile[];
}

export const MessageDetailClient: React.FC<MessageDetailClientProps> = ({
  currentAdmin,
  message,
  staffAdmins,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [status, setStatus] = useState<MessageStatus>(message.status);
  const [assignedAdminId, setAssignedAdminId] = useState<string>(message.assigned_admin_id || '');
  const [notes, setNotes] = useState<string>(message.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: MessageStatus) => {
    setStatus(newStatus);
    const res = await updateMessageStatusAction(message.id, newStatus);
    if (res.success) {
      toast({ type: 'success', title: 'Lead Status Updated' });
    } else {
      toast({ type: 'error', title: 'Update Error', message: res.error });
    }
  };

  const handleAssignAdmin = async (newAdminId: string) => {
    setAssignedAdminId(newAdminId);
    const res = await assignMessageAdminAction(message.id, newAdminId || null);
    if (res.success) {
      toast({ type: 'success', title: 'Sales Admin Assigned' });
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    const res = await saveMessageNotesAction(message.id, notes);
    setIsUpdating(false);
    if (res.success) {
      toast({ type: 'success', title: 'Internal Notes Saved' });
    } else {
      toast({ type: 'error', title: 'Save Error', message: res.error });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this lead record?')) return;
    const isSpam = message.status === 'spam';
    const res = await deleteMessageAction(message.id, isSpam);

    if (res.success) {
      toast({ type: 'success', title: 'Lead Record Deleted' });
      router.push('/admin/messages');
    } else {
      toast({ type: 'error', title: 'Delete Failed', message: res.error });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ type: 'info', title: `Copied ${field} to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <Link href="/admin/messages" className="text-xs text-slate-400 hover:text-amber-400 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to All Messages
        </Link>

        <div className="flex items-center gap-2">
          {message.status === 'spam' || currentAdmin.role === 'super_admin' ? (
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-400 border-red-900 hover:bg-red-950">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Lead Record
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lead Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                {message.message_type === 'site_visit' ? (
                  <Badge variant="gold">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Site Visit Pickup Request
                  </Badge>
                ) : (
                  <Badge variant="slate">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> Direct Contact Message
                  </Badge>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(message.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Contact Person Card */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-amber-400" /> {message.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">Phone Number</span>
                      <span className="text-xs font-bold text-white">{message.phone}</span>
                    </div>
                  </div>
                  <button onClick={() => copyToClipboard(message.phone, 'Phone')} className="text-slate-400 hover:text-white p-1">
                    {copiedField === 'Phone' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {message.email && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">Email Address</span>
                        <span className="text-xs font-bold text-white truncate max-w-[130px]">{message.email}</span>
                      </div>
                    </div>
                    <button onClick={() => copyToClipboard(message.email!, 'Email')} className="text-slate-400 hover:text-white p-1">
                      {copiedField === 'Email' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Communication Quick Buttons */}
              <div className="flex gap-3 pt-2">
                <a
                  href={buildCallUrl(message.phone)}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" /> Direct Call
                </a>

                <a
                  href={buildWhatsAppUrl({
                    phone: message.phone,
                    projectName: message.project?.name,
                    locationName: message.location?.name,
                    customMessage: `Hi ${message.name}, thank you for contacting Your Choice Properties regarding your site visit requirement.`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-current" /> Open WhatsApp
                </a>
              </div>
            </div>

            {/* Visit Appointment Slot if Site Visit */}
            {message.message_type === 'site_visit' && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Requested Pickup Appointment</span>
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>Date: {message.preferred_visit_date || 'Flexible'}</span>
                  <span>Time Slot: {message.preferred_visit_time || 'Morning'}</span>
                </div>
              </div>
            )}

            {/* Property Context */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Context</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> Location
                  </span>
                  <span className="font-semibold text-slate-100">{message.location?.name || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-400" /> Project
                  </span>
                  <span className="font-semibold text-slate-100">{message.project?.name || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-500" /> Configuration
                  </span>
                  <span className="font-semibold text-slate-100">{message.property_configuration?.name || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Original Message Narrative */}
            {message.message && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Message Notes</h3>
                <p className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {message.message}
                </p>
              </div>
            )}

            {/* Tracking Source Metadata */}
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-[11px] text-slate-400 font-mono">
              <div>Source Page: <span className="text-amber-400">{message.source_page || '/contact-us'}</span></div>
              {message.utm_source && <div>UTM Source: {message.utm_source}</div>}
              {message.utm_medium && <div>UTM Medium: {message.utm_medium}</div>}
              {message.utm_campaign && <div>UTM Campaign: {message.utm_campaign}</div>}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Control (Status, Assignment & Internal Notes) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl sticky top-24">
            <h3 className="font-serif font-bold text-lg text-white">Lead Workflow Management</h3>

            {/* Lead Status Selector */}
            <div className="space-y-2">
              <Label>Lead Status Stage</Label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
              >
                <option value="new">New (Unprocessed)</option>
                <option value="contacted">Contacted / In Progress</option>
                <option value="site_visit_scheduled">Site Visit Scheduled</option>
                <option value="completed">Completed / Purchased</option>
                <option value="closed">Closed / Not Interested</option>
                <option value="spam">Spam / Invalid</option>
              </select>
            </div>

            {/* Assignee Sales Admin */}
            <div className="space-y-2">
              <Label>Assigned Sales Advisor</Label>
              <select
                value={assignedAdminId}
                onChange={(e) => handleAssignAdmin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
              >
                <option value="">Unassigned</option>
                {staffAdmins.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.full_name} ({adm.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Internal Admin Notes Editor */}
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Internal Follow-up Notes</Label>
              <Textarea
                id="admin-notes"
                rows={5}
                placeholder="Log customer phone discussions, site pickup arrangements, or plot negotiation status..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button variant="gold" size="sm" isLoading={isUpdating} onClick={handleSaveNotes} className="w-full font-bold">
                <Save className="w-4 h-4" /> Save Internal Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
