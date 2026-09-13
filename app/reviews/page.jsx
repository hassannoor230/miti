'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import BookingCTA from '@/components/BookingCTA';
import Stars from '@/components/Stars';
import { api } from '@/lib/api';
import { FALLBACK_REVIEWS, REVIEW_THEMES, SERVICE_CATEGORIES } from '@/lib/fallback-data';
import { useSettings } from '@/lib/settings-context';
import { Quote, Star, BadgeCheck } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [state, setState] = useState('loading');
  const [form, setForm] = useState({ customerName: '', rating: 5, reviewText: '' });
  const [formState, setFormState] = useState('idle');
  const settings = useSettings();

  useEffect(() => {
    api.reviews
      .list()
      .then((res) => {
        if (res?.data?.length) setReviews(res.data);
        setState('ready');
      })
      .catch(() => setState('ready'));
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    setFormState('sending');
    try {
      await api.reviews.create({ ...form, source: 'Website' });
      setFormState('sent');
      setForm({ customerName: '', rating: 5, reviewText: '' });
    } catch (err) {
      setFormState('error');
    }
  }

  return (
    <>
      <PageHero
        eyebrow={`${settings.googleRating} / 5 · ${settings.googleReviewCount} Google reviews`}
        title={
          <>
            Loved by Our <span className="italic text-rosewood">Customers</span>
          </>
        }
        description="Real reviews from real customers of Miti Beauty in Horfield, Bristol."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-14">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2.5" aria-label="Review themes">
            {[...SERVICE_CATEGORIES, ...REVIEW_THEMES].map((t) => (
              <span
                key={t}
                className="rounded-full border border-gold/40 bg-white px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] text-espresso"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {state === 'loading' ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading reviews">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-shell" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r._id || i} delay={(i % 3) * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-card">
                  <Quote className="h-6 w-6 text-gold" aria-hidden />
                  <Stars rating={r.rating} className="mt-3" />
                  <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-espresso">
                    “{r.reviewText}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-espresso/10 pt-4">
                    <p className="flex items-center gap-1.5 font-display text-lg text-espresso">
                      {r.customerName}
                      {r.source === 'Google' && <BadgeCheck className="h-4 w-4 text-gold-dark" aria-label="Verified Google review" />}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-espresso-soft">
                      {r.source} · {r.reviewDate}
                    </p>
                  </figcaption>
                  {r.ownerResponse && (
                    <div className="mt-4 rounded-2xl bg-shell p-4 text-sm italic text-espresso-soft">
                      <span className="not-italic font-medium text-espresso">Response from the salon: </span>
                      {r.ownerResponse}
                    </div>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        {/* Leave a review */}
        <Reveal className="mx-auto mt-14 max-w-2xl">
          <div className="rounded-3xl bg-espresso p-8 md:p-10 text-cream">
            <p className="flex items-center gap-2 text-xs uppercase tracking-lux text-gold-light">
              <Star className="h-4 w-4" /> Visited us recently?
            </p>
            <h2 className="mt-3 font-display text-3xl">Share your experience</h2>
            <p className="mt-2 text-sm text-cream/70">
              Your review will appear here after a quick check by the salon.
            </p>
            {formState === 'sent' ? (
              <div className="mt-6 rounded-2xl bg-white/10 p-6 text-center" role="status">
                <p className="font-display text-xl">Thank you so much!</p>
                <p className="mt-1 text-sm text-cream/70">Your review has been received and is awaiting approval.</p>
              </div>
            ) : (
              <form onSubmit={submitReview} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rv-name" className="text-xs uppercase tracking-[0.16em] text-cream/60">
                      Your name
                    </label>
                    <input
                      id="rv-name"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-cream placeholder:text-cream/40"
                      placeholder="Your name"
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <label htmlFor="rv-rating" className="text-xs uppercase tracking-[0.16em] text-cream/60">
                      Rating
                    </label>
                    <select
                      id="rv-rating"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-cream [&>option]:text-espresso"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {'★'.repeat(n)} ({n}/5)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="rv-text" className="text-xs uppercase tracking-[0.16em] text-cream/60">
                    Your review
                  </label>
                  <textarea
                    id="rv-text"
                    required
                    rows={4}
                    value={form.reviewText}
                    onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-cream placeholder:text-cream/40"
                    placeholder="Tell us about your visit…"
                    maxLength={1000}
                  />
                </div>
                {formState === 'error' && (
                  <p className="text-sm text-blush" role="alert">
                    Something went wrong — please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full rounded-full bg-cream px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-espresso transition hover:bg-blush disabled:opacity-60"
                >
                  {formState === 'sending' ? 'Sending…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      <BookingCTA />
    </>
  );
}
