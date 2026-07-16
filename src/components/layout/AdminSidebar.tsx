'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Sliders,
  Sparkles,
  Navigation,
  Image as ImageIcon,
  FileText,
  Search,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AdminProfile } from '@/types/database';
import { logoutAdminAction } from '@/app/actions/admin-auth';

export interface AdminSidebarProps {
  admin?: AdminProfile | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ admin }) => {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'Core Management',
      items: [
        { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: '/admin/locations', label: 'Locations', icon: <MapPin className="w-4 h-4" /> },
        { href: '/admin/projects', label: 'Projects', icon: <Building2 className="w-4 h-4" /> },
        { href: '/admin/configurations', label: 'Property Configs', icon: <Sliders className="w-4 h-4" /> },
        { href: '/admin/amenities', label: 'Amenities', icon: <Sparkles className="w-4 h-4" /> },
        { href: '/admin/landmarks', label: 'Landmarks', icon: <Navigation className="w-4 h-4" /> },
        { href: '/admin/gallery', label: 'Gallery & Media', icon: <ImageIcon className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Content & Leads',
      items: [
        { href: '/admin/messages', label: 'Messages & Leads', icon: <MessageSquare className="w-4 h-4" /> },
        { href: '/admin/pages', label: 'Content Pages', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/seo', label: 'SEO Management', icon: <Search className="w-4 h-4" /> },
        { href: '/admin/settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
        ...(admin?.role === 'super_admin'
          ? [{ href: '/admin/users', label: 'Admin Users', icon: <ShieldCheck className="w-4 h-4" /> }]
          : []),
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 font-serif">
              Y
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-white tracking-tight block">
                Your Choice
              </span>
              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider block">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h5 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {group.title}
              </h5>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150',
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
};
