import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import HomeAbout from '@/components/HomeAbout';
import HomeServices from '@/components/HomeServices';
import FeaturedWork from '@/components/FeaturedWork';
import WhyUs from '@/components/WhyUs';
import HomeReviews from '@/components/HomeReviews';
import BookingCTA from '@/components/BookingCTA';
import ContactLocation from '@/components/ContactLocation';

const MARQUEE = ['Lashes', 'Eyelash Extensions', 'Nail Extensions', 'Manicure', 'Threading', 'Horfield · Bristol'];

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-espresso/10 bg-white/60 py-4" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-lg italic text-espresso/70">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <div className="mt-14">
        <Marquee />
      </div>
      <HomeAbout />
      <HomeServices />
      <FeaturedWork />
      <WhyUs />
      <HomeReviews />
      <div className="pt-20 md:pt-28">
        <BookingCTA />
      </div>
      <ContactLocation />
    </>
  );
}
