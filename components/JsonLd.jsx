/**
 * LocalBusiness structured data — verified information only.
 * No fabricated hours, services, or ratings markup beyond real data.
 */
export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Miti Beauty',
    description:
      'Miti Beauty offers professional beauty treatments including lashes, eyelash extensions, nail extensions, manicure and threading in Horfield, Bristol.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '427 Gloucester Rd',
      addressLocality: 'Horfield, Bristol',
      postalCode: 'BS7 8TZ',
      addressCountry: 'GB',
    },
    telephone: '+44 7478 558408',
    sameAs: ['https://instagram.com/mitibeautyuk'],
    hasMap: 'https://www.google.com/maps/search/?api=1&query=Miti+Beauty+427+Gloucester+Rd+Horfield+Bristol+BS7+8TZ',
    priceRange: '££',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
