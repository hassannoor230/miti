import { Star } from 'lucide-react';

export default function Stars({ rating = 5, className = 'h-4 w-4' }) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${className} ${i < n ? 'fill-gold text-gold' : 'text-espresso/20'}`} aria-hidden />
      ))}
    </span>
  );
}
