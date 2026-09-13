import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cream px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blush/50 blur-3xl"
      />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-sm uppercase tracking-lux text-gold-dark">404</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-espresso">
          Looks like you&apos;ve taken a <span className="italic text-rosewood">little detour.</span>
        </h1>
        <p className="mt-4 text-espresso-soft">
          The page you&apos;re looking for isn&apos;t here — but beautiful things are waiting back at the salon.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-espresso px-8 py-3 text-sm uppercase tracking-lux text-cream transition hover:bg-rosewood-dark"
          >
            Back to Miti Beauty
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-espresso/20 px-8 py-3 text-sm uppercase tracking-lux text-espresso transition hover:border-rosewood hover:text-rosewood"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
