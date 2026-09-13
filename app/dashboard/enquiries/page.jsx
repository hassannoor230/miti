'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';

const ENQ_STATUS = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  replied: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  closed: 'bg-shell text-espresso ring-espresso/15',
};

const ENQ_LABELS = {
  pending: 'Pending',
  replied: 'Replied',
  closed: 'Closed',
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyTargets, setReplyTargets] = useState({});
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.customer.enquiries.list();
        if (mounted) setEnquiries(res.data || []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load enquiries.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function sendReply(id, message) {
    setReplyLoading(true);
    setReplyError('');
    try {
      await api.customer.enquiries.reply(id, message);
      const res = await api.customer.enquiries.list();
      setEnquiries(res.data || []);
      setReplyTargets((prev) => ({ ...prev, [id]: '' }));
    } catch (e) {
      setReplyError(e.message || 'Failed to send reply.');
    } finally {
      setReplyLoading(false);
    }
  }

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <PageHero eyebrow="My Enquiries" title="Your Messages" description="View your enquiries and follow up with our team." />
      <div className="mx-auto max-w-4xl px-6 md:px-8 pb-20">
        {loading && (
          <div className="mt-10 space-y-6">
            {[1, 2].map((i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-white shadow-card" />)}
          </div>
        )}
        {!loading && error && (
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-card text-center">
            <p className="text-rosewood-dark" role="alert">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-rosewood hover:underline">Try again</button>
          </div>
        )}
        {!loading && !error && enquiries.length === 0 && (
          <Reveal className="mt-10 text-center">
            <div className="rounded-3xl bg-white p-12 shadow-card">
              <p className="font-display text-2xl text-espresso">No enquiries yet</p>
              <p className="mt-2 text-espresso-soft">You haven't sent any messages yet.</p>
            </div>
          </Reveal>
        )}
        {!loading && !error && enquiries.length > 0 && (
          <div className="mt-10 space-y-6">
            {enquiries.map((enq, idx) => (
              <Reveal key={enq._id || enq.id || idx} delay={idx * 0.08}>
                <div className="rounded-3xl bg-white p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl text-espresso">{enq.subject || 'General enquiry'}</p>
                      {enq.service && <p className="mt-0.5 text-sm text-rosewood">{enq.service}</p>}
                      <p className="mt-0.5 text-xs text-espresso-soft/70">Submitted {formatDate(enq.submitted)}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${ENQ_STATUS[enq.status] || ENQ_STATUS.pending}`}>
                      {ENQ_LABELS[enq.status] || enq.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-espresso-soft leading-relaxed">{enq.message || ''}</p>

                  {enq.replies && enq.replies.length > 0 && (
                    <div className="mt-5 border-t border-espresso/10 pt-4 space-y-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-espresso-soft">Conversation</p>
                      {enq.replies.map((reply, ri) => (
                        <div key={ri} className={`rounded-2xl px-4 py-3 ${reply.isAdmin ? 'bg-shell' : 'bg-sand'}`}>
                          <p className="text-xs uppercase tracking-[0.16em] text-espresso-soft">{reply.isAdmin ? 'Admin' : 'You'}</p>
                          <p className="mt-1 text-sm text-espresso">{reply.message || ''}</p>
                          <p className="mt-1 text-xs text-espresso-soft/60">{formatDate(reply.created || reply.sentAt || reply.date)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5">
                    <textarea
                      value={replyTargets[enq._id || enq.id] || ''}
                      onChange={(e) => setReplyTargets((prev) => ({ ...prev, [enq._id || enq.id]: e.target.value }))}
                      placeholder="Send a follow-up reply…"
                      rows={2}
                      className="w-full rounded-xl border border-espresso/15 px-4 py-3 text-sm text-espresso focus:border-rosewood"
                    />
                    <button
                      onClick={() => sendReply(enq._id || enq.id, replyTargets[enq._id || enq.id])}
                      disabled={replyLoading || !replyTargets[enq._id || enq.id]?.trim()}
                      className="mt-2 rounded-full bg-espresso px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream transition hover:bg-rosewood-dark disabled:opacity-50"
                    >
                      {replyLoading ? 'Sending…' : 'Reply'}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {replyError && <p className="fixed bottom-6 right-6 z-50 text-sm text-rosewood-dark bg-white px-4 py-2 rounded-xl shadow-card" role="alert">{replyError}</p>}
    </>
  );
}
