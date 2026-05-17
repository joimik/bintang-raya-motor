import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRight, Phone, Sparkles } from 'lucide-react';
import { cars } from '../data/cars';
import './AnimatedHero.css';

function pickHeroCars(all, n = 5) {
  return [...all]
    .filter((c) => c.image && c.price > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, n);
}

function useCountUp(target, durationMs = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

// Cycles the tagline through random chars before settling. Only runs once
// per word change; subtle by default.
function ScrambleWord({ word, durationMs = 700 }) {
  const [display, setDisplay] = useState(word);
  useEffect(() => {
    const chars = 'BNTGMORKUVZWXPYL';
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const revealed = Math.floor(word.length * t);
      let out = '';
      for (let i = 0; i < word.length; i++) {
        if (i < revealed || word[i] === ' ') out += word[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(word);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [word, durationMs]);
  return <>{display}</>;
}

export default function AnimatedHero() {
  const rotations = useMemo(
    () => ['Terpercaya', 'Berkualitas', 'Bergaransi', 'Pajak Hidup', 'Siap Pakai'],
    []
  );
  const heroCars = useMemo(() => pickHeroCars(cars, 5), []);

  const [wordIdx, setWordIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(0);
  const carCount = cars.length;
  const animatedCount = useCountUp(carCount, 1500);

  useEffect(() => {
    const t = setTimeout(() => setWordIdx((p) => (p + 1) % rotations.length), 2400);
    return () => clearTimeout(t);
  }, [wordIdx, rotations]);

  useEffect(() => {
    if (heroCars.length < 2) return;
    const t = setInterval(() => setBgIdx((p) => (p + 1) % heroCars.length), 5000);
    return () => clearInterval(t);
  }, [heroCars]);

  return (
    <section className="ahero fx-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIdx}
          className="ahero-bg"
          style={{ backgroundImage: `url(${heroCars[bgIdx]?.image})` }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          aria-hidden="true"
        />
      </AnimatePresence>
      <div className="ahero-gradient" aria-hidden="true" />

      {/* Floating ambient gradient orbs */}
      <div className="ahero-orb orb-1" aria-hidden="true" />
      <div className="ahero-orb orb-2" aria-hidden="true" />
      <div className="ahero-orb orb-3" aria-hidden="true" />

      <div className="container ahero-inner">
        <div className="ahero-pill">
          <Sparkles size={14} />
          <span>
            <strong>{animatedCount}</strong> mobil siap dilihat hari ini
          </span>
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
                  wordIdx === idx
                    ? { y: 0, opacity: 1 }
                    : { y: wordIdx > idx ? -180 : 180, opacity: 0 }
                }
              >
                {wordIdx === idx ? <ScrambleWord word={word} /> : word}
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
            className="btn btn-whatsapp btn-lg ahero-pulse magnetic"
          >
            <Phone size={18} /> Chat WhatsApp
          </a>
          <Link to="/mobil" className="btn btn-primary btn-lg magnetic">
            Lihat {carCount} Mobil <MoveRight size={18} />
          </Link>
        </div>

        <div className="ahero-trust">
          <span className="ahero-trust-item">✓ Verified OLX seller sejak 2016</span>
          <span className="ahero-trust-item">✓ Plat D Bandung</span>
          <span className="ahero-trust-item">✓ Terima tukar tambah</span>
        </div>

        <div className="ahero-bg-dots" aria-hidden="true">
          {heroCars.map((_, i) => (
            <span key={i} className={`ahero-bg-dot ${i === bgIdx ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
