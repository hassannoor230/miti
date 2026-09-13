'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

function BookingsInner() {
  const params = useSearchParams();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(params.get('status') || 'all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const q = `?status=${status}&search=${encodeURIComponent(search)}`;
      const res = await api.bookings.list(q);
      setItems(res.data || []);
    } catch (e) {
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (selected) setNotes(selected.adminNotes || '');
  }, [selected]);

  async function updateBooking(id, patch) {
    const res = await api.bookings.update(id, patch);
    setItems((list) => list.map((b) => (b._id === id ? res.data : b)));
    if (selected && selected._id === id) setSelected(res.data);
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">Bookings</h1>
      <p className="text-sm text-espresso-soft">Appointment enquiries from the website.</p>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                status === s ? 'bg-espresso text-cream' : 'bg-white text-espresso hover:bg-shell'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="relative md:ml-auto"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, service…"
            className="w-full rounded-full border border-espresso/10 bg-white py-2.5 pl-10 pr-4 text-sm md:w-72"
          />
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white">
        {loading ? (
          <p className="p-8 text-center text-sm text-espresso-soft">Loading bookings…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-espresso-soft">No bookings found.</p>
        ) : (
          <ul className="divide-y divide-espresso/5">
            {items.map((b) => (
              <li key={b._id}>
                <button
                  onClick={() => setSelected(b)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-shell/60"
                >
                  <span>
                    <span className="font-medium text-espresso">{b.name}</span>
                    <span className="block text-xs text-espresso-soft">
                      {b.service || 'General'} · {b.phone} · {formatDate(b.createdAt)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-dark">
                    {b.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/60 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg rounded-3xl bg-cream p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Booking details"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">{selected.name}</h2>
              <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <p><dt className="inline font-medium">Phone: </dt><dd className="inline">{selected.phone}</dd></p>
              {selected.email && <p><dt className="inline font-medium">Email: </dt><dd className="inline">{selected.email}</dd></p>}
              <p><dt className="inline font-medium">Service: </dt><dd className="inline">{selected.service || '—'}</dd></p>
              <p><dt className="inline font-medium">Preferred: </dt><dd className="inline">{selected.preferredDate || '—'} {selected.preferredTime || ''}</dd></p>
              {selected.message && <p><dt className="inline font-medium">Message: </dt><dd className="inline">{selected.message}</dd></p>}
              <p><dt className="inline font-medium">Received: </dt><dd className="inline">{formatDate(selected.createdAt)}</dd></p>
            </dl>
            <div className="mt-4">
              <label htmlFor="notes" className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Admin notes</label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm"
                placeholder="Private notes (not visible to customer)…"
              />
              <button
                onClick={() => updateBooking(selected._id, { adminNotes: notes })}
                className="mt-2 rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.14em] text-espresso border border-espresso/15"
              >
                Save notes
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['confirmed', 'completed', 'cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateBooking(selected._id, { status: s })}
                  className={`rounded-full px-3 py-2.5 text-[11px] uppercase tracking-[0.12em] transition ${
                    selected.status === s ? 'bg-espresso text-cream' : 'bg-white text-espresso hover:bg-shell'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Loading…</p>}>
      <BookingsInner />
    </Suspense>
  );
}
