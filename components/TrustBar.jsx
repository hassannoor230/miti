'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MessageSquareHeart, MapPin, Gem } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

gsap.registerPlugin(ScrollTrigger);

export default function TrustBar() {
  const ref = useRef(null);
  const settings = useSettings();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.trust-item',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const items = [
    { icon: Star, value: `${settings.googleRating}★`, label: 'Google Rating' },
    { icon: MessageSquareHeart, value: String(settings.googleReviewCount), label: 'Google Reviews' },
    { icon: MapPin, value: settings.addressCity, label: settings.addressArea },
    { icon: Gem, value: settings.category, label: 'Professional Beauty Services' },
  ];

  return (
    <section ref={ref} className="relative z-10 mx-auto -mt-2 max-w-6xl px-6 md:px-8" aria-label="Why customers trust Miti Beauty">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-espresso/10 shadow-soft lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="trust-item flex items-center gap-4 bg-white/95 px-6 py-6 backdrop-blur">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush to-gold-light">
              <item.icon className="h-5 w-5 text-espresso" />
            </span>
            <span>
              <span className="block font-display text-xl md:text-2xl text-espresso">{item.value}</span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-espresso-soft">{item.label}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
