'use client';

import { MapPin, Phone, Instagram, Clock, Navigation } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { useSettings } from '@/lib/settings-context';
import { telLink } from '@/lib/utils';

export default function ContactLocation() {
  const settings = useSettings();
  return (
    <section className="bg-shell py-20 md:py-28" aria-label="Find us">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeading
          eyebrow="Find us"
          title="Visit Us in Horfield, Bristol"
          description="You'll find us on Gloucester Road — pop in, call or message us on WhatsApp."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-7 shadow-card">
              <p className="flex items-center gap-2 text-xs uppercase tracking-lux text-gold-dark">
                <MapPin className="h-4 w-4" /> Address
              </p>
              <address className="mt-3 text-lg not-italic leading-relaxed text-espresso">
                {settings.businessName}
                <br />
                {settings.addressStreet}, {settings.addressArea},
                <br />
                {settings.addressCity} {settings.postcode}
                <br />
                {settings.country}
              </address>
              <p className="mt-2 text-sm text-espresso-soft">Plus code: {settings.plusCode}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={telLink(settings.phoneIntl)}
                className="rounded-3xl bg-white p-6 shadow-card transition hover:shadow-soft"
              >
                <Phone className="h-5 w-5 text-rosewood" />
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-espresso-soft">Call us</p>
                <p className="mt-1 font-medium text-espresso">{settings.phone}</p>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl bg-white p-6 shadow-card transition hover:shadow-soft"
              >
                <Instagram className="h-5 w-5 text-rosewood" />
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-espresso-soft">Instagram</p>
                <p className="mt-1 font-medium text-espresso">@{settings.instagram}</p>
              </a>
            </div>
            <div className="rounded-3xl bg-espresso p-6 text-cream">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold-light">
                <Clock className="h-4 w-4" /> Opening hours
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {(settings.openingHours || []).map((h) => (
                  <li key={h.day} className="flex items-center justify-between border-b border-white/10 pb-1.5 last:border-0">
                    <span className="text-cream/80">{h.day}</span>
                    <span className="text-cream">{h.hours || 'Available on enquiry'}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-cream/60">{settings.statusNote}</p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative h-full min-h-[24rem] overflow-hidden rounded-3xl shadow-soft">
              <iframe
                title={`Map — ${settings.fullAddress}`}
                src="https://www.google.com/maps?q=427%20Gloucester%20Rd%2C%20Horfield%2C%20Bristol%20BS7%208TZ%2C%20United%20Kingdom&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-cream shadow-soft transition hover:bg-rosewood-dark"
              >
                <Navigation className="h-4 w-4" /> Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
