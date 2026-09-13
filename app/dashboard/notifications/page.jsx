'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';

const NOTIF_COLORS = {
  appointment: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  enquiry: 'bg-rose-50 text-rose-700 ring-rose-200',
  promotion: 'bg-gold/20 text-gold-dark ring-gold/30',
  general: 'bg-shell text-espresso ring-espresso/15',
};

const NOTIF_LABELS = {
  appointment: 'Appointment',
  enquiry: 'Enquiry',
  promotion: 'Offer',
  general: 'General',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.customer.notifications.list();
        if (mounted) setNotifications(res.data || []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load notifications.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function markRead(id) {
    try {
      await api.customer.notifications.read(id);
      setNotifications((prev) => prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n)));
    } catch { /* silent */ }
  }

  async function markAllRead() {
    try {
      await api.customer.notifications.readAll();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* silent */ }
  }

  async function toggleRead(n) {
    if (n.read) {
      // Already read, nothing to do
    } else {
      await markRead(n._id || n.id);
    }
  }

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHero eyebrow="Notifications" title="Your Alerts" description="Stay updated on your appointments, enquiries, and offers." />
      <div className="mx-auto max-w-3xl px-6 md:px-8 pb-20">
        {loading && (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-3xl bg-white shadow-card" />)}
          </div>
        )}
        {!loading && error && (
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-card text-center">
            <p className="text-rosewood-dark" role="alert">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-rosewood hover:underline">Try again</button>
          </div>
        )}
        {!loading && !error && notifications.length === 0 && (
          <Reveal className="mt-10 text-center">
            <div className="rounded-3xl bg-white p-12 shadow-card">
              <p className="font-display text-2xl text-espresso">No notifications</p>
              <p className="mt-2 text-espresso-soft">You're all caught up.</p>
            </div>
          </Reveal>
        )}
        {!loading && !error && notifications.length > 0 && (
          <>
            <div className="mt-10 flex items-center justify-between">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.18em] text-espresso-soft">{unreadCount} unread</p>
              </Reveal>
              {unreadCount > 0 && (
                <Reveal delay={0.05}>
                  <button onClick={markAllRead} className="text-sm font-medium text-rosewood hover:underline">Mark all as read</button>
                </Reveal>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {notifications.map((n, idx) => (
                <Reveal key={n._id || n.id || idx} delay={idx * 0.06}>
                  <button
                    onClick={() => toggleRead(n)}
                    className={`w-full text-left rounded-3xl p-5 shadow-card transition ${n.read ? 'bg-white' : 'bg-white ring-1 ring-espresso/10'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-rosewood'}`} aria-hidden />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-display text-lg text-espresso">{n.title || 'Notification'}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ring-1 ${NOTIF_COLORS[n.type] || NOTIF_COLORS.general}`}>
                            {NOTIF_LABELS[n.type] || n.type || 'General'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-espresso-soft">{n.message || ''}</p>
                        <p className="mt-2 text-xs text-espresso-soft/60">{formatDate(n.date || n.created || n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
