'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, MessageSquare, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'pending', 'replied', 'closed'];

function statusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-gold/15 text-gold-dark';
    case 'replied': return 'bg-blue-50 text-blue-700';
    case 'closed': return 'bg-espresso/10 text-espresso';
    default: return 'bg-shell text-espresso-soft';
  }
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [replyMap, setReplyMap] = useState({});
  const [replyStatusMap, setReplyStatusMap] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.admin.enquiries();
        if (mounted) setEnquiries(res.data || res || []);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesFilter = filter === 'all' || e.status === filter;
      if (!matchesFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (e.name || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.subject || '').toLowerCase().includes(q) ||
        (e.service || '').toLowerCase().includes(q)
      );
    });
  }, [enquiries, filter, search]);

  async function handleReply(id) {
    const message = replyMap[id] || '';
    const status = replyStatusMap[id] || 'replied';
    if (!message.trim()) return;
    try {
      const res = await api.admin.replyEnquiry(id, message, status);
      setEnquiries((list) =>
        list.map((e) => {
          if (e._id !== id) return e;
          const updated = res.data || e;
          if (!updated.replies) updated.replies = [];
          updated.replies = [
            ...(Array.isArray(updated.replies) ? updated.replies : []),
            { message, status, date: new Date().toISOString() },
          ];
          updated.status = status;
          return updated;
        })
      );
      setReplyingId(null);
      setReplyMap((m) => ({ ...m, [id]: '' }));
      setReplyStatusMap((m) => ({ ...m, [id]: 'replied' }));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-espresso">Enquiries</h1>
        <p className="text-sm text-espresso-soft">Manage customer enquiries and responses.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                filter === s ? 'bg-espresso text-cream' : 'bg-white text-espresso hover:bg-shell'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, service…"
            className="w-full rounded-full border border-espresso/10 bg-white py-2.5 pl-10 pr-4 text-sm md:w-72"
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-shell" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-display text-lg text-espresso">Failed to load enquiries</p>
            <p className="mt-1 text-sm text-espresso-soft">{error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); }}
              className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-cream transition hover:bg-rosewood-dark"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-espresso-soft">
            No enquiries found.
          </p>
        ) : (
          <ul className="divide-y divide-espresso/5">
            {filtered.map((e) => {
              const expanded = expandedRows.has(e._id);
              const isReplying = replyingId === e._id;
              return (
                <li key={e._id}>
                  <button
                    onClick={() => {
                      setExpandedRows((prev) => {
                        const next = new Set(prev);
                        if (next.has(e._id)) next.delete(e._id);
                        else next.add(e._id);
                        return next;
                      });
                    }}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-shell/60"
                  >
                    <span className="min-w-0">
                      <span className="font-medium text-espresso">{e.name}</span>
                      <span className="ml-2 text-xs text-espresso-soft">{e.email}</span>
                      <span className="block truncate text-xs text-espresso-soft">
                        {e.subject}{e.service ? ` — ${e.service}` : ''}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-espresso-soft">{formatDate(e.createdAt)}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${statusBadgeClass(e.status)}`}>
                        {e.status}
                      </span>
                      {expanded ? <MessageSquare className="h-4 w-4 text-rosewood" /> : <ChevronDown className="h-4 w-4 text-espresso/30" />}
                    </span>
                  </button>
                  {expanded && (
                    <div className="border-t border-espresso/5 bg-shell/20 px-5 pb-5">
                      <div className="mt-4 space-y-3">
                        {e.service && (
                          <p className="text-sm text-espresso-soft">Service: <span className="text-espresso">{e.service}</span></p>
                        )}
                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.14em] text-espresso-soft mb-2">Message</p>
                          <p className="whitespace-pre-wrap text-sm text-espresso">{e.message}</p>
                        </div>
                        {e.replies && e.replies.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.14em] text-espresso-soft">Replies</p>
                            {e.replies.map((r, i) => (
                              <div key={i} className="rounded-xl bg-white p-4">
                                <div className="flex items-center justify-between">
                                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ${statusBadgeClass(r.status || 'replied')}`}>
                                    {r.status || 'replied'}
                                  </span>
                                  <span className="text-xs text-espresso-soft">{formatDate(r.date)}</span>
                                </div>
                                <p className="mt-2 text-sm text-espresso">{r.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 border-t border-espresso/10 pt-4">
                        {isReplying ? (
                          <div className="space-y-3">
                            <textarea
                              rows={3}
                              value={replyMap[e._id] || ''}
                              onChange={(ev) => setReplyMap((m) => ({ ...m, [e._id]: ev.target.value }))}
                              placeholder="Write your reply…"
                              className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso"
                            />
                            <div className="flex items-center gap-3">
                              <select
                                value={replyStatusMap[e._id] || 'replied'}
                                onChange={(ev) => setReplyStatusMap((m) => ({ ...m, [e._id]: ev.target.value }))}
                                className="rounded-full border border-espresso/15 bg-white px-4 py-2 text-xs uppercase tracking-[0.12em] text-espresso"
                              >
                                <option value="replied">Replied</option>
                                <option value="closed">Closed</option>
                              </select>
                              <button
                                onClick={() => handleReply(e._id)}
                                className="rounded-full bg-espresso px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-cream transition hover:bg-rosewood-dark"
                              >
                                Send Reply
                              </button>
                              <button
                                onClick={() => setReplyingId(null)}
                                className="rounded-full bg-white px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-espresso border border-espresso/15 transition hover:bg-shell"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingId(e._id);
                              setReplyMap((m) => ({ ...m, [e._id]: '' }));
                              setReplyStatusMap((m) => ({ ...m, [e._id]: e.status === 'closed' ? 'closed' : 'replied' }));
                            }}
                            className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-rosewood border border-rosewood/30 transition hover:bg-rosewood/5"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
