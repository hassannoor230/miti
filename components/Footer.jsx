'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Instagram, Star, Clock } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { telLink } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
  { href: '/book', label: 'Book Appointment' },
];

export default function Footer() {
  const pathname = usePathname();
  const settings = useSettings();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-6 md:px-8 pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-3xl">
              Miti <span className="italic text-blush">Beauty</span>
            </p>
            <p className="mt-2 text-sm uppercase tracking-lux text-gold-light">{settings.category}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-cream/80">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {settings.googleRating} · {settings.googleReviewCount} Google Reviews
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm text-cream/70">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              {settings.statusNote}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs uppercase tracking-lux text-gold-light">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-cream/75 transition hover:text-blush">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-lux text-gold-light">Visit Us</p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-cream/75">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                <span>
                  {settings.addressStreet}, {settings.addressArea},
                  <br />
                  {settings.addressCity} {settings.postcode},
                  <br />
                  {settings.country}
                </span>
              </span>
            </address>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-blush underline-offset-4 hover:underline"
            >
              Get directions
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-lux text-gold-light">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={telLink(settings.phoneIntl)} className="flex items-center gap-2 text-cream/85 transition hover:text-blush">
                  <Phone className="h-4 w-4 text-gold-light" /> {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/85 transition hover:text-blush"
                >
                  <Instagram className="h-4 w-4 text-gold-light" /> @{settings.instagram}
                </a>
              </li>
            </ul>
            <Link
              href="/book"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-2.5 text-[12px] uppercase tracking-[0.18em] text-espresso transition hover:opacity-90"
            >
              {settings.bookingCTA || 'Book an Appointment'}
            </Link>
          </div>
        </div>

        <div className="gold-rule mt-12 opacity-40" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-blush">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-blush">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      {/* spacer so mobile sticky CTA never covers footer content */}
      <div className="h-16 md:hidden" aria-hidden />
    </footer>
  );
}
