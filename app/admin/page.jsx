'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Clock, Mail, Sparkles, Star, Images, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const CARDS = [
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheck, href: '/admin/bookings' },
  { key: 'pendingBookings', label: 'Pending Bookings', icon: Clock, href: '/admin/bookings?status=pending' },
  { key: 'unreadMessages', label: 'Unread Messages', icon: Mail, href: '/admin/messages' },
  { key: 'totalServices', label: 'Total Services', icon: Sparkles, href: '/admin/services' },
  { key: 'totalReviews', label: 'Total Reviews', icon: Star, href: '/admin/reviews' },
  { key: 'galleryImages', label: 'Gallery Images', icon: Images, href: '/admin/gallery' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    api.bookings
      .stats()
      .then((res) => {
        setStats(res.data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Dashboard</h1>
          <p className="text-sm text-espresso-soft">Welcome back — here&apos;s what&apos;s happening at the salon.</p>
        </div>
        <Link
          href="/admin/bookings"
          className="rounded-full bg-espresso px-6 py-2.5 text-[12px] uppercase tracking-[0.16em] text-cream transition hover:bg-rosewood-dark"
        >
          Manage bookings
        </Link>
      </div>

      {state === 'loading' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading dashboard">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : state === 'error' ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center">
          <p className="font-display text-xl text-espresso">Couldn&apos;t load dashboard data</p>
          <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream">
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CARDS.map((c) => (
              <Link
                key={c.key}
                href={c.href}
                className="group flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-dark text-white">
                  <c.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-3xl text-espresso">{stats?.[c.key] ?? 0}</span>
                  <span className="block text-xs uppercase tracking-[0.14em] text-espresso-soft">{c.label}</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-espresso/30 transition group-hover:translate-x-1 group-hover:text-rosewood" />
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-espresso">Recent bookings</h2>
                <Link href="/admin/bookings" className="text-xs uppercase tracking-[0.14em] text-rosewood hover:underline">
                  View all
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {(stats?.recentBookings || []).length === 0 && (
                  <li className="text-sm text-espresso-soft">No bookings yet.</li>
                )}
                {(stats?.recentBookings || []).map((b) => (
                  <li key={b._id} className="flex items-center justify-between gap-3 rounded-xl bg-shell px-4 py-3 text-sm">
                    <span>
                      <span className="font-medium text-espresso">{b.name}</span>
                      <span className="block text-xs text-espresso-soft">
                        {b.service || 'General'} · {formatDate(b.createdAt)}
                      </span>
                    </span>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-dark">
                      {b.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-espresso">Recent enquiries</h2>
                <Link href="/admin/messages" className="text-xs uppercase tracking-[0.14em] text-rosewood hover:underline">
                  View all
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {(stats?.recentMessages || []).length === 0 && (
                  <li className="text-sm text-espresso-soft">No messages yet.</li>
                )}
                {(stats?.recentMessages || []).map((m) => (
                  <li key={m._id} className="rounded-xl bg-shell px-4 py-3 text-sm">
                    <span className="font-medium text-espresso">{m.name}</span>
                    <span className="ml-2 text-xs text-espresso-soft">{formatDate(m.createdAt)}</span>
                    <span className="block truncate text-espresso-soft">{m.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
