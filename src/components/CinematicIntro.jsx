import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CinematicIntro.css';

const STORAGE_KEY = 'brm_intro_seen_v1';

export default function CinematicIntro() {
  // Show only once per browser. Skippable by clicking anywhere.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={() => setShow(false)}
        >
          <div className="intro-stage">
            <motion.div
              className="intro-star"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.21, 0.6, 0.32, 0.99] }}
            >
              ★
            </motion.div>
            <div className="intro-words">
              {'BINTANG MOTOR'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.04, duration: 0.4 }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="intro-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              Kualitas & Kepuasan Kami Utamakan
            </motion.div>
            <motion.div
              className="intro-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 1.6, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
