'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageHero({ eyebrow, title, description }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ph-line',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-shell pt-36 md:pt-44 pb-16 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blush/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="ph-line text-xs uppercase tracking-lux text-gold-dark">{eyebrow}</p>
        <h1 className="ph-line mt-4 font-display text-4xl md:text-6xl leading-tight text-espresso">{title}</h1>
        {description && <p className="ph-line mx-auto mt-5 max-w-2xl leading-relaxed text-espresso-soft">{description}</p>}
        <div className="ph-line gold-rule mx-auto mt-8 w-40" aria-hidden />
      </div>
    </section>
  );
}
