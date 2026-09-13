/**
 * API client — calls the Express backend through Next.js rewrites (/api/*),
 * so the browser only ever talks to the same origin (preview-safe).
 */
const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.errors = data && data.errors;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body || {}) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body || {}) }),
  del: (path) => request(path, { method: 'DELETE' }),

  // multipart (image uploads)
  upload: async (path, formData, method = 'POST') => {
    const res = await fetch(`${API_BASE}${path}`, { method, credentials: 'include', body: formData });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && data.message) || 'Upload failed');
    return data;
  },

  // ---- resources ----
  settings: {
    get: () => request('/settings'),
    update: (body) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  },
  services: {
    list: (all = false) => request(all ? '/services?all=1' : '/services'),
    get: (slug) => request(`/services/${slug}`),
    create: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/services/${id}`, { method: 'DELETE' }),
  },
  reviews: {
    list: (all = false) => request(all ? '/reviews?all=1' : '/reviews'),
    create: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
  },
  gallery: {
    list: (params = '') => request(`/gallery${params}`),
    update: (id, body) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    create: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
    list: (params = '') => request(`/bookings${params}`),
    get: (id) => request(`/bookings/${id}`),
    update: (id, body) => request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    stats: () => request('/bookings/stats'),
  },
  contact: {
    create: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
    list: () => request('/contact'),
    update: (id, body) => request(`/contact/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/contact/${id}`, { method: 'DELETE' }),
  },
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/auth/logout', { method: 'POST', body: '{}' }),
    me: () => request('/auth/me'),
  },
};

/** Server-side fetch helper (build/SEO) — talks to backend directly. */
export async function serverFetch(path) {
  const base = process.env.BACKEND_URL || 'http://127.0.0.1:5001';
  const res = await fetch(`${base}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`serverFetch ${path} -> ${res.status}`);
  return res.json();
}
