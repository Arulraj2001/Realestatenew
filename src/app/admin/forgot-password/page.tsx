'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordAction } from '@/app/actions/admin-auth';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await forgotPasswordAction({ email });
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage(res.message || 'Check your inbox for password recovery instructions.');
    } else {
      setStatusMessage(res.error || 'Unable to process request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Reset Admin Password</h1>
          <p className="text-xs text-slate-400">
            Enter your admin email address to receive password reset instructions.
          </p>
        </div>

        {statusMessage && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fp-email" required>
              Registered Admin Email
            </Label>
            <Input
              id="fp-email"
              type="email"
              required
              placeholder="admin@yourchoiceproperties.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" variant="gold" size="lg" isLoading={isSubmitting} className="w-full font-bold">
            Send Reset Instructions
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/admin/login" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
