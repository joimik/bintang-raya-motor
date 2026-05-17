import React, { useMemo, useState } from 'react';
import CarCard from '../components/CarCard';
import { cars } from '../data/cars';
import { Search, X } from 'lucide-react';
import './CarListings.css';

const PAGE_SIZE = 12;

const PRICE_BUCKETS = [
  { key: 'all', label: 'Semua Harga', match: () => true },
  { key: 'u100', label: '< 100jt', match: (c) => c.price > 0 && c.price < 100_000_000 },
  { key: '100-200', label: '100–200jt', match: (c) => c.price >= 100_000_000 && c.price < 200_000_000 },
  { key: '200-400', label: '200–400jt', match: (c) => c.price >= 200_000_000 && c.price < 400_000_000 },
  { key: 'o400', label: '> 400jt', match: (c) => c.price >= 400_000_000 },
];

const SORTS = [
  { key: 'newest', label: 'Terbaru Masuk', cmp: (a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0) },
  { key: 'cheapest', label: 'Termurah', cmp: (a, b) => (a.price || Infinity) - (b.price || Infinity) },
  { key: 'priciest', label: 'Termahal', cmp: (a, b) => (b.price || 0) - (a.price || 0) },
  { key: 'year-new', label: 'Tahun Terbaru', cmp: (a, b) => (b.year || 0) - (a.year || 0) },
  { key: 'year-old', label: 'Tahun Tertua', cmp: (a, b) => (a.year || 9999) - (b.year || 9999) },
];

export default function CarListings() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [priceBucket, setPriceBucket] = useState('all');
  const [sortKey, setSortKey] = useState('newest');
  const [page, setPage] = useState(1);

  const brands = useMemo(
    () => ['all', ...Array.from(new Set(cars.map((c) => c.brand))).sort()],
    []
  );
  const transmissions = useMemo(
    () => ['all', ...Array.from(new Set(cars.map((c) => c.transmission).filter(Boolean)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bucket = PRICE_BUCKETS.find((b) => b.key === priceBucket);
    const list = cars.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !(c.brand || '').toLowerCase().includes(q)) return false;
      if (brand !== 'all' && c.brand !== brand) return false;
      if (transmission !== 'all' && c.transmission !== transmission) return false;
      if (!bucket.match(c)) return false;
      return true;
    });
    const sort = SORTS.find((s) => s.key === sortKey) || SORTS[0];
    return [...list].sort(sort.cmp);
  }, [search, brand, transmission, priceBucket, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [search, brand, transmission, priceBucket, sortKey]);

  const resetAll = () => {
    setSearch('');
    setBrand('all');
    setTransmission('all');
    setPriceBucket('all');
    setSortKey('newest');
  };

  const hasFilter =
    search || brand !== 'all' || transmission !== 'all' || priceBucket !== 'all' || sortKey !== 'newest';

  return (
    <div className="car-listings py-5">
      <div className="container">
        <div className="listings-header">
          <h1>Katalog Mobil Bekas</h1>
          <p>
            {filtered.length} dari {cars.length} mobil tersedia di showroom Bandung kami.
          </p>
        </div>

        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} className="icon-search" />
            <input
              type="text"
              placeholder="Cari merek atau nama mobil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="select-chip">
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'all' ? 'Semua Merek' : b}
                </option>
              ))}
            </select>

            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="select-chip"
            >
              {transmissions.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'Semua Transmisi' : t}
                </option>
              ))}
            </select>

            <select
              value={priceBucket}
              onChange={(e) => setPriceBucket(e.target.value)}
              className="select-chip"
            >
              {PRICE_BUCKETS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>

            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="select-chip select-sort">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  Urutkan: {s.label}
                </option>
              ))}
            </select>

            {hasFilter && (
              <button className="reset-btn" onClick={resetAll}>
                Reset
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-3 listings-grid">
              {pageItems.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Halaman">
                <button
                  className="page-btn"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                >
                  ← Sebelumnya
                </button>
                <span className="page-info">
                  Halaman <strong>{safePage}</strong> dari <strong>{totalPages}</strong>
                </span>
                <button
                  className="page-btn"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                >
                  Selanjutnya →
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="no-results">
            <h3>Mobil tidak ditemukan</h3>
            <p>Coba kurangi filter atau cari kata kunci lain.</p>
            <button className="btn btn-outline" onClick={resetAll}>
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
