'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, KeyRound } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAdminAction } from '@/app/actions/admin-auth';

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await loginAdminAction({ email, password });

    setIsSubmitting(false);

    if (res && !res.success) {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Brand Lock Tag */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center font-serif font-bold text-slate-950 text-2xl mx-auto shadow-lg">
            Y
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
            {siteConfig.name} Admin Login
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with your authorized staff credentials to access administrative controls.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-email" required>
              Email Address
            </Label>
            <Input
              id="admin-email"
              type="email"
              required
              placeholder="admin@yourchoiceproperties.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="admin-password" required className="mb-0">
                Password
              </Label>
              <Link
                href="/admin/forgot-password"
                className="text-[11px] text-amber-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Admin Portal</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          <KeyRound className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
          Protected by Supabase Auth and RLS Policies
        </div>
      </div>
    </div>
  );
}
