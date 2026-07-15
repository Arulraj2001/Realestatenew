'use client';

import React from 'react';
import { User, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AdminProfile } from '@/types/database';

export interface AdminHeaderProps {
  admin?: AdminProfile | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ admin }) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
          Admin Portal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-white leading-none">
              {admin?.full_name || 'Admin User'}
            </span>
            <span className="block text-[10px] text-amber-400 font-mono mt-0.5">
              {admin?.role || 'authorized'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
