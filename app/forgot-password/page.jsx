'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.auth.forgotPassword(email);
      setSuccess('If an account exists with that email, you will receive a password reset link.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-shell px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-espresso">Miti <span className="italic text-rosewood">Beauty</span></h1>
          <p className="mt-2 text-sm text-espresso-soft">Forgot your password?</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-sm text-rosewood-dark" role="alert">{error}</p>}
            {success && <p className="text-sm text-emerald-700" role="status">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-espresso px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
          <div className="mt-6 text-sm">
            <Link href="/login" className="text-rosewood hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
