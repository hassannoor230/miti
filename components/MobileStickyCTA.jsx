'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, CalendarCheck, MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { waLink, telLink } from '@/lib/utils';

export default function MobileStickyCTA() {
  const pathname = usePathname();
  const settings = useSettings();
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden" role="navigation" aria-label="Quick contact">
      <div className="mx-3 mb-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/20 bg-espresso/95 shadow-soft backdrop-blur-md">
        <a
          href={telLink(settings.phoneIntl)}
          className="flex flex-col items-center gap-1 py-2.5 text-cream transition active:bg-white/10"
        >
          <Phone className="h-4 w-4 text-gold-light" />
          <span className="text-[11px] uppercase tracking-[0.14em]">Call</span>
        </a>
        <a
          href={waLink(settings.whatsapp, settings.whatsappDefaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-white/10 py-2.5 text-cream transition active:bg-white/10"
        >
          <MessageCircle className="h-4 w-4 text-gold-light" />
          <span className="text-[11px] uppercase tracking-[0.14em]">WhatsApp</span>
        </a>
        <Link href="/book" className="flex flex-col items-center gap-1 bg-rosewood py-2.5 text-white transition active:bg-rosewood-dark">
          <CalendarCheck className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.14em]">Book</span>
        </Link>
      </div>
    </div>
  );
}
