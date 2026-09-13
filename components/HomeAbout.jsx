'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Reveal from './Reveal';
import { useSettings } from '@/lib/settings-context';

const POINTS = [
  'Friendly service',
  'Welcoming atmosphere',
  'Professional approach',
  'Attention to detail',
  'Quality results',
  'Good value & personal care',
];

export default function HomeAbout() {
  const settings = useSettings();
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28" aria-label="About Miti Beauty">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/images/about-1.jpg"
                alt="Beautiful nail styling inspiration"
                width={500}
                height={640}
                loading="lazy"
                className="mt-8 aspect-[3/4] w-full rounded-3xl object-cover shadow-soft"
              />
              <Image
                src="/images/about-2.jpg"
                alt="Elegant lash styling inspiration"
                width={500}
                height={640}
                loading="lazy"
                className="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="whitespace-nowrap rounded-full bg-espresso px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-cream shadow-soft">
              Gloucester Road · {settings.addressArea}
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-xs uppercase tracking-lux text-gold-dark">About the salon</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-3xl md:text-[2.75rem] leading-tight text-espresso">{settings.aboutTitle}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 leading-relaxed text-espresso-soft">{settings.aboutDescription}</p>
            <p className="mt-4 leading-relaxed text-espresso-soft">
              Our customers often mention our friendly service, welcoming atmosphere and the beautiful, detailed results they
              take home — from lashes to nails.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-espresso">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rosewood/10">
                    <Check className="h-3.5 w-3.5 text-rosewood" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3}>
            <Link
              href="/about"
              className="mt-8 inline-block rounded-full border border-espresso/25 px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] text-espresso transition hover:border-rosewood hover:text-rosewood"
            >
              More About Us
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
