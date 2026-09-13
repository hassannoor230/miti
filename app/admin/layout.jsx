'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Star,
  Images,
  Mail,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Business Settings', icon: Settings },
  { href: '/admin/seo', label: 'SEO', icon: Search },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) {
      setChecking(false);
      return;
    }
    api.auth
      .me()
      .then((res) => {
        setAdmin(res.admin);
        setChecking(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [isLogin, router, pathname]);

  async function logout() {
    try {
      await api.auth.logout();
    } catch (e) {}
    router.push('/admin/login');
  }

  if (isLogin) return <>{children}</>;

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shell">
        <p className="font-display text-2xl text-espresso">Checking session…</p>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="px-6 pt-8 font-display text-2xl text-cream">
        Miti <span className="italic text-blush">Beauty</span>
        <span className="mt-1 block text-[10px] uppercase tracking-lux text-gold-light">Admin panel</span>
      </Link>
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3" aria-label="Admin navigation">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active ? 'bg-cream text-espresso font-medium' : 'text-cream/75 hover:bg-white/10 hover:text-cream'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate px-2 text-xs text-cream/60">{admin?.email}</p>
        <div className="mt-2 flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 rounded-xl border border-white/15 px-3 py-2.5 text-center text-xs uppercase tracking-[0.14em] text-cream/85 transition hover:border-gold-light"
          >
            View site
          </Link>
          <button
            onClick={logout}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rosewood px-3 py-2.5 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-rosewood-dark"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-shell">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-espresso lg:block">{sidebar}</aside>

      {/* Mobile topbar + drawer */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-espresso px-5 py-4 lg:hidden">
        <span className="font-display text-xl text-cream">
          Miti <span className="italic text-blush">Beauty</span> Admin
        </span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
          className="rounded-lg bg-white/10 p-2 text-cream"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-espresso/60" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-espresso">{sidebar}</aside>
        </div>
      )}

      <main className="p-5 md:p-8 lg:ml-64">{children}</main>
    </div>
  );
}
