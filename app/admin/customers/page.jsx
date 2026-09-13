'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, User, Mail, Phone, Calendar, MessageCircle, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.admin.customers();
        if (mounted) setCustomers(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl text-espresso">Customers</h1>
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Customers</h1>
          <p className="text-sm text-espresso-soft">{customers.length} total customers</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-espresso/15 bg-white py-3 pl-11 pr-4 text-espresso focus:border-rosewood"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-espresso/10 text-sm">
          <thead className="bg-shell">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Customer</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Contact</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Role</th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-[0.14em] text-espresso-soft">Joined</th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-[0.14em] text-espresso-soft">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-espresso-soft">
                  No customers found.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-shell/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rosewood/10 text-rosewood">
                      <User className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-espresso">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-espresso">
                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-espresso/40" />{c.email}</div>
                    {c.phone && <div className="flex items-center gap-1.5 text-espresso-soft"><Phone className="h-3.5 w-3.5" />{c.phone}</div>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] ${c.role === 'admin' ? 'bg-gold/15 text-gold-dark' : 'bg-shell text-espresso'}`}>
                    {c.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-espresso-soft">{formatDate(c.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/customers/${c._id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cream transition hover:bg-rosewood-dark"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}