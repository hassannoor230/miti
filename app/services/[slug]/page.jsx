import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MessageCircle, CalendarCheck, ArrowLeft, Clock, Tag } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import BookingCTA from '@/components/BookingCTA';
import { ServiceIcon } from '@/components/HomeServices';
import { serverFetch } from '@/lib/api';
import { FALLBACK_SERVICES, FALLBACK_SETTINGS } from '@/lib/fallback-data';
import { waLink, telLink, priceLabel } from '@/lib/utils';

export async function generateStaticParams() {
  try {
    const res = await serverFetch('/services');
    return (res.data || []).map((s) => ({ slug: s.slug }));
  } catch (e) {
    return FALLBACK_SERVICES.map((s) => ({ slug: s.slug }));
  }
}

export async function generateMetadata({ params }) {
  let service = FALLBACK_SERVICES.find((s) => s.slug === params.slug);
  try {
    const res = await serverFetch(`/services/${params.slug}`);
    if (res?.data) service = res.data;
  } catch (e) {}
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.name,
    description: `${service.name} at Miti Beauty, Horfield Bristol — ${service.description}`,
  };
}

async function getService(slug) {
  try {
    const res = await serverFetch(`/services/${slug}`);
    return res.data;
  } catch (e) {
    return FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  }
}

export default async function ServiceDetailPage({ params }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const s = FALLBACK_SETTINGS;

  return (
    <>
      <PageHero
        eyebrow={service.category || 'Treatment'}
        title={
          <>
            {service.name.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="italic text-rosewood">{service.name.split(' ').slice(-1)}</span>
          </>
        }
        description={service.description}
      />

      <section className="mx-auto max-w-5xl px-6 md:px-8 py-14 md:py-18">
        <Reveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-espresso-soft transition hover:text-rosewood"
          >
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 md:p-10 shadow-card">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-dark text-white">
                <ServiceIcon slug={service.slug} className="h-7 w-7" />
              </span>
              <h2 className="mt-6 font-display text-2xl text-espresso">About this treatment</h2>
              <p className="mt-3 leading-relaxed text-espresso-soft">
                {service.longDescription || service.description}
              </p>
              <div className="mt-6 space-y-3 border-t border-espresso/10 pt-6 text-sm">
                <p className="flex items-center gap-3 text-espresso">
                  <Tag className="h-4 w-4 text-gold-dark" />
                  <span className="font-medium">{service.price ? service.price : priceLabel('')}</span>
                </p>
                {service.duration && (
                  <p className="flex items-center gap-3 text-espresso">
                    <Clock className="h-4 w-4 text-gold-dark" />
                    {service.duration}
                  </p>
                )}
                <p className="text-espresso-soft">
                  Every treatment is carried out with care and attention to detail in our welcoming Horfield salon.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-3xl bg-espresso p-8 text-cream">
                <p className="text-xs uppercase tracking-lux text-gold-light">Enquire about {service.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">
                  Call or WhatsApp to enquire — we&apos;ll confirm availability, price and anything else you&apos;d like
                  to know.
                </p>
                <div className="mt-6 space-y-3">
                  <Link
                    href={`/book?service=${encodeURIComponent(service.name)}`}
                    className="flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-espresso transition hover:bg-blush"
                  >
                    <CalendarCheck className="h-4 w-4" /> Request Appointment
                  </Link>
                  <a
                    href={telLink(s.phoneIntl)}
                    className="flex items-center justify-center gap-2 rounded-full border border-cream/25 px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-cream transition hover:border-gold-light hover:text-gold-light"
                  >
                    <Phone className="h-4 w-4" /> {s.phone}
                  </a>
                  <a
                    href={waLink(s.whatsapp, `Hi Miti Beauty, I'd like to enquire about ${service.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full border border-cream/25 px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] text-cream transition hover:border-gold-light hover:text-gold-light"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp Us
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border border-gold/30 bg-gold/5 p-6 text-sm text-espresso-soft">
                <p className="font-display text-lg text-espresso">Good to know</p>
                <p className="mt-2">
                  {s.businessName} · {s.fullAddress}. {s.statusNote}.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
