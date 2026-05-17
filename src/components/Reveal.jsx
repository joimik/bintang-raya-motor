import React from 'react';
import { motion } from 'framer-motion';

// Drop-in scroll-reveal wrapper. Fades + slides up when the section enters
// the viewport. Use sparingly to avoid making the page feel chatty.
export default function Reveal({ children, delay = 0, y = 28, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.21, 0.6, 0.32, 0.99], delay }}
    >
      {children}
    </motion.div>
  );
}
