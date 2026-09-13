'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const me = await api.auth.me();
        if (mounted) {
          setUser(me.data || me);
          if (!me.data?.isTemporaryPassword && !me.isTemporaryPassword) {
            router.replace('/dashboard');
          }
        }
      } catch {
        if (mounted) router.replace('/dashboard');
      } finally {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      await api.customer.changePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully. Redirecting…');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  }

  if (checking || (user === null && checking)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shell px-6">
        <div className="h-10 w-56 animate-pulse rounded bg-white" />
      </div>
    );
  }

  if (user && !user.isTemporaryPassword) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-shell px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-espresso">Miti <span className="italic text-rosewood">Beauty</span></h1>
          <p className="mt-2 text-sm text-espresso-soft">Set your new password</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Current (Temporary) Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-rosewood-dark" role="alert">{error}</p>}
            {success && <p className="text-sm text-emerald-700" role="status">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-espresso px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60"
            >
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
