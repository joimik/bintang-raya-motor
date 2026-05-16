import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gauge, Settings2, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../data/cars';
import './CarCard.css';

export default function CarCard({ car }) {
  return (
    <div className="car-card animate-fade-in">
      <div className="car-image-wrapper">
        <img src={car.image} alt={car.name} className="car-image" />
        {car.isFeatured && <span className="car-badge">Rekomendasi</span>}
      </div>
      <div className="car-content">
        <div className="car-header">
          <h3 className="car-name">{car.name}</h3>
          <p className="car-price">{car.price === 0 ? car.priceCash : formatPrice(car.price)}</p>
        </div>
        
        <div className="car-specs grid grid-cols-2">
          <div className="spec-item">
            <Calendar size={16} />
            <span>{car.year}</span>
          </div>
          <div className="spec-item">
            <Gauge size={16} />
            <span>{car.mileage}</span>
          </div>
          <div className="spec-item">
            <Settings2 size={16} />
            <span>{car.transmission}</span>
          </div>
          <div className="spec-item">
            <ShieldCheck size={16} />
            <span className="truncate">{car.tax.split(',')[0]}</span>
          </div>
        </div>

        <Link to={`/mobil/${car.id}`} className="btn btn-outline btn-full">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
