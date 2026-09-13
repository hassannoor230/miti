'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import BookingCTA from '@/components/BookingCTA';
import { ServiceIcon } from '@/components/HomeServices';
import { api } from '@/lib/api';
import { FALLBACK_SERVICES } from '@/lib/fallback-data';
import { priceLabel } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [state, setState] = useState('loading');

  useEffect(() => {
    api.services
      .list()
      .then((res) => {
        if (res?.data?.length) setServices(res.data);
        setState('ready');
      })
      .catch(() => setState('ready'));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Treatments & services"
        title={
          <>
            Our <span className="italic text-rosewood">Beauty Services</span>
          </>
        }
        description="Discover professional beauty treatments tailored to help you look and feel your best."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-20">
        {state === 'loading' ? (
          <div className="grid gap-5 md:grid-cols-2" aria-label="Loading services">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl bg-shell" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl bg-shell p-12 text-center">
            <p className="font-display text-2xl text-espresso">Services coming soon</p>
            <p className="mt-2 text-espresso-soft">Please call or WhatsApp us to enquire about treatments.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s._id || s.slug} delay={(i % 2) * 0.08}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full gap-6 rounded-3xl bg-white p-7 md:p-8 shadow-card transition hover:shadow-soft"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-dark text-white">
                    <ServiceIcon slug={s.slug} />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-display text-2xl text-espresso">
                      {s.name}
                      <ArrowUpRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-espresso-soft">{s.description}</span>
                    <span className="mt-3 block text-[12px] uppercase tracking-[0.16em] text-gold-dark">
                      {s.price ? s.price : priceLabel('')}
                      {s.duration ? ` · ${s.duration}` : ''}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10">
          <p className="rounded-3xl border border-gold/30 bg-gold/5 p-6 text-center text-sm text-espresso-soft">
            Looking for something specific? Prices and availability are confirmed personally —{' '}
            <Link href="/contact" className="font-medium text-rosewood underline-offset-4 hover:underline">
              just ask
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <BookingCTA />
    </>
  );
}
