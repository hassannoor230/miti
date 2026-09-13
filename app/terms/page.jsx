import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms for using the Miti Beauty website and requesting appointments.',
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" description="The small print for using our website." />
      <section className="mx-auto max-w-3xl px-6 md:px-8 py-14">
        <div className="space-y-8 leading-relaxed text-espresso-soft">
          <div>
            <h2 className="font-display text-2xl text-espresso">Appointment requests</h2>
            <p className="mt-2">
              Submitting the booking form sends an appointment enquiry — your slot is confirmed only once the salon
              confirms it with you directly by phone or message.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-espresso">Prices & availability</h2>
            <p className="mt-2">
              Where a price is shown as &ldquo;available on enquiry&rdquo;, it will be confirmed personally before your
              appointment. Treatment availability may vary.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-espresso">Website content</h2>
            <p className="mt-2">
              We work hard to keep the information on this website accurate, but details may change. If anything is
              unclear, please call or message us and we&apos;ll be happy to help.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-espresso">Contact</h2>
            <p className="mt-2">
              Miti Beauty, 427 Gloucester Rd, Horfield, Bristol BS7 8TZ — phone +44 7478 558408.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
