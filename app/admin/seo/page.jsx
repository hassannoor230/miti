'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

function Row({ ok, label, detail, href }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-shell px-4 py-3 text-sm">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rosewood" />
      )}
      <span className="flex-1">
        <span className="font-medium text-espresso">{label}</span>
        {detail && <span className="block text-xs text-espresso-soft">{detail}</span>}
      </span>
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-rosewood hover:underline" aria-label={`Open ${label}`}>
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </li>
  );
}

export default function AdminSeoPage() {
  const [settings, setSettings] = useState(null);
  const [checks, setChecks] = useState({ sitemap: null, robots: null });

  useEffect(() => {
    api.settings.get().then((res) => setSettings(res.data)).catch(() => {});
    fetch('/sitemap.xml', { method: 'HEAD' }).then((r) => setChecks((c) => ({ ...c, sitemap: r.ok }))).catch(() => setChecks((c) => ({ ...c, sitemap: false })));
    fetch('/robots.txt', { method: 'HEAD' }).then((r) => setChecks((c) => ({ ...c, robots: r.ok }))).catch(() => setChecks((c) => ({ ...c, robots: false })));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">SEO & Local Search</h1>
      <p className="text-sm text-espresso-soft">Live status of the site&apos;s search optimisation for Bristol & Horfield.</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Technical checks</h2>
          <ul className="mt-4 space-y-2.5">
            <Row ok={checks.sitemap} label="XML Sitemap" detail="/sitemap.xml — auto-generated incl. services" href="/sitemap.xml" />
            <Row ok={checks.robots} label="Robots.txt" detail="/robots.txt — allows public pages, blocks /admin" href="/robots.txt" />
            <Row ok label="Page titles & meta descriptions" detail="Unique per page via Next.js metadata" />
            <Row ok label="Open Graph & Twitter cards" detail="Configured for rich social sharing" />
            <Row ok label="LocalBusiness structured data" detail="BeautySalon schema with address, phone & Instagram" />
            <Row ok label="Semantic HTML & alt text" detail="Headings hierarchy, ARIA labels, image alt text" />
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <h2 className="font-display text-xl text-espresso">Local SEO data in use</h2>
          {settings ? (
            <dl className="mt-4 space-y-2.5 text-sm">
              {[
                ['Business', `${settings.businessName} — ${settings.category}`],
                ['Address', settings.fullAddress],
                ['Phone', settings.phone],
                ['Instagram', settings.instagramUrl],
                ['Google rating', `${settings.googleRating} (${settings.googleReviewCount} reviews)`],
                ['Plus code', settings.plusCode],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-shell px-4 py-2.5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft">{k}</dt>
                  <dd className="text-espresso">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-espresso-soft">Loading…</p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-espresso-soft">
            Tip: keep the Google rating & review count in Business Settings in sync with the real Google Business
            Profile. Structured data only ever uses verified information.
          </p>
        </div>
      </div>
    </div>
  );
}
