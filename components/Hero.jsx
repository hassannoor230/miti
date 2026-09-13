'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

gsap.registerPlugin(ScrollTrigger);

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blush/40 via-shell to-gold/20" />,
});

export default function Hero() {
  const ref = useRef(null);
  const settings = useSettings();
  const [show3D, setShow3D] = useState(false);
  const [compact3D, setCompact3D] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => setCompact3D(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    if (!reduced) {
      const t = setTimeout(() => setShow3D(true), 1600);
      return () => {
        clearTimeout(t);
        window.removeEventListener('resize', update);
      };
    }
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 1.5 }
      );
      gsap.fromTo(
        '.hero-visual',
        { opacity: 0, scale: 0.94, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1.7 }
      );
      gsap.fromTo(
        '.hero-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 2.1 }
      );
      gsap.to('.hero-visual', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 md:pt-44 pb-14 md:pb-24" aria-label="Welcome to Miti Beauty">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-blush/50 blur-3xl" />
        <div className="absolute -right-24 top-64 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        {show3D && (
          <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-70 md:block">
            <Hero3D compact={compact3D} />
          </div>
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="hero-line inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-1.5 text-[11px] uppercase tracking-lux text-gold-dark backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {settings.category} · {settings.addressArea}, {settings.addressCity}
          </p>
          <h1 className="hero-line mt-6 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-espresso">
            {settings.heroTitle?.split('&')[0]?.trim()}
            <br />
            <span className="italic text-rosewood">&amp; {settings.heroTitle?.split('&')[1]?.trim() || 'Care'}</span>
          </h1>
          <p className="hero-line mt-6 text-lg leading-relaxed text-espresso-soft">{settings.heroDescription}</p>

          <div className="hero-line mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/book"
              className="btn-shimmer group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosewood via-rosewood-dark to-rosewood px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-white shadow-card transition-transform hover:scale-[1.03]"
            >
              {settings.bookingCTA || 'Book an Appointment'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-espresso/25 px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-espresso transition hover:border-rosewood hover:text-rosewood"
            >
              Explore Services
            </Link>
          </div>

          <div className="hero-line mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-espresso-soft">
            <span className="flex items-center gap-2">
              <span className="flex" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </span>
              <strong className="font-medium text-espresso">{settings.googleRating}</strong> · {settings.googleReviewCount} Google
              reviews
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rosewood" />
              {settings.addressStreet}, {settings.addressCity} {settings.postcode}
            </span>
          </div>
        </div>

        {/* Editorial visual */}
        <div className="hero-visual relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[6px] border-white shadow-soft">
            <Image
              src="/images/hero.jpg"
              alt="Elegant beauty treatment styling at Miti Beauty, Bristol"
              width={800}
              height={1000}
              priority
              className="aspect-[4/5] w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent" />
          </div>

          <div className="hero-card absolute -left-4 top-16 md:-left-10 rounded-2xl bg-white/90 px-5 py-4 shadow-soft backdrop-blur">
            <p className="flex items-center gap-1.5 font-display text-2xl text-espresso">
              {settings.googleRating}
              <Star className="h-5 w-5 fill-gold text-gold" />
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-espresso-soft">Google rating</p>
          </div>

          <div className="hero-card absolute -right-3 bottom-14 md:-right-6 max-w-[12rem] rounded-2xl bg-espresso/95 px-5 py-4 text-cream shadow-soft backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-light">Owner&apos;s message</p>
            <p className="mt-1.5 text-sm italic leading-snug text-cream/90">“{settings.ownerMessage}”</p>
          </div>
        </div>
      </div>
    </section>
  );
}
