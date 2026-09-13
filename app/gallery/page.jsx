'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Lightbox from '@/components/Lightbox';
import BookingCTA from '@/components/BookingCTA';
import { api } from '@/lib/api';
import { GALLERY_CATEGORIES } from '@/lib/fallback-data';
import { useSettings } from '@/lib/settings-context';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [lightbox, setLightbox] = useState(-1);
  const [state, setState] = useState('loading');
  const settings = useSettings();

  useEffect(() => {
    api.gallery
      .list()
      .then((res) => {
        setItems(res?.data || []);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const filtered = category === 'All' ? items : items.filter((g) => g.category === category);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={
          <>
            Beauty <span className="italic text-rosewood">Gallery</span>
          </>
        }
        description="Real work from our salon in Horfield, Bristol."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-18">
        <div className="flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Filter gallery by category">
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] transition ${
                category === c ? 'bg-espresso text-cream' : 'border border-espresso/15 text-espresso hover:border-rosewood hover:text-rosewood'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {state === 'loading' ? (
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3" aria-label="Loading gallery">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-shell" />
            ))}
          </div>
        ) : state === 'error' ? (
          <div className="mt-10 rounded-3xl bg-shell p-12 text-center">
            <p className="font-display text-2xl text-espresso">We couldn&apos;t load the gallery</p>
            <p className="mt-2 text-espresso-soft">Please try again in a moment.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-espresso px-8 py-3 text-[12px] uppercase tracking-[0.18em] text-cream"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5 rounded-3xl bg-shell p-10 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rosewood to-gold text-white">
              <Instagram className="h-6 w-6" />
            </span>
            <p className="font-display text-2xl text-espresso">Fresh photos are on the way</p>
            <p className="text-espresso-soft">
              We&apos;re preparing real photos of our work. Meanwhile, see the latest on Instagram — @{settings.instagram}.
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-espresso px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark"
            >
              Follow on Instagram
            </a>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((g, i) => (
                <motion.button
                  key={g._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setLightbox(i)}
                  className="group relative overflow-hidden rounded-3xl text-left"
                  aria-label={`Open photo: ${g.altText || g.title || g.category}`}
                >
                  <Image
                    src={g.image}
                    alt={g.altText || g.title || 'Miti Beauty salon work'}
                    width={600}
                    height={760}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/70 to-transparent p-4 pt-10 text-left">
                    <span className="block text-sm font-medium text-cream">{g.title || g.category}</span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-cream/70">{g.category}</span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightbox >= 0 && (
          <Lightbox items={filtered} index={lightbox} onClose={() => setLightbox(-1)} onNavigate={setLightbox} />
        )}
      </AnimatePresence>

      <BookingCTA />
    </>
  );
}
