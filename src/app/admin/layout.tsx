import React from 'react';
import { getAuthenticatedAdmin } from '@/lib/auth/admin';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { ToastProvider } from '@/components/ui/toast';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
        <AdminSidebar admin={admin} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader admin={admin} />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
