'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, HeartHandshake, ScanEye, WandSparkles, Armchair, PiggyBank } from 'lucide-react';
import SectionHeading from './SectionHeading';

const ITEMS = [
  { icon: BadgeCheck, title: 'Quality Service', text: 'Google reviews specifically praise the quality of service.' },
  { icon: HeartHandshake, title: 'Friendly Team', text: 'Customers mention lovely and welcoming staff.' },
  { icon: ScanEye, title: 'Attention to Detail', text: 'Reviews specifically mention attention to detail.' },
  { icon: WandSparkles, title: 'Beautiful Results', text: 'Customers praise lash and nail results.' },
  { icon: Armchair, title: 'Welcoming Atmosphere', text: 'The salon atmosphere is described as warm and welcoming.' },
  { icon: PiggyBank, title: 'Good Value', text: 'Reviews include positive comments about price and value.' },
];

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28" aria-label="Why choose Miti Beauty">
      <SectionHeading
        eyebrow="The Miti Beauty promise"
        title="Why Miti Beauty"
        description="What our customers in Bristol love most — in their own words."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
            className="group rounded-3xl border border-espresso/10 bg-white/70 p-7 backdrop-blur transition hover:border-gold/60 hover:shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold text-espresso shadow-gold transition-transform group-hover:scale-110">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-xl text-espresso">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso-soft">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
