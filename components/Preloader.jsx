'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-espresso"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-lux text-gold-light">Bristol · Horfield</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl text-cream">
              Miti <span className="italic text-blush">Beauty</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="mt-6 h-px w-48 origin-left bg-gradient-to-r from-gold via-blush to-rosewood"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[11px] uppercase tracking-lux text-cream/60"
          >
            Beauty, Confidence &amp; Care
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
