import React, { useEffect, useRef } from 'react';
import './CursorFx.css';

// One unified mouse-effects system:
//  - small red cursor ring follows the pointer
//  - on dark sections (.fx-dark), the cursor grows into a soft glow spotlight
//  - elements with .magnetic gently pull toward the cursor when nearby
// Disabled on touch devices.
export default function CursorFx() {
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const x = useRef(0);
  const y = useRef(0);
  const isTouch = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    isTouch.current = window.matchMedia('(hover: none)').matches;
    if (isTouch.current) return;

    document.body.classList.add('has-cursor-fx');

    const onMove = (e) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;

      // Magnetic pull on .magnetic elements within 90px
      document.querySelectorAll('.magnetic').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const k = (1 - dist / 110) * 0.35;
          el.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
        } else {
          el.style.transform = '';
        }
      });

      // Toggle "in-dark" state based on hovered section
      const target = e.target instanceof Element ? e.target : null;
      const inDark = target?.closest('.fx-dark');
      ringRef.current?.classList.toggle('is-dark', !!inDark);
      glowRef.current?.classList.toggle('is-visible', !!inDark);

      // Larger ring when over interactive elements
      const interactive = target?.closest('a, button, .car-card, .magnetic, [role="button"]');
      ringRef.current?.classList.toggle('is-hover', !!interactive);
    };

    const tick = () => {
      x.current += (targetX.current - x.current) * 0.18;
      y.current += (targetY.current - y.current) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x.current}px, ${y.current}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${targetX.current}px, ${targetY.current}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('has-cursor-fx');
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
