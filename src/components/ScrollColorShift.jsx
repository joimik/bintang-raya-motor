import { useEffect } from 'react';

// Smoothly shifts the body background warmth as the user scrolls down the page.
// Uses scroll progress 0..1 to interpolate between #FAFAF9 (cool warm-white)
// and #FDF6E3 (warm cream). Subtle, but adds depth across long pages.
export default function ScrollColorShift() {
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const t = Math.min(1, window.scrollY / max);
      // Interpolate from #FAFAF9 to #FDF1E0
      const lerp = (a, b) => Math.round(a + (b - a) * t);
      const r = lerp(0xfa, 0xfd);
      const g = lerp(0xfa, 0xf1);
      const b = lerp(0xf9, 0xe0);
      document.documentElement.style.setProperty(
        '--bg-shift',
        `rgb(${r}, ${g}, ${b})`
      );
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
