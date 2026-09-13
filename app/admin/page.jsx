'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, MessageCircle, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.admin.dashboard();
        if (mounted) { setStats(res.data); setState('ready'); }
      } catch (e) {
        if (mounted) setState('error');
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (state === 'loading') {
    return (
      <div>
        <h1 className="font-display text-3xl text-espresso">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error' || !stats) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="font-display text-xl text-espresso">Could not load dashboard</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream">
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    { key: 'totalCustomers', label: 'Total Customers', icon: Users, href: '/admin/customers', color: 'from-rosewood to-rosewood-dark' },
    { key: 'pendingEnquiries', label: 'Pending Enquiries', icon: MessageCircle, href: '/admin/enquiries?status=pending', color: 'from-amber-500 to-amber-600' },
    { key: 'pendingAppointments', label: 'Pending Appointments', icon: Clock, href: '/admin/appointments?status=pending', color: 'from-gold to-gold-dark' },
    { key: 'confirmedAppointments', label: 'Confirmed', icon: CheckCircle, href: '/admin/appointments?status=confirmed', color: 'from-emerald-500 to-emerald-600' },
    { key: 'todaysAppointments', label: "Today's Appointments", icon: TrendingUp, href: '/admin/appointments', color: 'from-espresso to-espresso-soft' },
    { key: 'unreadMessages', label: 'Unread Messages', icon: MessageCircle, href: '/admin/enquiries?status=pending', color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Dashboard</h1>
          <p className="text-sm text-espresso-soft">Welcome back — here is what is happening at the salon.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-card"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white`}>
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
            <h2 className="font-display text-xl text-espresso">Recent appointments</h2>
            <Link href="/admin/appointments" className="text-xs uppercase tracking-[0.14em] text-rosewood hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {(!stats.recentAppointments || stats.recentAppointments.length === 0) && (
              <li className="text-sm text-espresso-soft">No appointments yet.</li>
            )}
            {(stats.recentAppointments || []).map((a) => (
              <li key={a._id} className="flex items-center justify-between gap-3 rounded-xl bg-shell px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-espresso">{a.name}</span>
                  <span className="block text-xs text-espresso-soft">
                    {a.service || 'General'} · {a.date} at {a.time} · {formatDate(a.createdAt)}
                  </span>
                </span>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-dark">
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-espresso">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs uppercase tracking-[0.14em] text-rosewood hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {(!stats.recentEnquiries || stats.recentEnquiries.length === 0) && (
              <li className="text-sm text-espresso-soft">No enquiries yet.</li>
            )}
            {(stats.recentEnquiries || []).map((e) => (
              <li key={e._id} className="rounded-xl bg-shell px-4 py-3 text-sm">
                <span className="font-medium text-espresso">{e.name}</span>
                <span className="ml-2 text-xs text-espresso-soft">{formatDate(e.createdAt)}</span>
                <span className="block truncate text-espresso-soft">{e.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}