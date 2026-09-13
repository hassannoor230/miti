'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { api } from '@/lib/api';
import { useSettings } from '@/lib/settings-context';

/**
 * Featured beauty work — shows ONLY real uploaded photos from the API.
 * Until the owner uploads photos, this section shows an elegant
 * Instagram CTA instead of pretending stock photos are salon work.
 */
export default function FeaturedWork() {
  const [items, setItems] = useState([]);
  const settings = useSettings();

  useEffect(() => {
    api.gallery
      .list('?featured=1')
      .then((res) => setItems((res?.data || []).slice(0, 4)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24" aria-label="Featured beauty work">
        <SectionHeading
          eyebrow="Our work"
          title="Featured Beauty Work"
          description="Fresh photos of our recent work are on the way — follow along on Instagram to see the latest lashes and nails."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5 rounded-3xl bg-shell p-10 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rosewood to-gold text-white">
            <Instagram className="h-6 w-6" />
          </span>
          <p className="font-display text-2xl text-espresso">See our latest work on Instagram</p>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-espresso px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark"
          >
            @{settings.instagram}
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24" aria-label="Featured beauty work">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          align="left"
          eyebrow="Our work"
          title="Featured Beauty Work"
          description="A glimpse of recent treatments at the salon."
        />
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-rosewood hover:gap-3 transition-all"
        >
          View gallery <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((g, i) => (
          <motion.div
            key={g._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-3xl"
          >
            <Image
              src={g.image}
              alt={g.altText || g.title || 'Miti Beauty salon work'}
              width={500}
              height={640}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent p-4 pt-10">
              <p className="text-sm font-medium text-cream">{g.title || g.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
