import React from 'react';
import { Target, Shield, ThumbsUp, Users } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="about-header">
        <div className="about-overlay"></div>
        <div className="container text-center about-hero-content">
          <h1 className="text-white">Tentang Bintang Motor</h1>
          <p className="text-white mt-4" style={{fontSize: '1.25rem', opacity: 0.9}}>
            Showroom Mobil Bekas Terpercaya Pilihan Warga Bandung
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="mb-4 text-primary" style={{color: 'var(--primary-color)'}}>Dedikasi Kami Untuk Anda</h2>
              <p>
                Bintang Motor hadir di Jln. Pungkur 199, Bandung sebagai solusi terpercaya bagi Anda yang mencari mobil bekas berkualitas. Kami berkomitmen untuk mendobrak stigma negatif pasar mobil bekas dengan menawarkan <strong>transparansi total, kejujuran, dan kualitas unggul</strong>.
              </p>
              <p>
                Setiap kendaraan yang masuk ke showroom kami telah melalui proses inspeksi ketat oleh mekanik berpengalaman. Kami memastikan tidak ada riwayat tabrakan fatal maupun banjir. Service record bengkel resmi tersedia untuk setiap unit.
              </p>
              <p>
                Bagi kami, menjual mobil bukan hanya sekadar transaksi, tetapi tentang membangun kepercayaan jangka panjang dengan setiap pelanggan. <strong>Kualitas & Kepuasan Kami Utamakan.</strong>
              </p>
            </div>
            <div className="about-image-wrapper">
              <img
                src="/images/showroom-hero.jpg"
                alt="Showroom Bintang Motor"
                style={{
                  objectFit: 'contain',
                  backgroundColor: 'transparent',
                  padding: '1rem',
                  borderRadius: '8px'
                }}
                className="about-image shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center">Nilai Inti Kami</h2>
          <div className="grid grid-cols-4 mt-4">
            <div className="value-card text-center">
              <div className="value-icon"><Shield size={32} /></div>
              <h3>Terpercaya</h3>
              <p>Dokumen lengkap dan absah. Tidak ada biaya terselubung dalam setiap transaksi.</p>
            </div>
            <div className="value-card text-center">
              <div className="value-icon"><Target size={32} /></div>
              <h3>Kualitas</h3>
              <p>Seleksi ketat 150+ titik inspeksi sebelum unit dipajang di showroom.</p>
            </div>
            <div className="value-card text-center">
              <div className="value-icon"><ThumbsUp size={32} /></div>
              <h3>Siap Pakai</h3>
              <p>Mobil dipoles bersih dan diservis dasar sehingga siap menemani perjalanan Anda.</p>
            </div>
            <div className="value-card text-center">
              <div className="value-icon"><Users size={32} /></div>
              <h3>Pelayanan</h3>
              <p>Tim yang ramah, siap membantu konsultasi mulai dari budget hingga test drive.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
