'use client';

import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const STATUSES = ['unread', 'read', 'replied', 'archived'];

export default function AdminMessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.contact.list();
      setItems(res.data || []);
    } catch (e) {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id, patch) {
    try {
      const res = await api.contact.update(id, patch);
      setItems((list) => list.map((m) => (m._id === id ? res.data : m)));
      if (selected && selected._id === id) setSelected(res.data);
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return;
    try {
      await api.contact.remove(id);
      setSelected(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">Messages</h1>
      <p className="text-sm text-espresso-soft">Contact-form enquiries from the website.</p>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white">
        {loading ? (
          <p className="p-8 text-center text-sm text-espresso-soft">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-espresso-soft">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-espresso/5">
            {items.map((m) => (
              <li key={m._id}>
                <button
                  onClick={() => {
                    setSelected(m);
                    if (m.status === 'unread') update(m._id, { status: 'read' });
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-shell/60 ${m.status === 'unread' ? 'bg-gold/5' : ''}`}
                >
                  <span className="min-w-0">
                    <span className={`text-sm ${m.status === 'unread' ? 'font-semibold text-espresso' : 'text-espresso'}`}>
                      {m.name}
                      <span className="ml-2 font-normal text-xs text-espresso-soft">{m.email}</span>
                    </span>
                    <span className="block truncate text-xs text-espresso-soft">{m.message}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-espresso-soft">{formatDate(m.createdAt)}</span>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-dark">
                      {m.status}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/60 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-cream p-7" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Message details">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">{selected.name}</h2>
              <button onClick={() => setSelected(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">Email: </span><a href={`mailto:${selected.email}`} className="text-rosewood hover:underline">{selected.email}</a></p>
              {selected.phone && <p><span className="font-medium">Phone: </span>{selected.phone}</p>}
              {selected.service && <p><span className="font-medium">Service: </span>{selected.service}</p>}
              <p><span className="font-medium">Received: </span>{formatDate(selected.createdAt)}</p>
              <div className="rounded-xl bg-white p-4">
                <p className="whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => update(selected._id, { status: s })}
                  className={`rounded-full px-2 py-2.5 text-[11px] uppercase tracking-[0.1em] ${selected.status === s ? 'bg-espresso text-cream' : 'bg-white text-espresso'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => remove(selected._id)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-rosewood/30 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-rosewood-dark">
              <Trash2 className="h-4 w-4" /> Delete message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
