import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Phone } from 'lucide-react';
import CarCard from '../components/CarCard';
import { cars } from '../data/cars';
import './Home.css';

export default function Home() {
  const featuredCars = cars.filter(car => car.isFeatured).slice(0, 3);

  const testimonials = [
    { id: 1, name: 'Budi Santoso', text: 'Beli Xpander di sini sangat memuaskan. Kondisi sesuai deskripsi, tidak ada biaya tersembunyi. Proses cepat!', rating: 5 },
    { id: 2, name: 'Siti Aminah', text: 'Showroom paling jujur di Bandung. Mobilnya benar-benar berkualitas dan harganya bersahabat. Recommended banget.', rating: 5 },
    { id: 3, name: 'Rudi Hermawan', text: 'Saya beli Avanza untuk taksi online, kondisi mesin prima. Harga juga nego sampai jadi. Sukses terus Bintang Motor.', rating: 4.5 }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text-area">
            <h1 className="hero-title">
              Kualitas & Kepuasan, <br /><span className="text-accent">Kami Utamakan</span>
            </h1>
            <p className="hero-subtitle">
              Pilihan terpercaya di Bandung. Beli mobil impian Anda dengan harga jujur, kondisi prima, dan siap pakai tanpa rasa khawatir.
            </p>
            <div className="hero-cta">
              <Link to="/mobil" className="btn btn-primary">
                Lihat Mobil <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/62811225039" target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <Phone size={18} /> Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-banner">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon"><CheckCircle /></div>
            <div>
              <h3>Kualitas Terjamin</h3>
              <p>Melewati inspeksi ketat 150+ titik</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><Star /></div>
            <div>
              <h3>Review Bintang 4.5</h3>
              <p>Dari ratusan pelanggan puas</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon" style={{fontWeight: 'bold', fontSize: '1.5rem'}}>Rp</div>
            <div>
              <h3>Harga Transparan</h3>
              <p>Mulai dari Rp 60 Jutaan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="section-title">Mobil Pilihan Kami</h2>
          <div className="grid grid-cols-3">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <div className="text-center mt-4" style={{marginTop: '3rem'}}>
            <Link to="/mobil" className="btn btn-primary">
              Lihat Semua Koleksi
            </Link>
          </div>
        </div>
      </section>

      {/* Starting Price Section */}
      <section className="starting-price-section">
        <div className="container starting-price-content">
          <h2>Punya Bajet Terbatas?</h2>
          <p>Jangan khawatir! Kami menyediakan berbagai pilihan mobil bekas berkualitas <strong>mulai dari Rp 60 jutaan</strong> yang siap pakai untuk keluarga Anda.</p>
          <Link to="/mobil" className="btn btn-accent mt-4">Cari Mobil Murah</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title">Apa Kata Mereka?</h2>
          <div className="grid grid-cols-3">
            {testimonials.map(testi => (
              <div key={testi.id} className="testimonial-card">
                <div className="stars">
                  {[...Array(Math.floor(testi.rating))].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  {testi.rating % 1 !== 0 && <Star size={18} fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }}/>}
                </div>
                <p className="testi-text">"{testi.text}"</p>
                <div className="testi-author">- {testi.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
