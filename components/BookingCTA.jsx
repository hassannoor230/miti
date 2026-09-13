'use client';

import Link from 'next/link';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';
import Reveal from './Reveal';
import { useSettings } from '@/lib/settings-context';
import { waLink, telLink } from '@/lib/utils';

export default function BookingCTA() {
  const settings = useSettings();
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 pb-20 md:pb-28" aria-label="Book an appointment">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rosewood-dark via-espresso to-espresso px-8 py-16 md:py-20 text-center text-cream shadow-soft">
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-rosewood/50 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs uppercase tracking-lux text-gold-light">Appointments</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl leading-tight">
              Ready for Your Next <span className="italic text-blush">Beauty Appointment?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/75">
              Get in touch with {settings.businessName} in {settings.addressArea}, {settings.addressCity} to enquire about
              your preferred treatment.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-espresso transition hover:bg-blush"
              >
                <CalendarCheck className="h-4 w-4" /> {settings.bookingCTA || 'Book an Appointment'}
              </Link>
              <a
                href={telLink(settings.phoneIntl)}
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:border-gold-light hover:text-gold-light"
              >
                <Phone className="h-4 w-4" /> Call {settings.businessName}
              </a>
              <a
                href={waLink(settings.whatsapp, settings.whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:border-gold-light hover:text-gold-light"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
