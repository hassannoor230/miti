'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

const EMPTY = { name: '', slug: '', description: '', longDescription: '', price: '', duration: '', category: '', featured: false, active: true, sortOrder: 0 };

export default function AdminServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | service object
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.services.list(true);
      setItems(res.data || []);
    } catch (e) {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(EMPTY);
    setImageFile(null);
    setEditing('new');
  }

  function openEdit(s) {
    setForm({ ...EMPTY, ...s });
    setImageFile(null);
    setEditing(s);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
        fd.append('image', imageFile);
        if (editing === 'new') await api.upload('/services', fd, 'POST');
        else await api.upload(`/services/${editing._id}`, fd, 'PUT');
      } else if (editing === 'new') {
        await api.services.create(form);
      } else {
        await api.services.update(editing._id, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('Delete this service?')) return;
    try {
      await api.services.remove(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggle(id, patch) {
    try {
      await api.services.update(id, patch);
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
          <h1 className="font-display text-3xl text-espresso">Services</h1>
          <p className="text-sm text-espresso-soft">Treatments shown on the website. Leave price blank for &ldquo;Price available on enquiry&rdquo;.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-cream hover:bg-rosewood-dark">
          <Plus className="h-4 w-4" /> Add service
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white">
        {loading ? (
          <p className="p-8 text-center text-sm text-espresso-soft">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-espresso-soft">No services yet.</p>
        ) : (
          <ul className="divide-y divide-espresso/5">
            {items.map((s) => (
              <li key={s._id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-espresso">{s.name}</span>
                  <span className="block truncate text-xs text-espresso-soft">/{s.slug} · {s.category || 'Uncategorized'} · {s.price || 'Price on enquiry'}</span>
                </span>
                <span className="flex gap-1.5">
                  <button onClick={() => toggle(s._id, { featured: !s.featured })} title="Toggle featured" className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] ${s.featured ? 'bg-gold text-espresso' : 'bg-shell text-espresso-soft'}`}>
                    Featured
                  </button>
                  <button onClick={() => toggle(s._id, { active: !s.active })} title="Toggle active" className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] ${s.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-shell text-espresso-soft'}`}>
                    {s.active !== false ? 'Active' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`} className="rounded-full bg-shell p-2 text-espresso hover:bg-gold/20">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(s._id)} aria-label={`Delete ${s.name}`} className="rounded-full bg-shell p-2 text-rosewood-dark hover:bg-rosewood/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-espresso/60 p-4 sm:items-center" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-cream p-7">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">{editing === 'new' ? 'Add service' : 'Edit service'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} placeholder="auto from name" />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Short description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Long description</label>
              <textarea rows={3} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className={input} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Price</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} placeholder="e.g. from £25" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={input} placeholder="e.g. 45 mins" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={input} />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input} placeholder="Lashes, Nails…" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1.5 w-full text-sm" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active !== false} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
              </label>
            </div>
            <button type="submit" disabled={saving} className="mt-5 w-full rounded-full bg-espresso px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-cream disabled:opacity-60">
              {saving ? 'Saving…' : 'Save service'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
