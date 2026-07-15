import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-white">403 — Unauthorized Access</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your role does not possess permissions to access this administrative module. Super Admin elevation is required for managing user accounts.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/admin">
            <Button variant="gold" size="md" className="w-full font-semibold">
              Return to Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
