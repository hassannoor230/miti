'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rescheduled: 'bg-blue-50 text-blue-700 ring-blue-200',
  completed: 'bg-shell text-espresso ring-espresso/15',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ requestedDate: '', requestedTime: '', reason: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.customer.appointments.list();
        if (mounted) setAppointments(res.data || []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load appointments.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleCancel() {
    if (!cancelTarget) return;
    setActionLoading(true);
    setActionError('');
    try {
      await api.customer.appointments.cancel(cancelTarget, cancelReason);
      setAppointments((prev) => prev.map((a) => (a._id === cancelTarget || a.id === cancelTarget ? { ...a, status: 'cancelled' } : a)));
      setCancelTarget(null);
      setCancelReason('');
    } catch (e) {
      setActionError(e.message || 'Failed to cancel appointment.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleTarget) return;
    setActionLoading(true);
    setActionError('');
    try {
      await api.customer.appointments.rescheduleRequest(rescheduleTarget, rescheduleForm);
      setAppointments((prev) => prev.map((a) => (a._id === rescheduleTarget || a.id === rescheduleTarget ? { ...a, status: 'rescheduled' } : a)));
      setRescheduleTarget(null);
      setRescheduleForm({ requestedDate: '', requestedTime: '', reason: '' });
    } catch (e) {
      setActionError(e.message || 'Failed to request reschedule.');
    } finally {
      setActionLoading(false);
    }
  }

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <PageHero eyebrow="My Appointments" title="Your Bookings" description="View, manage, and reschedule your beauty appointments." />
      <div className="mx-auto max-w-6xl px-6 md:px-8 pb-20">
        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-white shadow-card" />)}
          </div>
        )}
        {!loading && error && (
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-card text-center">
            <p className="text-rosewood-dark" role="alert">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-rosewood hover:underline">Try again</button>
          </div>
        )}
        {!loading && !error && appointments.length === 0 && (
          <Reveal className="mt-10 text-center">
            <div className="rounded-3xl bg-white p-12 shadow-card">
              <p className="font-display text-2xl text-espresso">No appointments yet</p>
              <p className="mt-2 text-espresso-soft">Book your first appointment to get started.</p>
              <Link href="/book" className="mt-6 inline-block rounded-full bg-espresso px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark">Book Now</Link>
            </div>
          </Reveal>
        )}
        {!loading && !error && appointments.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {appointments.map((apt, idx) => (
              <Reveal key={apt._id || apt.id || idx} delay={idx * 0.08}>
                <div className="rounded-3xl bg-white p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl text-espresso">{apt.service || 'Unknown service'}</p>
                      <p className="mt-1 text-sm text-espresso-soft">{formatDate(apt.date)} at {apt.time || '—'}</p>
                      <p className="mt-0.5 text-xs text-espresso-soft/70">Created {formatDate(apt.created)}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  {apt.appointmentHistory && apt.appointmentHistory.length > 0 && (
                    <div className="mt-4 border-t border-espresso/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-rosewood">Rescheduled</p>
                      <div className="mt-2 space-y-1.5">
                        {apt.appointmentHistory.map((h, hi) => (
                          <div key={hi} className="text-sm text-espresso-soft">
                            <span className="line-through">{formatDate(h.oldDate)} at {h.oldTime}</span>
                            <span className="mx-2">→</span>
                            <span className="font-medium text-espresso">{formatDate(h.newDate)} at {h.newTime}</span>
                            {h.reason && <span className="block text-xs italic mt-0.5">Reason: {h.reason}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {apt.status !== 'cancelled' && apt.status !== 'completed' && apt.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => { setCancelTarget(apt._id || apt.id); setCancelReason(''); setActionError(''); }}
                          className="rounded-full border border-rose-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-rose-700 transition hover:bg-rose-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { setRescheduleTarget(apt._id || apt.id); setRescheduleForm({ requestedDate: '', requestedTime: '', reason: '' }); setActionError(''); }}
                          className="rounded-full border border-espresso/20 px-4 py-2 text-xs uppercase tracking-[0.15em] text-espresso transition hover:border-rosewood"
                        >
                          Request Reschedule
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 px-6" onClick={() => setCancelTarget(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-espresso">Cancel Appointment</h3>
            {actionError && <p className="mt-2 text-sm text-rosewood-dark" role="alert">{actionError}</p>}
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation"
              rows={3}
              className="mt-4 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm text-espresso focus:border-rosewood"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setCancelTarget(null)} className="rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-espresso-soft transition hover:text-espresso">Keep</button>
              <button onClick={handleCancel} disabled={actionLoading} className="rounded-full bg-rosewood px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60">{actionLoading ? 'Cancelling…' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 px-6" onClick={() => setRescheduleTarget(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-espresso">Request Reschedule</h3>
            {actionError && <p className="mt-2 text-sm text-rosewood-dark" role="alert">{actionError}</p>}
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">New Date</label>
                <input type="date" value={rescheduleForm.requestedDate} onChange={(e) => setRescheduleForm({ ...rescheduleForm, requestedDate: e.target.value })} className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-3 text-sm text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">New Time</label>
                <input type="time" value={rescheduleForm.requestedTime} onChange={(e) => setRescheduleForm({ ...rescheduleForm, requestedTime: e.target.value })} className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-3 text-sm text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Reason</label>
                <textarea value={rescheduleForm.reason} onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })} rows={3} placeholder="Why are you rescheduling?" className="mt-1 w-full rounded-xl border border-espresso/15 px-4 py-3 text-sm text-espresso focus:border-rosewood" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setRescheduleTarget(null)} className="rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-espresso-soft transition hover:text-espresso">Cancel</button>
              <button onClick={handleReschedule} disabled={actionLoading} className="rounded-full bg-espresso px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60">{actionLoading ? 'Sending…' : 'Send Request'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
