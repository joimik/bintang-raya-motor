import React, { useMemo } from 'react';
import { cars } from '../data/cars';
import './TickerStrip.css';

// Thin scrolling strip at the very top of the page — like a stock ticker but
// for car listings. Shows brand/model + price.
export default function TickerStrip() {
  const items = useMemo(() => {
    // Sort by recency and pick first 14 — varied enough to feel "live"
    return [...cars]
      .filter((c) => c.price > 0)
      .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      .slice(0, 14);
  }, []);

  const track = [...items, ...items];

  const fmt = (n) => `Rp ${(n / 1_000_000).toFixed(0)} jt`;

  return (
    <div className="ticker-strip" aria-hidden="true">
      <div className="ticker-label">LIVE</div>
      <div className="ticker-track">
        {track.map((c, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-arrow">▲</span>
            <span className="ticker-name">
              {c.brand} {c.model || ''} {c.year}
            </span>
            <span className="ticker-price">{fmt(c.price)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
