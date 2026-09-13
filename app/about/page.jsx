import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import WhyUs from '@/components/WhyUs';
import BookingCTA from '@/components/BookingCTA';
import { MapPin, Star, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description:
    'Miti Beauty is a welcoming beauty salon on Gloucester Road in Horfield, Bristol — professional treatments with quality, care and attention to detail.',
};

const VALUES = [
  'Professional',
  'Welcoming',
  'High Quality',
  'Friendly',
  'Detail-Oriented',
  'Good Value',
  'Personalized',
  'Beautiful Results',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Miti Beauty"
        title={
          <>
            Beauty With a <span className="italic text-rosewood">Personal Touch</span>
          </>
        }
        description="A welcoming beauty salon on Gloucester Road in Horfield, Bristol — professional treatments with a focus on quality, care and attention to detail."
      />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Image
                src="/images/about-salon.jpg"
                alt="Inside the welcoming Miti Beauty salon"
                width={800}
                height={900}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft"
              />
              <div className="absolute -bottom-6 -right-4 md:-right-6 rounded-3xl bg-espresso px-7 py-5 text-cream shadow-soft">
                <p className="flex items-center gap-2 font-display text-3xl">
                  4.9 <Star className="h-6 w-6 fill-gold text-gold" />
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-cream/70">61 Google reviews</p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-lux text-gold-dark">Our story</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-espresso">
                A little salon with a lot of <span className="italic text-rosewood">heart</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-5 space-y-4 leading-relaxed text-espresso-soft">
                <p>
                  Miti Beauty is a welcoming beauty salon based on Gloucester Road in Horfield, Bristol, offering
                  professional beauty treatments with a focus on quality, care and attention to detail.
                </p>
                <p>
                  Our customers often tell us they love the friendly service, the warm and welcoming atmosphere, and the
                  beautiful results — from lifted, natural-looking lashes to polished, eye-catching nails.
                </p>
                <p>
                  Every appointment is personal: we listen to what you want, pay close attention to detail, and make sure
                  you leave feeling your best.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {VALUES.map((v) => (
                  <span
                    key={v}
                    className="rounded-full border border-gold/40 bg-white px-4 py-1.5 text-[12px] uppercase tracking-[0.14em] text-espresso"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-shell py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-3 md:px-8">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <Heart className="mx-auto h-7 w-7 text-rosewood" />
              <h3 className="mt-3 font-display text-xl text-espresso">Personal care</h3>
              <p className="mt-2 text-sm text-espresso-soft">Treatments shaped around you, your style and your natural beauty.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <Star className="mx-auto h-7 w-7 text-rosewood" />
              <h3 className="mt-3 font-display text-xl text-espresso">Trusted quality</h3>
              <p className="mt-2 text-sm text-espresso-soft">A 4.9-star Google rating across 61 customer reviews.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <MapPin className="mx-auto h-7 w-7 text-rosewood" />
              <h3 className="mt-3 font-display text-xl text-espresso">Easy to find</h3>
              <p className="mt-2 text-sm text-espresso-soft">427 Gloucester Rd, Horfield, Bristol BS7 8TZ.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <WhyUs />

      <section className="mx-auto max-w-4xl px-6 pb-20 text-center md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Come and say hello"
            title="We'd love to look after you"
            description="Call, message or request an appointment online — whichever is easiest for you."
          />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="rounded-full bg-espresso px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-cream transition hover:bg-rosewood-dark"
            >
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-espresso/25 px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-espresso transition hover:border-rosewood hover:text-rosewood"
            >
              Explore Services
            </Link>
          </div>
        </Reveal>
      </section>

      <BookingCTA />
    </>
  );
}
