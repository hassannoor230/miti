'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) {
      setExpired(true);
      setError('This reset link is invalid or has expired.');
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      await api.auth.resetPassword(token, newPassword);
      setSuccess('Password reset successfully. Redirecting to login…');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  }

  if (expired && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shell px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl text-espresso">Invalid Link</h1>
          <p className="mt-3 text-espresso-soft">This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="mt-6 inline-block text-rosewood hover:underline">Request a new link</Link>
        </div>
      </div>
    );
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
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
