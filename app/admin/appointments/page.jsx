'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, X, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'rejected'];
const STATUS_OPTIONS = ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'rejected'];

function statusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-gold/15 text-gold-dark';
    case 'confirmed': return 'bg-emerald-50 text-emerald-700';
    case 'rescheduled': return 'bg-blue-50 text-blue-700';
    case 'completed': return 'bg-emerald-50 text-emerald-700';
    case 'cancelled': return 'bg-red-50 text-red-700';
    case 'rejected': return 'bg-red-50 text-red-700';
    default: return 'bg-shell text-espresso-soft';
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [histories, setHistories] = useState({});
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.admin.appointments();
        if (mounted) {
          const list = res.data || res || [];
          setAppointments(list);
          const initial = {};
          list.forEach((a) => {
            if (a.history && Array.isArray(a.history)) initial[a._id] = a.history;
          });
          setHistories(initial);
        }
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchesFilter = filter === 'all' || a.status === filter;
      if (!matchesFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (a.name || '').toLowerCase().includes(q) ||
        (a.phone || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.service || '').toLowerCase().includes(q)
      );
    });
  }, [appointments, filter, search]);

  async function handleStatusChange(id, status) {
    try {
      const res = await api.admin.updateAppointment(id, { status, adminNotes: '' });
      setAppointments((list) => list.map((a) => (a._id === id ? res.data : a)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleRescheduleSubmit(e) {
    e.preventDefault();
    const { id, newDate, newTime, reason } = rescheduleModal;
    const oldAppt = appointments.find((a) => a._id === id);
    try {
      const res = await api.admin.updateAppointment(id, {
        status: 'rescheduled',
        newDate,
        newTime,
        rescheduleReason: reason,
      });
      setAppointments((list) => list.map((a) => (a._id === id ? res.data : a)));
      setHistories((h) => {
        const existing = h[id] || [];
        const entry = {
          oldDate: oldAppt?.date || '',
          oldTime: oldAppt?.time || '',
          newDate: newDate,
          newTime: newTime,
          reason: reason,
        };
        return { ...h, [id]: [entry, ...existing] };
      });
      setRescheduleModal(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleCancelSubmit(e) {
    e.preventDefault();
    const { id, reason } = cancelModal;
    try {
      const res = await api.admin.updateAppointment(id, { status: 'cancelled', cancellationReason: reason });
      setAppointments((list) => list.map((a) => (a._id === id ? res.data : a)));
      setCancelModal(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleMarkCompleted(id) {
    try {
      const res = await api.admin.updateAppointment(id, { status: 'completed' });
      setAppointments((list) => list.map((a) => (a._id === id ? res.data : a)));
    } catch (e) {
      alert(e.message);
    }
  }

  function toggleExpand(id) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function historyFor(id) {
    const apiHistory = (appointments.find((a) => a._id === id)?.history) || [];
    const localHistory = histories[id] || [];
    return [...localHistory, ...apiHistory];
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-espresso">Appointments</h1>
        <p className="text-sm text-espresso-soft">Manage salon appointments and booking status.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                filter === s ? 'bg-espresso text-cream' : 'bg-white text-espresso hover:bg-shell'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, service…"
            className="w-full rounded-full border border-espresso/10 bg-white py-2.5 pl-10 pr-4 text-sm md:w-72"
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-shell" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="font-display text-lg text-espresso">Failed to load appointments</p>
            <p className="mt-1 text-sm text-espresso-soft">{error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); }}
              className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream transition hover:bg-rosewood-dark"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-espresso-soft">
            No appointments match your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-espresso/10 text-sm">
              <thead className="bg-shell">
                <tr>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Customer</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Service</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Date</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Time</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Created</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-[0.14em] text-espresso-soft">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {filtered.map((a) => {
                  const history = historyFor(a._id);
                  const expanded = expandedRows.has(a._id);
                  return (
                    <Fragment key={a._id}>
                      <tr className="hover:bg-shell/50">
                        <td className="px-5 py-4">
                          <span className="font-medium text-espresso">{a.name}</span>
                          <span className="block text-xs text-espresso-soft">{a.email}</span>
                          <span className="block text-xs text-espresso-soft">{a.phone}</span>
                        </td>
                        <td className="px-5 py-4 text-espresso">{a.service || '—'}</td>
                        <td className="px-5 py-4 text-espresso">{a.date || '—'}</td>
                        <td className="px-5 py-4 text-espresso">{a.time || '—'}</td>
                        <td className="px-5 py-4">
                          <select
                            value={a.status}
                            onChange={(e) => handleStatusChange(a._id, e.target.value)}
                            className={`cursor-pointer rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] outline-none ring-1 ring-transparent focus:ring-rosewood/30 ${statusBadgeClass(a.status)}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-xs text-espresso-soft">{formatDate(a.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            <button
                              onClick={() => setRescheduleModal({ id: a._id, newDate: '', newTime: '', reason: '' })}
                              className="rounded-full bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-rosewood border border-rosewood/30 transition hover:bg-rosewood/5"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => setCancelModal({ id: a._id, reason: '' })}
                              className="rounded-full bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-red-600 border border-red-200 transition hover:bg-red-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleMarkCompleted(a._id)}
                              disabled={a.status === 'completed'}
                              className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40"
                            >
                              Completed
                            </button>
                            {history.length > 0 && (
                              <button
                                onClick={() => toggleExpand(a._id)}
                                className="rounded-full bg-shell px-2.5 py-1.5 text-espresso transition hover:bg-shell"
                                aria-label={expanded ? 'Collapse history' : 'Expand history'}
                              >
                                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expanded && history.length > 0 && (
                        <tr>
                          <td colSpan={7} className="px-5 py-4 bg-shell/30">
                            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-espresso-soft">Reschedule history</p>
                            <div className="space-y-2">
                              {history.map((h, i) => (
                                <div key={i} className="rounded-xl bg-white p-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-espresso">
                                      <span className="text-xs text-espresso-soft">{h.oldDate}{h.oldTime ? ` ${h.oldTime}` : ''}</span>
                                      {' → '}
                                      <span className="font-medium">{h.newDate}{h.newTime ? ` ${h.newTime}` : ''}</span>
                                    </span>
                                  </div>
                                  {h.reason && (
                                    <p className="mt-1 text-xs text-espresso-soft">{h.reason}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 p-4" onClick={() => setRescheduleModal(null)}>
          <div
            className="w-full max-w-md rounded-3xl bg-cream p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Reschedule appointment"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">Reschedule Appointment</h2>
              <button onClick={() => setRescheduleModal(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="reschedule-date" className="text-xs uppercase tracking-[0.14em] text-espresso-soft">New date</label>
                <input
                  id="reschedule-date"
                  type="date"
                  required
                  value={rescheduleModal.newDate}
                  onChange={(e) => setRescheduleModal((m) => ({ ...m, newDate: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso"
                />
              </div>
              <div>
                <label htmlFor="reschedule-time" className="text-xs uppercase tracking-[0.14em] text-espresso-soft">New time</label>
                <input
                  id="reschedule-time"
                  type="time"
                  required
                  value={rescheduleModal.newTime}
                  onChange={(e) => setRescheduleModal((m) => ({ ...m, newTime: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso"
                />
              </div>
              <div>
                <label htmlFor="reschedule-reason" className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Reason</label>
                <textarea
                  id="reschedule-reason"
                  rows={3}
                  required
                  value={rescheduleModal.reason}
                  onChange={(e) => setRescheduleModal((m) => ({ ...m, reason: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso"
                  placeholder="Why is this being rescheduled?"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-espresso px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  className="flex-1 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.18em] text-espresso border border-espresso/15 transition hover:bg-shell"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 p-4" onClick={() => setCancelModal(null)}>
          <div
            className="w-full max-w-md rounded-3xl bg-cream p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Cancel appointment"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">Cancel Appointment</h2>
              <button onClick={() => setCancelModal(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCancelSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="cancel-reason" className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Cancellation reason</label>
                <textarea
                  id="cancel-reason"
                  rows={3}
                  required
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal((m) => ({ ...m, reason: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso"
                  placeholder="Reason for cancellation…"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-red-600 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-red-700"
                >
                  Cancel Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setCancelModal(null)}
                  className="flex-1 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.18em] text-espresso border border-espresso/15 transition hover:bg-shell"
                >
                  Keep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
