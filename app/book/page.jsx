'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';
import { FALLBACK_SERVICES } from '@/lib/fallback-data';
import { useSettings } from '@/lib/settings-context';
import { waLink, telLink } from '@/lib/utils';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';

function BookingForm() {
  const params = useSearchParams();
  const settings = useSettings();
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: params.get('service') || '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const preset = params.get('service');
    if (preset) setForm((f) => ({ ...f, service: preset }));
  }, [params]);

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
      await api.bookings.create(form);
      setState('sent');
    } catch (err) {
      setError(err.message || 'Something went wrong — please try again.');
      setState('error');
    }
  }

  const waMessage = form.service
    ? `Hi Miti Beauty, I'd like to enquire about booking ${form.service}.`
    : settings.whatsappDefaultMessage;

  const input =
    'mt-1.5 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso placeholder:text-espresso/35 focus:border-rosewood';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <div className="flex flex-col gap-4">
        <Reveal>
          <div className="rounded-3xl bg-espresso p-8 text-cream">
            <p className="text-xs uppercase tracking-lux text-gold-light">How booking works</p>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-cream/85">
              <li className="flex gap-3">
                <span className="font-display text-xl text-gold-light">1</span> Send your appointment request with your preferred date &amp; time.
              </li>
              <li className="flex gap-3">
                <span className="font-display text-xl text-gold-light">2</span> We&apos;ll confirm your appointment by phone or message.
              </li>
              <li className="flex gap-3">
                <span className="font-display text-xl text-gold-light">3</span> Relax — we&apos;ll take care of the rest.
              </li>
            </ol>
            <div className="mt-6 space-y-3">
              <a
                href={waLink(settings.whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-espresso transition hover:bg-blush"
              >
                <MessageCircle className="h-4 w-4" /> Book via WhatsApp
              </a>
              <a
                href={telLink(settings.phoneIntl)}
                className="flex items-center justify-center gap-2 rounded-full border border-cream/25 px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-cream transition hover:border-gold-light hover:text-gold-light"
              >
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-gold/30 bg-gold/5 p-6 text-sm text-espresso-soft">
            Prefer to talk? {settings.ownerMessage}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="rounded-3xl bg-white p-8 md:p-10 shadow-card">
          <h2 className="font-display text-3xl text-espresso">Request an appointment</h2>
          <p className="mt-2 text-sm text-espresso-soft">
            This sends an appointment enquiry — we&apos;ll confirm your slot personally.
          </p>
          {state === 'sent' ? (
            <div className="mt-8 rounded-2xl bg-shell p-8 text-center" role="status">
              <CalendarCheck className="mx-auto h-10 w-10 text-rosewood" />
              <p className="mt-3 font-display text-2xl text-espresso">Request received!</p>
              <p className="mt-2 text-espresso-soft">
                Thank you, {form.name.split(' ')[0] || 'beautiful'} — we&apos;ll be in touch shortly to confirm your
                appointment. Need us sooner? Call {settings.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-name" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Full name *
                  </label>
                  <input id="b-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Your full name" maxLength={100} />
                </div>
                <div>
                  <label htmlFor="b-phone" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Phone *
                  </label>
                  <input id="b-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="07..." maxLength={30} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-email" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Email
                  </label>
                  <input id="b-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="you@example.com" maxLength={120} />
                </div>
                <div>
                  <label htmlFor="b-service" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Service
                  </label>
                  <select id="b-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={input}>
                    <option value="">Select a treatment…</option>
                    {services.map((s) => (
                      <option key={s._id || s.slug} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-date" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Preferred date
                  </label>
                  <input id="b-date" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className={input} />
                </div>
                <div>
                  <label htmlFor="b-time" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                    Preferred time
                  </label>
                  <input id="b-time" type="time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} className={input} />
                </div>
              </div>
              <div>
                <label htmlFor="b-message" className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                  Message
                </label>
                <textarea id="b-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} placeholder="Anything we should know? (optional)" maxLength={1000} />
              </div>
              {state === 'error' && (
                <p className="text-sm text-rosewood-dark" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={state === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rosewood to-rosewood-dark px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-white shadow-card transition hover:opacity-95 disabled:opacity-60"
              >
                <CalendarCheck className="h-4 w-4" /> {state === 'sending' ? 'Sending…' : 'Request Appointment'}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title={
          <>
            Book an <span className="italic text-rosewood">Appointment</span>
          </>
        }
        description="Request your preferred treatment, date and time — we'll confirm your appointment personally."
      />
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-18">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-shell" />}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  );
}
