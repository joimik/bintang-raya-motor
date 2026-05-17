import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Bintang Motor" className="logo-img" />
        </Link>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Beranda</NavLink>
          <NavLink to="/mobil" onClick={() => setIsMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Katalog Mobil</NavLink>
          <NavLink to="/tentang-kami" onClick={() => setIsMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Tentang Kami</NavLink>
          <NavLink to="/kontak" onClick={() => setIsMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Kontak</NavLink>
          
          <a href="https://wa.me/62811245689" target="_blank" rel="noreferrer" className="btn btn-primary nav-cta">
            <Phone size={18} /> Hubungi Kami
          </a>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
