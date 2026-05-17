import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cars } from '../data/cars';
import './Turntable.css';

// "360° Turntable" — cycles through up to 10 OLX photos of a featured car
// at ~12 FPS. Pauses on hover and lets the user drag to scrub.
export default function Turntable() {
  const featured = cars.find((c) => (c.images?.length || 0) >= 6 && c.isFeatured) || cars[0];
  const frames = (featured?.images || []).slice(0, 10);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || frames.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % frames.length), 85);
    return () => clearInterval(t);
  }, [paused, frames.length]);

  if (!featured || frames.length === 0) return null;

  const onDrag = (e) => {
    const target = e.currentTarget;
    const r = target.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - r.left;
    const ratio = Math.max(0, Math.min(1, x / r.width));
    setIdx(Math.floor(ratio * (frames.length - 1)));
  };

  return (
    <div className="turntable-section fx-dark">
      <div className="container turntable-inner">
        <div
          className="turntable-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onMouseMove={(e) => paused && onDrag(e)}
          onTouchMove={(e) => {
            setPaused(true);
            onDrag(e);
          }}
          onTouchEnd={() => setPaused(false)}
        >
          {frames.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={featured.name}
              loading="lazy"
              className={`turntable-img ${i === idx ? 'is-active' : ''}`}
            />
          ))}
          <div className="turntable-overlay">
            <span className="turntable-badge">360° VIEW</span>
            <div className="turntable-progress">
              {frames.map((_, i) => (
                <span key={i} className={`turntable-dot ${i === idx ? 'is-active' : ''}`} />
              ))}
            </div>
            <p className="turntable-hint">Geser untuk memutar</p>
          </div>
        </div>
        <div className="turntable-meta">
          <span className="turntable-tag">Spotlight Bulan Ini</span>
          <h2>{featured.name}</h2>
          <div className="turntable-price">{featured.priceCash}</div>
          <p className="turntable-desc">
            {featured.year} · {featured.transmission} · {featured.fuel} · {featured.mileage}
          </p>
          <Link to={`/mobil/${featured.id}`} className="btn btn-primary btn-lg magnetic">
            Lihat Detail Lengkap →
          </Link>
        </div>
      </div>
    </div>
  );
}
