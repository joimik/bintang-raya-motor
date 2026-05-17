import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cars } from '../data/cars';
import './BrandBar.css';

function useInViewCount(target, durationMs = 1400) {
  const [val, setVal] = useState(0);
  const [armed, setArmed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setArmed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, target, durationMs]);

  return [ref, val];
}

function BrandChip({ brand, count, maxCount }) {
  const [ref, animated] = useInViewCount(count, 1200);
  return (
    <Link
      ref={ref}
      to={`/mobil?brand=${encodeURIComponent(brand)}`}
      className="brand-chip"
      style={{ '--w': `${(count / maxCount) * 100}%` }}
    >
      <span className="brand-chip-fill" aria-hidden="true" />
      <span className="brand-chip-name">{brand}</span>
      <span className="brand-chip-count">{animated}</span>
    </Link>
  );
}

export default function BrandBar() {
  const counts = cars.reduce((m, c) => {
    const b = c.brand || 'Lainnya';
    m[b] = (m[b] || 0) + 1;
    return m;
  }, {});
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxCount = sorted[0]?.[1] || 1;
  const total = cars.length;

  return (
    <div className="brand-bar">
      <div className="brand-bar-head">
        <h3>Stok Per Merek</h3>
        <span className="brand-bar-total">{total} mobil siap dilihat</span>
      </div>
      <div className="brand-bar-chips">
        {sorted.map(([brand, n]) => (
          <BrandChip key={brand} brand={brand} count={n} maxCount={maxCount} />
        ))}
      </div>
    </div>
  );
}
