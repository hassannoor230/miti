import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Miti Beauty handles your personal information when you enquire or book an appointment.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="How we handle your personal information." />
      <section className="mx-auto max-w-3xl px-6 md:px-8 py-14">
        <div className="space-y-8 leading-relaxed text-espresso-soft">
          <div>
            <h2 className="font-display text-2xl text-espresso">What we collect</h2>
            <p className="mt-2">
              When you send an enquiry or request an appointment through this website, we collect the details you
              provide — such as your name, phone number, email address, preferred treatment, and any message you send.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-espresso">How we use it</h2>
            <p className="mt-2">
              We use your details only to respond to your enquiry, arrange your appointment, and run our salon. We do
              not sell your personal information or share it with third parties for marketing.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-espresso">How we store it</h2>
            <p className="mt-2">
              Enquiries and appointment requests are stored securely and are only accessible to the salon. If you would
              like us to update or delete your details, just get in touch.
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
