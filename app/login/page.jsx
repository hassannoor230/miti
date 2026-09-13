'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { setCookie } from '@/lib/cookies';

export default function CustomerLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.login(form.email, form.password);
      if (res.token) setCookie('miti_customer_token', res.token, 7);
      if (res.requiresPasswordChange) {
        window.location.href = '/change-password';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-shell px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-espresso">Miti <span className="italic text-rosewood">Beauty</span></h1>
          <p className="mt-2 text-sm text-espresso-soft">Customer login</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-rosewood-dark" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-espresso px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <Link href="/forgot-password" className="text-rosewood hover:underline">Forgot password?</Link>
            <p className="text-espresso-soft">
              Don't have an account? Submit an enquiry from our{' '}
              <Link href="/contact" className="text-rosewood hover:underline">Contact page</Link>
              {' '}and we'll create one for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}