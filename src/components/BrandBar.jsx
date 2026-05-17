import React from 'react';
import { Link } from 'react-router-dom';
import { cars } from '../data/cars';
import './BrandBar.css';

export default function BrandBar() {
  // Count cars per brand, sorted high → low
  const counts = cars.reduce((m, c) => {
    const b = c.brand || 'Lainnya';
    m[b] = (m[b] || 0) + 1;
    return m;
  }, {});
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const total = cars.length;

  return (
    <div className="brand-bar">
      <div className="brand-bar-head">
        <h3>Stok Per Merek</h3>
        <span className="brand-bar-total">{total} mobil siap dilihat</span>
      </div>
      <div className="brand-bar-chips">
        {sorted.map(([brand, n]) => (
          <Link
            key={brand}
            to={`/mobil?brand=${encodeURIComponent(brand)}`}
            className="brand-chip"
            style={{ '--w': `${(n / sorted[0][1]) * 100}%` }}
          >
            <span className="brand-chip-fill" aria-hidden="true" />
            <span className="brand-chip-name">{brand}</span>
            <span className="brand-chip-count">{n}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
