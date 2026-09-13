'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Stars from './Stars';
import { api } from '@/lib/api';
import { FALLBACK_REVIEWS } from '@/lib/fallback-data';
import { useSettings } from '@/lib/settings-context';

export default function HomeReviews() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const settings = useSettings();

  useEffect(() => {
    api.reviews
      .list()
      .then((res) => {
        if (res?.data?.length) setReviews(res.data.filter((r) => r.featured).concat(res.data.filter((r) => !r.featured)).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-espresso py-20 md:py-28" aria-label="Customer reviews">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeading
          dark
          eyebrow="Loved by customers"
          title={
            <>
              {settings.googleRating} / 5 <span className="italic text-blush">· {settings.googleReviewCount} Google Reviews</span>
            </>
          }
          description="Real reviews from real customers — the heart of our little salon on Gloucester Road."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r._id || i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl bg-white/[0.06] p-7 backdrop-blur border border-white/10"
            >
              <Quote className="h-7 w-7 text-gold" aria-hidden />
              <Stars rating={r.rating} className="mt-4 h-4 w-4" />
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-cream/85">“{r.reviewText}”</blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4">
                <p className="font-display text-lg text-cream">{r.customerName}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-cream/50">
                  {r.source} · {r.reviewDate}
                </p>
              </figcaption>
              {r.ownerResponse && (
                <div className="mt-4 rounded-2xl bg-gold/10 p-4 text-sm italic text-cream/75">
                  <span className="not-italic font-medium text-gold-light">Response from Miti Beauty: </span>
                  {r.ownerResponse}
                </div>
              )}
            </motion.figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-block rounded-full border border-cream/25 px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:border-gold-light hover:text-gold-light"
          >
            Read All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
