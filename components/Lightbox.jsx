'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Accessible lightbox: keyboard navigation (arrows/escape),
 * focus on open, basic touch swipe support.
 */
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const [touchX, setTouchX] = useState(null);
  const closeRef = useRef(null);
  const item = items[index];

  const next = useCallback(() => onNavigate((index + 1) % items.length), [index, items.length, onNavigate]);
  const prev = useCallback(
    () => onNavigate((index - 1 + items.length) % items.length),
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, next, prev]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-espresso/95 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.altText || item.title || 'Gallery image'}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-cream transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 md:left-8 rounded-full bg-white/10 p-3 text-cream transition hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 md:right-8 rounded-full bg-white/10 p-3 text-cream transition hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.figure
          key={item._id || index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="max-h-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) {
              if (dx < 0) next();
              else prev();
            }
            setTouchX(null);
          }}
        >
          <Image
            src={item.image}
            alt={item.altText || item.title || 'Miti Beauty salon work'}
            width={1000}
            height={1200}
            className="max-h-[76vh] w-auto rounded-2xl object-contain"
          />
          <figcaption className="mt-3 text-center text-sm text-cream/80">
            {item.title || item.category}
            <span className="ml-3 text-cream/50">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
}
