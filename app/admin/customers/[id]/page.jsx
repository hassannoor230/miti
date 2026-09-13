'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Calendar, MessageCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminCustomerDetailPage({ params }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [c, a, e] = await Promise.all([
          api.admin.customer(params.id),
          api.admin.customerAppointments(params.id),
          api.admin.customerEnquiries(params.id),
        ]);
        if (mounted) {
          setCustomer(c.data);
          setAppointments(a.data || []);
          setEnquiries(e.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [params.id]);

  if (loading) {
    return (
      <div>
        <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm text-rosewood hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="font-display text-xl text-espresso">Customer not found</p>
        <Link href="/admin/customers" className="mt-4 inline-block rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream">
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm text-rosewood hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-rosewood/10 text-rosewood">
              <User className="h-10 w-10" />
            </span>
            <h2 className="mt-4 font-display text-2xl text-espresso">{customer.name}</h2>
            <span className={`mt-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${customer.role === 'admin' ? 'bg-gold/15 text-gold-dark' : 'bg-shell text-espresso'}`}>
              {customer.role}
            </span>
            <div className="mt-6 w-full space-y-3 text-left text-sm">
              <div className="flex items-center gap-2 text-espresso"><Mail className="h-4 w-4 text-espresso/40" />{customer.email}</div>
              {customer.phone && <div className="flex items-center gap-2 text-espresso"><Phone className="h-4 w-4 text-espresso/40" />{customer.phone}</div>}
              <div className="flex items-center gap-2 text-espresso-soft"><Calendar className="h-4 w-4" /> Member since {formatDate(customer.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-espresso">Appointments</h3>
              <span className="rounded-full bg-shell px-3 py-1 text-xs text-espresso-soft">{appointments.length}</span>
            </div>
            {appointments.length === 0 ? (
              <p className="mt-4 text-sm text-espresso-soft">No appointments.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {appointments.map((a) => (
                  <li key={a._id} className="rounded-xl bg-shell px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-espresso">{a.service}</span>
                      <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-dark">{a.status}</span>
                    </div>
                    <div className="mt-1 text-espresso-soft">{a.date} at {a.time}</div>
                    {a.adminNotes && <div className="mt-2 text-xs text-espresso-soft">Note: {a.adminNotes}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-espresso">Enquiries</h3>
              <span className="rounded-full bg-shell px-3 py-1 text-xs text-espresso-soft">{enquiries.length}</span>
            </div>
            {enquiries.length === 0 ? (
              <p className="mt-4 text-sm text-espresso-soft">No enquiries.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {enquiries.map((e) => (
                  <li key={e._id} className="rounded-xl bg-shell px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-espresso">{e.subject || 'General enquiry'}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] ${e.status === 'pending' ? 'bg-amber-100 text-amber-700' : e.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-shell text-espresso'}`}>
                        {e.status}
                      </span>
                    </div>
                    {e.service && <div className="mt-1 text-espresso-soft">Service: {e.service}</div>}
                    <div className="mt-1 truncate text-espresso-soft">{e.message}</div>
                    <div className="mt-2 text-xs text-espresso-soft">{formatDate(e.createdAt)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}