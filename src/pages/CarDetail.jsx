import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cars, formatPrice } from '../data/cars';
import { ArrowLeft, Calendar, Gauge, Settings2, ShieldCheck, MapPin, Phone, CarFront, Shield, Banknote } from 'lucide-react';
import './CarDetail.css';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === parseInt(id));
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  if (!car) {
    return (
      <div className="container text-center py-5">
        <h2>Mobil tidak ditemukan</h2>
        <Link to="/mobil" className="btn btn-primary mt-4">Kembali ke Katalog</Link>
      </div>
    );
  }

  const priceDisplay = car.price === 0 ? car.priceCash : formatPrice(car.price);
  const message = `Halo Bintang Motor, saya tertarik dengan mobil ${car.name} tahun ${car.year} seharga ${priceDisplay}. Apakah masih tersedia?`;
  const whatsappUrl = `https://wa.me/62811225039?text=${encodeURIComponent(message)}`;

  return (
    <div className="car-detail py-5">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="detail-layout">
          {/* Main Content Area */}
          <div className="detail-main">
            <div className="gallery-container">
              <img src={(car.images || [car.image])[activeImage]} alt={car.name} className="main-image" />
              <div className="thumbnail-grid">
                {(car.images || [car.image]).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            </div>

            <div className="info-card">
              <h2 className="mb-4">Deskripsi Kondisi</h2>
              <div className="condition-box">
                <p>{car.description}</p>
              </div>

              <div className="features-grid mt-4">
                <div className="feature-item">
                  <Shield size={24} className="feature-icon" />
                  <h4>Garansi Mesin</h4>
                  <p>Berlaku 30 Hari</p>
                </div>
                <div className="feature-item">
                  <Banknote size={24} className="feature-icon" />
                  <h4>Bebas Banjir & Tabrakan</h4>
                  <p>100% Uang Kembali</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-card summary-card">
              <h1 className="detail-title">{car.name}</h1>
              <div className="detail-price">{priceDisplay}</div>
              
              <div className="specs-list">
                <div className="spec-row">
                  <div className="spec-label"><Calendar size={18} /> Tahun</div>
                  <div className="spec-value">{car.year}</div>
                </div>
                <div className="spec-row">
                  <div className="spec-label"><Gauge size={18} /> Kilometer</div>
                  <div className="spec-value">{car.mileage}</div>
                </div>
                <div className="spec-row">
                  <div className="spec-label"><Settings2 size={18} /> Transmisi</div>
                  <div className="spec-value">{car.transmission}</div>
                </div>
                <div className="spec-row">
                  <div className="spec-label"><ShieldCheck size={18} /> Status Pajak</div>
                  <div className="spec-value pajak-status">{car.tax}</div>
                </div>
                <div className="spec-row">
                  <div className="spec-label"><CarFront size={18} /> Merek</div>
                  <div className="spec-value">{car.brand}</div>
                </div>
              </div>

              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp w-100 mt-4 cta-large">
                <Phone size={20} /> Beli via WhatsApp
              </a>

              <div className="olx-spacer"></div>

              <a
                href="https://www.olx.co.id/profile/60978918"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-olx w-100 mt-5 cta-large"
              >
                Cek Lebih Lengkap Di OLX
              </a>

              <p className="credit-sim text-center mt-4">
                <em>*Ingin kredit? Hubungi kami untuk simulasi DP & Cicilan.</em>
              </p>
            </div>

            <div className="sidebar-card location-card mt-4">
              <h3>Lokasi Unit</h3>
              <div className="location-info mt-4">
                <MapPin size={24} className="location-icon" />
                <div>
                  <strong>Bintang Motor Bandung</strong>
                  <p>Jln. Pungkur No.199,<br/>Bandung 40251</p>
                </div>
              </div>
              <Link to="/kontak" className="btn btn-outline w-100 mt-4">Lihat Peta Lokasi</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
