import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, description, align = 'center', dark = false }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <Reveal>
        <p className={`text-xs uppercase tracking-lux ${dark ? 'text-gold-light' : 'text-gold-dark'}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`mt-3 font-display text-3xl md:text-[2.75rem] leading-tight ${dark ? 'text-cream' : 'text-espresso'}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`mt-4 leading-relaxed ${dark ? 'text-cream/70' : 'text-espresso-soft'}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
