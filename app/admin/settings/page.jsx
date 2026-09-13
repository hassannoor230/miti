'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FALLBACK_SETTINGS } from '@/lib/fallback-data';

export default function AdminSettingsPage() {
  const [form, setForm] = useState(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [smtp, setSmtp] = useState(null);

  useEffect(() => {
    api.settings
      .get()
      .then((res) => {
        if (res?.data) setForm({ ...FALLBACK_SETTINGS, ...res.data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
    api.settings.smtp().then((res) => setSmtp(res?.data || null)).catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const res = await api.settings.update(form);
      if (res?.data) setForm({ ...FALLBACK_SETTINGS, ...res.data });
      setNotice('Settings saved successfully.');
    } catch (err) {
      setNotice(err.message || 'Failed to save settings.');
    }
    setSaving(false);
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setHours(i, value) {
    setForm((f) => ({
      ...f,
      openingHours: f.openingHours.map((h, idx) => (idx === i ? { ...h, hours: value } : h)),
    }));
  }

  const input = 'mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso';
  const label = 'text-xs uppercase tracking-[0.14em] text-espresso-soft';

  if (loading) return <p className="rounded-2xl bg-white p-8 text-center text-sm text-espresso-soft">Loading settings…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">Business Settings</h1>
      <p className="text-sm text-espresso-soft">Everything here updates the live website instantly — phone, address, hours, headlines and more.</p>

      <form onSubmit={save} className="mt-5 space-y-5">
        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Business details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><label className={label}>Business name</label><input value={form.businessName} onChange={(e) => set('businessName', e.target.value)} className={input} /></div>
            <div><label className={label}>Category</label><input value={form.category} onChange={(e) => set('category', e.target.value)} className={input} /></div>
            <div><label className={label}>Phone (display)</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={input} /></div>
            <div><label className={label}>Phone (international, for links)</label><input value={form.phoneIntl} onChange={(e) => set('phoneIntl', e.target.value)} className={input} placeholder="+447478558408" /></div>
            <div><label className={label}>WhatsApp number (digits only)</label><input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={input} placeholder="447478558408" /></div>
            <div><label className={label}>Email (leave blank if none)</label><input value={form.email || ''} onChange={(e) => set('email', e.target.value)} className={input} /></div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Address & links</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><label className={label}>Street</label><input value={form.addressStreet} onChange={(e) => set('addressStreet', e.target.value)} className={input} /></div>
            <div><label className={label}>Area</label><input value={form.addressArea} onChange={(e) => set('addressArea', e.target.value)} className={input} /></div>
            <div><label className={label}>City</label><input value={form.addressCity} onChange={(e) => set('addressCity', e.target.value)} className={input} /></div>
            <div><label className={label}>Postcode</label><input value={form.postcode} onChange={(e) => set('postcode', e.target.value)} className={input} /></div>
            <div><label className={label}>Country</label><input value={form.country} onChange={(e) => set('country', e.target.value)} className={input} /></div>
            <div><label className={label}>Full address</label><input value={form.fullAddress} onChange={(e) => set('fullAddress', e.target.value)} className={input} /></div>
            <div><label className={label}>Plus code</label><input value={form.plusCode} onChange={(e) => set('plusCode', e.target.value)} className={input} /></div>
            <div><label className={label}>Google Maps URL</label><input value={form.googleMapsUrl} onChange={(e) => set('googleMapsUrl', e.target.value)} className={input} /></div>
            <div><label className={label}>Instagram username</label><input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} className={input} /></div>
            <div><label className={label}>Instagram URL</label><input value={form.instagramUrl} onChange={(e) => set('instagramUrl', e.target.value)} className={input} /></div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Reputation & status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div><label className={label}>Google rating</label><input type="number" step="0.1" min="0" max="5" value={form.googleRating} onChange={(e) => set('googleRating', Number(e.target.value))} className={input} /></div>
            <div><label className={label}>Google review count</label><input type="number" min="0" value={form.googleReviewCount} onChange={(e) => set('googleReviewCount', Number(e.target.value))} className={input} /></div>
            <div><label className={label}>Status note</label><input value={form.statusNote} onChange={(e) => set('statusNote', e.target.value)} className={input} placeholder="e.g. Open now" /></div>
          </div>
          <div className="mt-3">
            <label className={label}>Owner message</label>
            <textarea rows={2} value={form.ownerMessage} onChange={(e) => set('ownerMessage', e.target.value)} className={input} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Opening hours</h2>
          <p className="text-xs text-espresso-soft">Only enter hours you are sure about — otherwise use &ldquo;Available on enquiry&rdquo;.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(form.openingHours || []).map((h, i) => (
              <div key={h.day} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-medium text-espresso">{h.day}</span>
                <input value={h.hours} onChange={(e) => setHours(i, e.target.value)} className={input} placeholder="9:30 AM – 6:00 PM" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Homepage content</h2>
          <div className="mt-4 grid gap-3">
            <div><label className={label}>Hero title</label><input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} className={input} /></div>
            <div><label className={label}>Hero description</label><textarea rows={2} value={form.heroDescription} onChange={(e) => set('heroDescription', e.target.value)} className={input} /></div>
            <div><label className={label}>About title</label><input value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} className={input} /></div>
            <div><label className={label}>About description</label><textarea rows={3} value={form.aboutDescription} onChange={(e) => set('aboutDescription', e.target.value)} className={input} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={label}>Booking CTA label</label><input value={form.bookingCTA} onChange={(e) => set('bookingCTA', e.target.value)} className={input} /></div>
              <div><label className={label}>WhatsApp default message</label><input value={form.whatsappDefaultMessage} onChange={(e) => set('whatsappDefaultMessage', e.target.value)} className={input} /></div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Email (SMTP) notifications</h2>
          <p className="mt-1 text-sm text-espresso-soft">
            Booking requests and enquiries trigger emails. Configure SMTP on the server (the <code className="text-xs">backend/.env</code> file) — this panel only shows the current status; secrets are never exposed.
          </p>
          {smtp ? (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {smtp.configured ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Configured</span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">Not configured</span>
                )}
                <span className="text-espresso-soft">
                  {smtp.host || '(no host)'}:{smtp.port} {smtp.secure ? '(TLS)' : ''}
                </span>
              </div>
              <p className="text-espresso-soft">
                Sender: <span className="text-espresso">{smtp.from || '—'}</span> · Owner inbox: <span className="text-espresso">{smtp.ownerEmail || '—'}</span>
              </p>
              <p className="text-xs text-espresso-soft">
                Set <code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code> (and optionally <code>SMTP_SECURE=true</code> for port 465) in <code>backend/.env</code>, then restart the backend. Leave <code>SMTP_HOST</code> blank to disable email sending — submissions are still stored.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-espresso-soft">Loading SMTP status…</p>
          )}
        </section>

        {notice && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-espresso" role="status">{notice}</p>
        )}

        <button type="submit" disabled={saving} className="w-full rounded-full bg-espresso px-6 py-4 text-xs uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60">
          {saving ? 'Saving…' : 'Save all settings'}
        </button>
      </form>
    </div>
  );
}
