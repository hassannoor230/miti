export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function waLink(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || "Hi Miti Beauty, I'd like to enquire about booking an appointment.")}`;
}

export function telLink(phoneIntl) {
  return `tel:${String(phoneIntl || '').replace(/\s/g, '')}`;
}

export function priceLabel(price) {
  const p = String(price || '').trim();
  return p ? p : 'Price available on enquiry';
}

export function formatDate(value) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value || '');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return String(value || '');
  }
}

export function stars(rating) {
  return '★★★★★'.slice(0, Math.max(0, Math.min(5, Number(rating) || 0)));
}
