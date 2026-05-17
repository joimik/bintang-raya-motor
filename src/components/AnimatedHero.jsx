import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveRight, Phone, Sparkles } from 'lucide-react';
import { cars } from '../data/cars';
import './AnimatedHero.css';

export default function AnimatedHero() {
  const [i, setI] = useState(0);
  const rotations = useMemo(
    () => ['Terpercaya', 'Berkualitas', 'Bergaransi', 'Pajak Hidup', 'Siap Pakai'],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setI((prev) => (prev === rotations.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(t);
  }, [i, rotations]);

  const carCount = cars.length;

  return (
    <section className="ahero">
      <div className="ahero-bg" aria-hidden="true" />
      <div className="ahero-gradient" aria-hidden="true" />

      <div className="container ahero-inner">
        <div className="ahero-pill">
          <Sparkles size={14} />
          <span>{carCount} mobil siap dilihat hari ini</span>
          <MoveRight size={14} />
        </div>

        <h1 className="ahero-title">
          <span className="ahero-title-static">Showroom Mobil Bekas yang</span>
          <span className="ahero-title-rotator">
            &nbsp;
            {rotations.map((word, idx) => (
              <motion.span
                key={idx}
                className="ahero-rot-word"
                initial={{ opacity: 0, y: -120 }}
                transition={{ type: 'spring', stiffness: 50 }}
                animate={
                  i === idx
                    ? { y: 0, opacity: 1 }
                    : { y: i > idx ? -180 : 180, opacity: 0 }
                }
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        <p className="ahero-subtitle">
          Pilihan mobil bekas terbaik di Bandung sejak 2016. Harga jujur, kondisi prima,
          dokumen lengkap, dan siap pakai tanpa rasa khawatir.
        </p>

        <div className="ahero-cta">
          <a
            href="https://wa.me/62811225039?text=Halo%20Bintang%20Motor%2C%20saya%20ingin%20bertanya%20tentang%20mobil%20yang%20tersedia."
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <Phone size={18} /> Chat WhatsApp
          </a>
          <Link to="/mobil" className="btn btn-primary btn-lg">
            Lihat {carCount} Mobil <MoveRight size={18} />
          </Link>
        </div>

        <div className="ahero-trust">
          <span className="ahero-trust-item">✓ Verified OLX seller sejak 2016</span>
          <span className="ahero-trust-item">✓ Plat D Bandung</span>
          <span className="ahero-trust-item">✓ Terima tukar tambah</span>
        </div>
      </div>
    </section>
  );
}
