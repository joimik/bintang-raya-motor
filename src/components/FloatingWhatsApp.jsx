import React from 'react';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const phoneNumber = "62811245689";
  const message = "Halo Bintang Motor, saya ingin bertanya tentang mobil bekas.";
  
  return (
    <a 
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} 
      className="floating-whatsapp"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat via WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2a13 13 0 0 0-11 20L3 29l7-2a13 13 0 1 0 6-25zm0 24c-2 0-4-0.5-6-1.5l-4 1 1-4A11 11 0 1 1 16 26zm6-8c-0.3-0.2-2-1-2.3-1s-0.6-0.1-0.8 0.2c-0.3 0.4-0.8 1-1 1s-0.5 0.1-0.8-0.1c-0.8-0.4-1.8-1-2.5-1.8s-1.2-1.5-1.4-1.8c-0.2-0.2 0-0.4 0.1-0.5 0.1-0.1 0.3-0.3 0.4-0.5s0.2-0.3 0.3-0.5c0.1-0.2 0.1-0.4 0-0.5s-1-2.4-1.4-3.3c-0.3-0.8-0.7-0.7-1-0.7s-0.6 0-0.8 0c-0.3 0-0.7 0.1-1 0.4s-1.3 1.2-1.3 3c0 1.8 1.3 3.5 1.5 3.8s2.6 4 6.3 5.5c2 0.8 3 1.1 4 1.2 1 0.1 2-0.1 2.5-0.5s1-1 1-1.5c0-0.3 0-0.6-0.2-0.8z"/>
      </svg>
      <span className="tooltip">Chat Kami</span>
    </a>
  );
}
