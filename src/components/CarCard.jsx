import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, Gauge, Settings2, Fuel } from 'lucide-react';
import './CarCard.css';

function formatPriceShort(price) {
  if (!price || price <= 0) return null;
  if (price >= 1_000_000_000) {
    const m = price / 1_000_000_000;
    return `Rp ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)} M`;
  }
  const jt = price / 1_000_000;
  return `Rp ${jt.toFixed(0)} jt`;
}

function isRecentlyAdded(addedAt) {
  if (!addedAt) return false;
  const days = (Date.now() - new Date(addedAt).getTime()) / 86_400_000;
  return days <= 7;
}

export default function CarCard({ car }) {
  const priceText = formatPriceShort(car.price) || car.priceCash;
  const isNew = isRecentlyAdded(car.addedAt);
  const photos = (car.images && car.images.length > 0 ? car.images : [car.image]).slice(0, 4);

  const [photoIdx, setPhotoIdx] = useState(0);
  const intervalRef = useRef(null);

  // 3D tilt math — tracked as motion values for smoothness
  const mx = useMotionValue(0); // -0.5..0.5
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    stopCycle();
  };

  const startCycle = () => {
    if (photos.length < 2 || intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % photos.length);
    }, 900);
  };

  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhotoIdx(0);
  };

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  return (
    <Link to={`/mobil/${car.id}`} className="car-card-link">
      <motion.article
        className="car-card animate-fade-in"
        onMouseEnter={startCycle}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onTouchStart={startCycle}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      >
        <div className="car-image-wrapper">
          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={car.name}
              loading={i === 0 ? 'lazy' : 'lazy'}
              className={`car-image ${i === photoIdx ? 'is-active' : ''}`}
            />
          ))}

          {photos.length > 1 && (
            <div className="car-photo-dots">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`car-photo-dot ${i === photoIdx ? 'is-active' : ''}`}
                />
              ))}
            </div>
          )}

          <div className="car-badges">
            {isNew && <span className="car-badge badge-new">✨ Baru Masuk</span>}
            {car.isFeatured && !isNew && <span className="car-badge badge-featured">Pilihan</span>}
          </div>
          <div className="car-price-overlay">{priceText}</div>
        </div>

        <div className="car-content">
          <h3 className="car-name">{car.name}</h3>

          <div className="car-specs">
            <span className="spec-item"><Calendar size={14} />{car.year}</span>
            <span className="spec-item"><Gauge size={14} />{car.mileage}</span>
            <span className="spec-item"><Settings2 size={14} />{car.transmission}</span>
            <span className="spec-item"><Fuel size={14} />{car.fuel}</span>
          </div>

          <div className="car-card-footer">
            <span className="car-tax-pill">📋 Pajak {car.tax}</span>
            <span className="car-detail-link">Lihat Detail →</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
