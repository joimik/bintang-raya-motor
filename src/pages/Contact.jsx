import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page py-5">
      <div className="container">
        <h1 className="section-title text-center mb-4">Hubungi Kami</h1>
        
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-panel">
            <h2 className="mb-4 text-white">Informasi Kontak</h2>
            <p className="contact-desc text-white">
              Punya pertanyaan seputar ketersediaan mobil, proses kredit, atau ingin menjadwalkan test drive? 
              Tim Bintang Motor siap membantu Anda.
            </p>

            <div className="contact-list">
              <div className="contact-item">
                <div className="icon-wrapper"><MapPin size={24} /></div>
                <div className="contact-text">
                  <h3>Alamat Showroom</h3>
                  <p>Jln. Pungkur 199<br/>Bandung 40251, Jawa Barat</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-wrapper"><Phone size={24} /></div>
                <div className="contact-text">
                  <h3>Telepon / WhatsApp</h3>
                  <p>(022) 5210808<br/>+62 811-225-039 (WA)</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-wrapper"><Clock size={24} /></div>
                <div className="contact-text">
                  <h3>Jam Operasional</h3>
                  <p>Senin – Sabtu: 08:00 – 17:30 WIB<br/>Minggu: 08:30 – 15:00 WIB</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon-wrapper"><Mail size={24} /></div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>halo@bintangrayamotor.com</p>
                </div>
              </div>
            </div>
            
            <a 
              href="https://wa.me/62811225039" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-whatsapp w-100 mt-4 contact-btn-wa"
            >
              Chat via WhatsApp Sekarang
            </a>
          </div>

          {/* Map */}
          <div className="map-panel">
            <h2 className="mb-4">Lokasi Kami</h2>
            <div className="map-wrapper shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7854387!2d107.6065!3d-6.9274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e8a5b2d3e3ab%3A0x1234567890abcdef!2sJl.%20Pungkur%20No.199%2C%20Bandung%2C%20Jawa%20Barat%2040251!5e0!3m2!1sid!2sid!4v1711234567890" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bintang Motor Location - Jln. Pungkur 199 Bandung"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
