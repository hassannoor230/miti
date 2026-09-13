'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye, Sparkles, Gem, Hand, Brush } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { api } from '@/lib/api';
import { FALLBACK_SERVICES } from '@/lib/fallback-data';
import { priceLabel } from '@/lib/utils';

const ICONS = {
  lashes: Eye,
  'eyelash-extensions': Sparkles,
  'nail-extensions': Gem,
  manicure: Hand,
  threading: Brush,
};

export function ServiceIcon({ slug, className = 'h-6 w-6' }) {
  const Icon = ICONS[slug] || Sparkles;
  return <Icon className={className} />;
}

export default function HomeServices() {
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
    <section className="bg-shell py-20 md:py-28" aria-label="Beauty services">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeading
          eyebrow="Treatments"
          title="Our Beauty Services"
          description="Discover professional beauty treatments tailored to help you look and feel your best."
        />

        {state === 'loading' ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading services">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
              <motion.article
                key={s._id || s.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-card transition-shadow hover:shadow-soft"
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-blush to-gold-light opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
                />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-dark text-white shadow-card">
                  <ServiceIcon slug={s.slug} />
                </span>
                <h3 className="relative mt-5 font-display text-2xl text-espresso">{s.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-espresso-soft">{s.description}</p>
                <p className="relative mt-4 text-[12px] uppercase tracking-[0.16em] text-gold-dark">
                  {s.price ? s.price : priceLabel('')}
                  {s.duration ? ` · ${s.duration}` : ''}
                </p>
                <Link
                  href={`/services/${s.slug}`}
                  className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.18em] text-rosewood transition group-hover:gap-3"
                  aria-label={`Learn more about ${s.name}`}
                >
                  Discover <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}

            {/* CTA tile */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-espresso p-8 text-cream"
            >
              <div aria-hidden className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-rosewood/40 blur-3xl" />
              <div>
                <p className="text-xs uppercase tracking-lux text-gold-light">Not sure which to choose?</p>
                <h3 className="mt-3 font-display text-2xl leading-snug">
                  Call or WhatsApp <span className="italic text-blush">to enquire</span>
                </h3>
              </div>
              <Link
                href="/book"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-espresso transition hover:bg-blush"
              >
                Request Appointment <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
