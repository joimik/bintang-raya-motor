import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import { cars } from '../data/cars';
import './BentoFeatured.css';

function formatJt(price) {
  if (!price) return '—';
  if (price >= 1_000_000_000) return `Rp ${(price / 1_000_000_000).toFixed(2)} M`;
  return `Rp ${(price / 1_000_000).toFixed(0)} jt`;
}

function TiltLink({ to, className, children, ariaLabel }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <Link to={to} aria-label={ariaLabel} className={className}>
      <motion.div
        className="bento-tilt"
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      >
        {children}
      </motion.div>
    </Link>
  );
}

export default function BentoFeatured() {
  const featured = cars.filter((c) => c.isFeatured && c.image);
  // Pick: 1 hero, 2 mid, 2 small. Fall back gracefully if fewer.
  const [a, b, c, d, e] = [
    featured[0] || cars[0],
    featured[1] || cars[1],
    featured[2] || cars[2],
    cars.filter((x) => x.price > 0).sort((p, q) => q.price - p.price)[0],
    cars.filter((x) => x.price > 0).sort((p, q) => p.price - q.price)[0],
  ];

  return (
    <div className="bento-featured">
      <TiltLink to={`/mobil/${a.id}`} className="bento-cell bento-hero" ariaLabel={a.name}>
        <img src={a.image} alt={a.name} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-content">
          <span className="bento-badge">PILIHAN UTAMA</span>
          <h3>{a.name}</h3>
          <div className="bento-bottom">
            <span className="bento-price">{formatJt(a.price)}</span>
            <span className="bento-cta">Lihat <MoveRight size={16} /></span>
          </div>
        </div>
      </TiltLink>

      <TiltLink to={`/mobil/${b.id}`} className="bento-cell bento-mid" ariaLabel={b.name}>
        <img src={b.image} alt={b.name} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-content">
          <h3>{b.name}</h3>
          <span className="bento-price">{formatJt(b.price)}</span>
        </div>
      </TiltLink>

      <TiltLink to={`/mobil/${c.id}`} className="bento-cell bento-mid" ariaLabel={c.name}>
        <img src={c.image} alt={c.name} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-content">
          <h3>{c.name}</h3>
          <span className="bento-price">{formatJt(c.price)}</span>
        </div>
      </TiltLink>

      <TiltLink to={`/mobil/${d.id}`} className="bento-cell bento-small bento-premium" ariaLabel={d.name}>
        <img src={d.image} alt={d.name} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-content">
          <span className="bento-tag">⭐ TERMAHAL</span>
          <h4>{d.name}</h4>
          <span className="bento-price-sm">{formatJt(d.price)}</span>
        </div>
      </TiltLink>

      <TiltLink to={`/mobil/${e.id}`} className="bento-cell bento-small bento-budget" ariaLabel={e.name}>
        <img src={e.image} alt={e.name} loading="lazy" />
        <div className="bento-shade" />
        <div className="bento-content">
          <span className="bento-tag">💰 TERMURAH</span>
          <h4>{e.name}</h4>
          <span className="bento-price-sm">{formatJt(e.price)}</span>
        </div>
      </TiltLink>
    </div>
  );
}
