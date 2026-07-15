'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function loginAdminAction(formData: {
  email: string;
  password: string;
}) {
  try {
    const validated = loginSchema.parse(formData);
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (authError || !authData.user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Verify user has an active admin profile
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      return { success: false, error: 'Your account is inactive or unauthorized.' };
    }
  } catch (err) {
    console.error('Login action validation error:', err);
    return { success: false, error: 'Invalid authentication credentials provided.' };
  }

  redirect('/admin');
}

export async function forgotPasswordAction(formData: { email: string }) {
  try {
    const validated = forgotPasswordSchema.parse(formData);
    const supabase = await createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${siteUrl}/admin/reset-password`,
    });

    if (error) {
      console.error('Forgot password error:', error.message);
    }

    return {
      success: true,
      message: 'If an account exists for this email, a password reset link has been dispatched.',
    };
  } catch {
    return { success: false, error: 'Please enter a valid email address.' };
  }
}

export async function resetPasswordAction(formData: { password: string }) {
  try {
    const validated = resetPasswordSchema.parse(formData);
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: validated.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  } catch {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  redirect('/admin');
}

export async function logoutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
