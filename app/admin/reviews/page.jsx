'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import Stars from '@/components/Stars';

const EMPTY = { customerName: '', rating: 5, reviewText: '', ownerResponse: '', source: 'Google', reviewDate: '', featured: false, approved: true };

export default function AdminReviewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.reviews.list(true);
      setItems(res.data || []);
    } catch (e) {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(EMPTY);
    setEditing('new');
  }
  function openEdit(r) {
    setForm({ ...EMPTY, ...r });
    setEditing(r);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === 'new') await api.reviews.create(form);
      else await api.reviews.update(editing._id, form);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('Delete this review?')) return;
    try {
      await api.reviews.remove(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggle(id, patch) {
    try {
      await api.reviews.update(id, patch);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  const input = 'mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-espresso">Reviews</h1>
          <p className="text-sm text-espresso-soft">Only use genuine customer reviews — never fabricate testimonials.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-cream hover:bg-rosewood-dark">
          <Plus className="h-4 w-4" /> Add review
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-espresso-soft md:col-span-2">Loading…</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-espresso-soft md:col-span-2">No reviews yet.</p>
        ) : (
          items.map((r) => (
            <article key={r._id} className="rounded-2xl bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-espresso">{r.customerName}</p>
                  <p className="text-xs text-espresso-soft">{r.source} · {r.reviewDate || 'No date'}</p>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-espresso">“{r.reviewText}”</p>
              {r.ownerResponse && (
                <p className="mt-3 rounded-xl bg-shell p-3 text-sm italic text-espresso-soft">{r.ownerResponse}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                <button onClick={() => toggle(r._id, { approved: !r.approved })} className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] ${r.approved !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-shell text-espresso-soft'}`}>
                  {r.approved !== false ? 'Approved' : 'Pending'}
                </button>
                <button onClick={() => toggle(r._id, { featured: !r.featured })} className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] ${r.featured ? 'bg-gold text-espresso' : 'bg-shell text-espresso-soft'}`}>
                  Featured
                </button>
                <button onClick={() => openEdit(r)} aria-label="Edit review" className="rounded-full bg-shell p-2 text-espresso hover:bg-gold/20">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(r._id)} aria-label="Delete review" className="rounded-full bg-shell p-2 text-rosewood-dark hover:bg-rosewood/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-espresso/60 p-4 sm:items-center" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-cream p-7">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">{editing === 'new' ? 'Add review' : 'Edit review'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Customer name *</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={input} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={input}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} stars</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Review text *</label>
              <textarea required rows={4} value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} className={input} />
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Owner response</label>
              <textarea rows={2} value={form.ownerResponse} onChange={(e) => setForm({ ...form, ownerResponse: e.target.value })} className={input} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Source</label>
                <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={input} placeholder="Google / Website" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Review date label</label>
                <input value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} className={input} placeholder="e.g. 2 months ago" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.approved !== false} onChange={(e) => setForm({ ...form, approved: e.target.checked })} /> Approved (visible on site)
              </label>
            </div>
            <button type="submit" disabled={saving} className="mt-5 w-full rounded-full bg-espresso px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-cream disabled:opacity-60">
              {saving ? 'Saving…' : 'Save review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
