'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { GALLERY_CATEGORIES } from '@/lib/fallback-data';

const EMPTY = { title: '', description: '', category: 'Salon', altText: '', featured: false, sortOrder: 0 };

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.gallery.list();
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
    setImageUrl('');
    setEditing('new');
  }
  function openEdit(g) {
    setForm({ ...EMPTY, ...g });
    setImageFile(null);
    setImageUrl('');
    setEditing(g);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (imageFile) fd.append('image', imageFile);
      else if (imageUrl) fd.append('image', imageUrl);
      if (editing === 'new') await api.upload('/gallery', fd, 'POST');
      else await api.upload(`/gallery/${editing._id}`, fd, 'PUT');
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('Delete this image?')) return;
    try {
      await api.gallery.remove(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleFeatured(g) {
    try {
      await api.gallery.update(g._id, { featured: !g.featured });
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
          <h1 className="font-display text-3xl text-espresso">Gallery</h1>
          <p className="text-sm text-espresso-soft">Upload real salon photos only — featured images appear on the homepage.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-cream hover:bg-rosewood-dark">
          <Plus className="h-4 w-4" /> Upload image
        </button>
      </div>

      {loading ? (
        <p className="mt-5 rounded-2xl bg-white p-8 text-center text-sm text-espresso-soft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-white p-8 text-center text-sm text-espresso-soft">
          No images yet — upload your first salon photo to fill the gallery.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g._id} className="group relative overflow-hidden rounded-2xl bg-white">
              <Image src={g.image} alt={g.altText || g.title || 'Gallery image'} width={500} height={600} className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent p-4 pt-10">
                <p className="text-sm font-medium text-cream">{g.title || g.category}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-cream/70">{g.category}{g.featured ? ' · Featured' : ''}</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => toggleFeatured(g)} title="Toggle featured" className={`rounded-full px-3 py-1.5 text-[11px] uppercase ${g.featured ? 'bg-gold text-espresso' : 'bg-white/90 text-espresso'}`}>
                  ★
                </button>
                <button onClick={() => openEdit(g)} aria-label="Edit image" className="rounded-full bg-white/90 p-2 text-espresso">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(g._id)} aria-label="Delete image" className="rounded-full bg-white/90 p-2 text-rosewood-dark">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-espresso/60 p-4 sm:items-center" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-cream p-7">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl text-espresso">{editing === 'new' ? 'Upload image' : 'Edit image'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-full bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            {editing !== 'new' && editing.image && (
              <Image src={editing.image} alt="Current" width={400} height={300} className="mt-4 h-40 w-full rounded-xl object-cover" />
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Upload file</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1.5 w-full text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">…or image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={input} placeholder="https://…" />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
                  {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Alt text (for SEO & accessibility)</label>
              <input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} className={input} placeholder="Describe the photo…" />
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on homepage
              </label>
              <label className="flex items-center gap-2">
                Order
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-20 rounded-lg border border-espresso/15 bg-white px-2 py-1.5 text-sm" />
              </label>
            </div>
            <button type="submit" disabled={saving} className="mt-5 w-full rounded-full bg-espresso px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-cream disabled:opacity-60">
              {saving ? 'Saving…' : 'Save image'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
