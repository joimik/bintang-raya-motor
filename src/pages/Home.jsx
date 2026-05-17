import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import AnimatedHero from '../components/AnimatedHero';
import BrandBar from '../components/BrandBar';
import CarCard from '../components/CarCard';
import Reveal from '../components/Reveal';
import { cars } from '../data/cars';
import './Home.css';

export default function Home() {
  const featuredCars = cars.filter((c) => c.isFeatured).slice(0, 3);
  const budgetCars = cars
    .filter((c) => c.price > 0 && c.price < 150_000_000)
    .sort((a, b) => a.price - b.price)
    .slice(0, 6);

  return (
    <div className="home">
      <AnimatedHero />

      {/* Trust strip */}
      <section className="trust-strip">
        <div className="container trust-grid">
          {[
            { Icon: CheckCircle, h: 'Kualitas Terjamin', p: 'Inspeksi internal pada setiap unit sebelum dijual' },
            { Icon: ShieldCheck, h: 'Dokumen Lengkap', p: 'BPKB, STNK, & faktur asli — pajak hidup' },
            { Icon: MapPin, h: 'Showroom Bandung', p: 'Jln. Pungkur No.199 — buka setiap hari' },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="trust-item">
                <item.Icon className="trust-icon" />
                <div>
                  <h3>{item.h}</h3>
                  <p>{item.p}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Brand inventory bar */}
      <section className="home-section">
        <div className="container">
          <Reveal>
            <BrandBar />
          </Reveal>
        </div>
      </section>

      {/* Featured */}
      <section className="home-section bg-dim">
        <div className="container">
          <Reveal>
            <h2 className="section-title">Pilihan Kami</h2>
          </Reveal>
          <div className="grid grid-cols-3">
            {featuredCars.map((car, i) => (
              <Reveal key={car.id} delay={i * 0.08}>
                <CarCard car={car} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <Link to="/mobil" className="btn btn-primary">
                Lihat Semua {cars.length} Mobil <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Budget cars (replaces the empty "Bajet Terbatas" block) */}
      {budgetCars.length > 0 && (
        <section className="home-section">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div>
                  <h2 className="section-title-left">Mobil Dibawah Rp 150 Juta</h2>
                  <p className="section-sub">
                    {budgetCars.length} pilihan terbaik untuk bajet terbatas — semua siap pakai.
                  </p>
                </div>
                <Link to="/mobil" className="btn btn-outline">
                  Lihat Semua →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-3">
              {budgetCars.map((car, i) => (
                <Reveal key={car.id} delay={i * 0.06}>
                  <CarCard car={car} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Verified trust block */}
      <section className="home-section bg-dim">
        <div className="container">
          <Reveal>
            <div className="verified-block">
              <div className="verified-badge">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2>Verified Seller di OLX sejak Oktober 2016</h2>
                <p>
                  Profil OLX kami telah aktif selama 9+ tahun dengan ratusan transaksi.
                  Stok mobil di website ini disinkronkan langsung dari OLX setiap hari —
                  apa yang Anda lihat di sini adalah yang benar-benar tersedia di showroom.
                </p>
                <a
                  href="https://www.olx.co.id/profile/60978918"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-olx"
                >
                  Cek Profil OLX Kami →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
