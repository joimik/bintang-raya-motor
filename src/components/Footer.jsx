import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container grid grid-cols-4 footer-top">
        <div className="footer-col brand-col">
          <Link to="/" className="logo footer-logo">
            <img src="/images/logo.png" alt="Bintang Motor" className="logo-img-footer" />
          </Link>
          <p className="footer-desc">
            Showroom mobil bekas terpercaya di Bandung. Kualitas & Kepuasan Kami Utamakan.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Tautan Cepat</h4>
          <ul className="footer-links">
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/mobil">Katalog Mobil</Link></li>
            <li><Link to="/tentang-kami">Tentang Kami</Link></li>
            <li><Link to="/kontak">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Jam Operasional</h4>
          <ul className="footer-info">
            <li className="flex-start">
              <Clock size={18} className="icon" />
              <div>
                <p>Senin – Sabtu</p>
                <strong>08:00 – 17:30 WIB</strong>
              </div>
            </li>
            <li className="flex-start">
              <Clock size={18} className="icon" />
              <div>
                <p>Minggu</p>
                <strong>08:30 – 15:00 WIB</strong>
              </div>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Kontak Kami</h4>
          <ul className="footer-info">
            <li>
              <MapPin size={18} className="icon" />
              <span>Jln. Pungkur 199, Bandung 40251</span>
            </li>
            <li>
              <Phone size={18} className="icon" />
              <span>+62 811-245-689</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container text-center">
          <p>&copy; {new Date().getFullYear()} Bintang Motor Bandung. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
