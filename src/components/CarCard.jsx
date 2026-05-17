import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gauge, Settings2, Fuel } from 'lucide-react';
import './CarCard.css';

function formatPriceShort(price) {
  if (!price || price <= 0) return null;
  if (price >= 1_000_000_000) {
    const m = price / 1_000_000_000;
    return `Rp ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)} M`;
  }
  const jt = price / 1_000_000;
  return `Rp ${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(0)} jt`;
}

function isRecentlyAdded(addedAt) {
  if (!addedAt) return false;
  const days = (Date.now() - new Date(addedAt).getTime()) / 86_400_000;
  return days <= 7;
}

export default function CarCard({ car }) {
  const priceText = formatPriceShort(car.price) || car.priceCash;
  const isNew = isRecentlyAdded(car.addedAt);

  return (
    <Link to={`/mobil/${car.id}`} className="car-card-link">
      <article className="car-card animate-fade-in">
        <div className="car-image-wrapper">
          <img src={car.image} alt={car.name} loading="lazy" className="car-image" />
          <div className="car-badges">
            {isNew && <span className="car-badge badge-new">✨ Baru Masuk</span>}
            {car.isFeatured && !isNew && <span className="car-badge badge-featured">Pilihan</span>}
          </div>
          <div className="car-price-overlay">{priceText}</div>
        </div>

        <div className="car-content">
          <h3 className="car-name">{car.name}</h3>

          <div className="car-specs">
            <span className="spec-item">
              <Calendar size={14} />
              {car.year}
            </span>
            <span className="spec-item">
              <Gauge size={14} />
              {car.mileage}
            </span>
            <span className="spec-item">
              <Settings2 size={14} />
              {car.transmission}
            </span>
            <span className="spec-item">
              <Fuel size={14} />
              {car.fuel}
            </span>
          </div>

          <div className="car-card-footer">
            <span className="car-tax-pill">📋 Pajak {car.tax}</span>
            <span className="car-detail-link">Lihat Detail →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
