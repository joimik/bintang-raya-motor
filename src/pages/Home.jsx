import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import AnimatedHero from '../components/AnimatedHero';
import BrandBar from '../components/BrandBar';
import BrandMarquee from '../components/BrandMarquee';
import BentoFeatured from '../components/BentoFeatured';
import Turntable from '../components/Turntable';
import CarCard from '../components/CarCard';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { cars } from '../data/cars';
import './Home.css';

export default function Home() {
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

      {/* Bento Featured */}
      <section className="home-section">
        <div className="container">
          <Reveal>
            <SectionHeader
              num="01"
              label="Spotlight"
              title="Pilihan Kami"
              sub="Mobil pilihan dengan kondisi terbaik, dipilih langsung dari stok kami."
            />
          </Reveal>
          <Reveal>
            <BentoFeatured />
          </Reveal>
          <Reveal>
            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <Link to="/mobil" className="btn btn-primary magnetic">
                Lihat Semua {cars.length} Mobil <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brand marquee — full-bleed dark cinematic strip */}
      <BrandMarquee />

      {/* 360 turntable spotlight */}
      <Reveal>
        <Turntable />
      </Reveal>

      {/* Budget cars */}
      {budgetCars.length > 0 && (
        <section className="home-section">
          <div className="container">
            <Reveal>
              <SectionHeader
                num="02"
                label="Bajet Cerdas"
                title="Mobil Dibawah Rp 150 Juta"
                sub={`${budgetCars.length} pilihan terbaik untuk bajet terbatas — semua siap pakai.`}
              />
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
      <section className="home-section bg-dim fx-dark-light">
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
                  className="btn btn-olx magnetic"
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
