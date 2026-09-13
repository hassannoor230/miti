'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';
import { FALLBACK_SERVICES } from '@/lib/fallback-data';
import { useSettings } from '@/lib/settings-context';
import { waLink, telLink } from '@/lib/utils';
import { Phone, MessageCircle, Instagram, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const settings = useSettings();
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    api.services
      .list()
      .then((res) => {
        if (res?.data?.length) setServices(res.data);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      await api.contact.create(form);
      setState('sent');
    } catch (err) {
      setError(err.message || 'Something went wrong — please try again.');
      setState('error');
    }
  }

  const input =
    'mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso placeholder:text-espresso/35 focus:border-rosewood';

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Contact <span className="italic text-rosewood">Miti Beauty</span>
          </>
        }
        description="Call or WhatsApp to enquire — or send us a message and we'll get back to you."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-18">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Info cards */}
          <div className="flex flex-col gap-4">
            <Reveal>
              <div className="rounded-3xl bg-espresso p-7 text-cream">
                <p className="text-xs uppercase tracking-lux text-gold-light">Owner&apos;s message</p>
                <p className="mt-3 font-display text-xl italic leading-relaxed">“{settings.ownerMessage}”</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={telLink(settings.phoneIntl)}
                    className="flex items-center justify-center gap-2 rounded-full bg-cream px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-espresso transition hover:bg-blush"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <a
                    href={waLink(settings.whatsapp, settings.whatsappDefaultMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full border border-cream/30 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-cream transition hover:border-gold-light hover:text-gold-light"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-3xl bg-white p-7 shadow-card">
                <p className="flex items-center gap-2 text-xs uppercase tracking-lux text-gold-dark">
                  <MapPin className="h-4 w-4" /> Visit the salon
                </p>
                <address className="mt-3 not-italic leading-relaxed text-espresso">
                  {settings.businessName}
                  <br />
                  {settings.fullAddress}
                </address>
                <p className="mt-2 text-sm text-espresso-soft">Plus code: {settings.plusCode}</p>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-rosewood underline-offset-4 hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-card">
                  <Phone className="h-5 w-5 text-rosewood" />
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-espresso-soft">Phone</p>
                  <a href={telLink(settings.phoneIntl)} className="font-medium text-espresso hover:text-rosewood">
                    {settings.phone}
                  </a>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-card">
                  <Instagram className="h-5 w-5 text-rosewood" />
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-espresso-soft">Instagram</p>
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-espresso hover:text-rosewood">
                    @{settings.instagram}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rounded-3xl bg-shell p-6">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-espresso-soft">
                  <Clock className="h-4 w-4" /> Opening hours
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {(settings.openingHours || []).map((h) => (
                    <li key={h.day} className="flex justify-between border-b border-espresso/10 pb-1.5 last:border-0">
                      <span>{h.day}</span>
                      <span className="font-medium">{h.hours || 'Available on enquiry'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-white p-8 md:p-10 shadow-card">
              <h2 className="font-display text-3xl text-espresso">Send an enquiry</h2>
              <p className="mt-2 text-sm text-espresso-soft">
                We&apos;ll get back to you as soon as we can — usually the same day.
              </p>
              {state === 'sent' ? (
                <div className="mt-8 rounded-2xl bg-shell p-8 text-center" role="status">
                  <p className="font-display text-2xl text-espresso">Thank you!</p>
                  <p className="mt-2 text-espresso-soft">
                    Your enquiry has been received. For anything urgent, call {settings.phone} or message us on WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                        Name *
                      </label>
                      <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Your full name" maxLength={100} />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                        Phone
                      </label>
                      <input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="07..." maxLength={30} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-email" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                        Email *
                      </label>
                      <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="you@example.com" maxLength={120} />
                    </div>
                    <div>
                      <label htmlFor="c-service" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                        Service
                      </label>
                      <select id="c-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={input}>
                        <option value="">General enquiry</option>
                        {services.map((s) => (
                          <option key={s._id || s.slug} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                      Message *
                    </label>
                    <textarea id="c-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} placeholder="How can we help?" maxLength={2000} />
                  </div>
                  {state === 'error' && (
                    <p className="text-sm text-rosewood-dark" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" /> {state === 'sending' ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <div className="relative h-80 overflow-hidden rounded-3xl shadow-soft">
            <iframe
              title={`Map — ${settings.fullAddress}`}
              src="https://www.google.com/maps?q=427%20Gloucester%20Rd%2C%20Horfield%2C%20Bristol%20BS7%208TZ%2C%20United%20Kingdom&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
