const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mitibeauty.example.com';

export default async function sitemap() {
  const routes = ['', '/about', '/services', '/gallery', '/reviews', '/contact', '/book', '/privacy', '/terms'];
  let services = [];
  try {
    const base = process.env.BACKEND_URL || 'http://127.0.0.1:5001';
    const res = await fetch(`${base}/api/services`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      services = json.data || [];
    }
  } catch (e) {
    services = [
      { slug: 'lashes' },
      { slug: 'eyelash-extensions' },
      { slug: 'nail-extensions' },
      { slug: 'manicure' },
      { slug: 'threading' },
    ];
  }
  const now = new Date();
  return [
    ...routes.map((r) => ({ url: `${SITE_URL}${r}`, lastModified: now, changeFrequency: 'weekly', priority: r === '' ? 1 : 0.8 })),
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
