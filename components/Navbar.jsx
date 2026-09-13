'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Star } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { telLink } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Top ribbon */}
      <div className="hidden md:block bg-espresso text-cream/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] tracking-[0.18em] uppercase">
          <span className="flex items-center gap-2">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {settings.googleRating} · {settings.googleReviewCount} Google Reviews
          </span>
          <a href={telLink(settings.phoneIntl)} className="flex items-center gap-2 transition hover:text-gold-light">
            <Phone className="h-3 w-3" /> {settings.phone}
          </a>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 py-4" aria-label="Main navigation">
        <Link href="/" className="font-display text-2xl md:text-[1.7rem] leading-none text-espresso">
          Miti <span className="italic text-rosewood">Beauty</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative text-[13px] uppercase tracking-[0.2em] transition-colors hover:text-rosewood ${
                  pathname === l.href ? 'text-rosewood' : 'text-espresso/80'
                }`}
              >
                {l.label}
                {pathname === l.href && (
                  <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 h-px w-full bg-gold" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/book"
            className="btn-shimmer rounded-full bg-gradient-to-r from-rosewood via-rosewood-dark to-rosewood px-7 py-3 text-[12px] uppercase tracking-[0.2em] text-white shadow-card transition-transform hover:scale-[1.03]"
          >
            {settings.bookingCTA || 'Book an Appointment'}
          </Link>
        </div>

        <button
          className="lg:hidden rounded-full border border-espresso/15 p-2.5 text-espresso"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-cream/95 backdrop-blur-md border-t border-espresso/10"
          >
            <ul className="space-y-1 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    className={`block py-2.5 font-display text-2xl ${pathname === l.href ? 'text-rosewood italic' : 'text-espresso'}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-4">
                <Link
                  href="/book"
                  className="block rounded-full bg-espresso px-7 py-3.5 text-center text-[13px] uppercase tracking-[0.2em] text-cream"
                >
                  {settings.bookingCTA || 'Book an Appointment'}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
