import React from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/server';
import {
  MessageSquare,
  Building2,
  MapPin,
  ShieldCheck,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createAdminClient();

  const [
    { count: newMessagesCount },
    { count: siteVisitsCount },
    { count: projectCount },
    { count: locationCount },
    { data: recentMessages },
    { data: statusBreakdownRaw },
  ] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('message_type', 'site_visit'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('locations').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase
      .from('messages')
      .select('*, project:projects(name), location:locations(name)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('messages').select('status'),
  ]);

  // Status Breakdown calculation
  const statusCounts: Record<string, number> = {
    new: 0,
    contacted: 0,
    site_visit_scheduled: 0,
    completed: 0,
    closed: 0,
    spam: 0,
  };

  (statusBreakdownRaw || []).forEach((row: { status: string }) => {
    if (row.status && statusCounts[row.status] !== undefined) {
      statusCounts[row.status] += 1;
    }
  });

  const typedRecentMessages = ((recentMessages as unknown) as Message[]) || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Logged in as {admin.full_name}
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Executive Admin & Sales Control
          </h1>
        </div>

        <div className="text-xs text-slate-400">
          Role Level: <span className="text-amber-400 font-bold uppercase">{admin.role}</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Unprocessed Leads</span>
            <span className="text-3xl font-extrabold text-amber-400 font-serif mt-1 block">{newMessagesCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Site Visits Requested</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-serif mt-1 block">{siteVisitsCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Published Townships</span>
            <span className="text-3xl font-extrabold text-blue-400 font-serif mt-1 block">{projectCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Active Layout Hubs</span>
            <span className="text-3xl font-extrabold text-amber-500 font-serif mt-1 block">{locationCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pipeline Status Cards & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Pipeline Cards */}
        <div className="lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
            Lead Status Breakdown
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-semibold">New Enquiries</span>
              <Badge variant="emerald">{statusCounts.new}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-semibold">In Discussion / Contacted</span>
              <Badge variant="gold">{statusCounts.contacted}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-semibold">Site Visit Scheduled</span>
              <Badge variant="gold">{statusCounts.site_visit_scheduled}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-semibold">Completed Purchases</span>
              <Badge variant="emerald">{statusCounts.completed}</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-semibold">Spam / Closed</span>
              <Badge variant="slate">{statusCounts.spam + statusCounts.closed}</Badge>
            </div>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div className="lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-white">Recent Customer Inquiries</h3>
            <Link href="/admin/messages" className="text-xs text-amber-400 hover:underline flex items-center">
              View All Leads <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Project / Hub</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {typedRecentMessages.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">
                      {m.name}
                      <span className="block text-[10px] text-slate-400 font-normal font-mono">{m.phone}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant={m.message_type === 'site_visit' ? 'gold' : 'slate'}>
                        {m.message_type}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-300">{m.project?.name || m.location?.name || 'General'}</td>
                    <td className="p-3">
                      <Badge variant={m.status === 'new' ? 'emerald' : 'slate'}>{m.status}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/messages/${m.id}`} className="text-amber-400 hover:underline">
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
