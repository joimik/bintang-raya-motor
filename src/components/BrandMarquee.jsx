import React, { useMemo } from 'react';
import { cars } from '../data/cars';
import './BrandMarquee.css';

// Infinite-scrolling row of brand names. Doubled track so the loop seam is
// invisible. Pure CSS animation — no JS tick needed.
export default function BrandMarquee() {
  const brands = useMemo(() => {
    return Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))).sort();
  }, []);

  // Duplicate so the marquee loops seamlessly
  const track = [...brands, ...brands];

  return (
    <div className="brand-marquee" aria-hidden="true">
      <div className="brand-marquee-fade brand-marquee-fade-l" />
      <div className="brand-marquee-track">
        {track.map((b, i) => (
          <span key={i} className="brand-marquee-item">
            {b}
            <span className="brand-marquee-dot">★</span>
          </span>
        ))}
      </div>
      <div className="brand-marquee-fade brand-marquee-fade-r" />
    </div>
  );
}
