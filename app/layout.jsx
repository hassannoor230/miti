import './globals.css';
import { Playfair_Display, Jost } from 'next/font/google';
import { SettingsProvider } from '@/lib/settings-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import Preloader from '@/components/Preloader';
import JsonLd from '@/components/JsonLd';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mitibeauty.example.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Miti Beauty | Beauty Salon in Horfield, Bristol',
    template: '%s | Miti Beauty',
  },
  description:
    'Miti Beauty offers professional beauty treatments including lashes, eyelash extensions, nail extensions, manicure and threading in Horfield, Bristol.',
  keywords: [
    'Miti Beauty',
    'beauty salon Bristol',
    'beauty salon Horfield',
    'Gloucester Road beauty',
    'lashes Bristol',
    'eyelash extensions Bristol',
    'nail extensions Bristol',
    'manicure Horfield',
    'threading Bristol',
  ],
  authors: [{ name: 'Miti Beauty' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Miti Beauty',
    title: 'Miti Beauty | Beauty Salon in Horfield, Bristol',
    description:
      'Miti Beauty offers professional beauty treatments including lashes, eyelash extensions, nail extensions, manicure and threading in Horfield, Bristol.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miti Beauty | Beauty Salon in Horfield, Bristol',
    description: 'Professional beauty treatments in Horfield, Bristol — lashes, nails, manicure & threading.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body suppressHydrationWarning className="grain">
        <JsonLd />
        <SettingsProvider>
          <Preloader />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <MobileStickyCTA />
        </SettingsProvider>
      </body>
    </html>
  );
}
