'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rescheduled: 'bg-blue-50 text-blue-700 ring-blue-200',
    completed: 'bg-shell text-espresso ring-espresso/15',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  };
  const label = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    rescheduled: 'Rescheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${map[status] || map.pending}`}>
      {label[status] || status}
    </span>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [me, appts, notifs] = await Promise.all([
          api.auth.me(),
          api.customer.appointments.list().catch(() => ({ data: [] })),
          api.customer.notifications.list().catch(() => ({ data: [], unreadCount: 0 })),
        ]);
        if (mounted) {
          setUser(me.data);
          setAppointments(appts.data || []);
          setNotifications(notifs.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const upcoming = appointments.find((a) => ['pending', 'confirmed', 'rescheduled'].includes(a.status));
  const recentEnquiry = null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-14">
        <div className="h-10 w-56 animate-pulse rounded bg-shell" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-white shadow-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-18">
      <h1 className="font-display text-4xl text-espresso">
        Welcome back, <span className="italic text-rosewood">{user?.name || 'Customer'}</span>
      </h1>
      <p className="mt-2 text-espresso-soft">Here is your account overview.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso-soft">Upcoming Appointment</p>
          {upcoming ? (
            <div className="mt-4">
              <p className="font-display text-2xl text-espresso">{upcoming.service}</p>
              <p className="mt-1 text-sm text-espresso-soft">{upcoming.date} at {upcoming.time}</p>
              <div className="mt-3"><StatusBadge status={upcoming.status} /></div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-espresso-soft">No upcoming appointment.</p>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso-soft">Recent Enquiry</p>
          <p className="mt-4 text-sm text-espresso-soft">View all enquiries and replies.</p>
          <Link href="/dashboard/enquiries" className="mt-3 inline-block text-sm font-medium text-rosewood hover:underline">
            Open enquiries →
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso-soft">Notifications</p>
          <p className="mt-4 text-3xl font-display text-espresso">{notifications.length}</p>
          <p className="text-sm text-espresso-soft">total notifications</p>
          <Link href="/dashboard/notifications" className="mt-3 inline-block text-sm font-medium text-rosewood hover:underline">
            View notifications →
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/book" className="rounded-full bg-espresso px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark">
          Book Appointment
        </Link>
        <Link href="/dashboard/appointments" className="rounded-full border border-espresso/20 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-espresso transition hover:border-rosewood">
          My Appointments
        </Link>
        <Link href="/dashboard/enquiries" className="rounded-full border border-espresso/20 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-espresso transition hover:border-rosewood">
          My Enquiries
        </Link>
        <Link href="/dashboard/profile" className="rounded-full border border-espresso/20 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-espresso transition hover:border-rosewood">
          Profile
        </Link>
      </div>
    </div>
  );
}