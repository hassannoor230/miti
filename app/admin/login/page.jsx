'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      await api.auth.login(email, password);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Login failed — please try again.');
      setState('error');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-6">
      <div className="w-full max-w-md rounded-3xl bg-cream p-8 md:p-10 shadow-soft">
        <p className="flex items-center gap-2 text-xs uppercase tracking-lux text-gold-dark">
          <Lock className="h-4 w-4" /> Salon owner area
        </p>
        <h1 className="mt-3 font-display text-3xl text-espresso">
          Miti <span className="italic text-rosewood">Beauty</span> Admin
        </h1>
        <p className="mt-2 text-sm text-espresso-soft">Log in to manage bookings, services, reviews and more.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white py-3 pl-11 pr-4 text-espresso"
                placeholder="admin@mitibeauty.co.uk"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
              Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white py-3 pl-11 pr-4 text-espresso"
                placeholder="••••••••"
              />
            </div>
          </div>
          {state === 'error' && (
            <p className="text-sm text-rosewood-dark" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="w-full rounded-full bg-espresso px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60"
          >
            {state === 'sending' ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        {process.env.NEXT_PUBLIC_DEMO_HINT === 'true' && (
          <p className="mt-6 rounded-xl bg-shell p-3 text-center text-xs text-espresso-soft">
            Preview access — email: <strong>admin@mitibeauty.co.uk</strong> · password: <strong>MitiAdmin2026!</strong>
            <br />
            (Change these in production via backend <code>.env</code>.)
          </p>
        )}
      </div>
    </div>
  );
}
