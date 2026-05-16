import React, { useState } from 'react';
import CarCard from '../components/CarCard';
import { cars } from '../data/cars';
import { Search, Filter } from 'lucide-react';
import './CarListings.css';

export default function CarListings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterTransmission, setFilterTransmission] = useState('All');

  const brands = ['All', ...new Set(cars.map(car => car.brand))];
  const years = ['All', ...new Set(cars.map(car => car.year))].sort((a,b) => b-a);
  const transmissions = ['All', ...new Set(cars.map(car => car.transmission))];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'All' || car.brand === filterBrand;
    const matchesYear = filterYear === 'All' || car.year.toString() === filterYear.toString();
    const matchesTransmission = filterTransmission === 'All' || car.transmission === filterTransmission;
    
    let matchesPrice = true;
    if (filterPrice === 'Under 100M') matchesPrice = car.price < 100000000;
    else if (filterPrice === '100M - 150M') matchesPrice = car.price >= 100000000 && car.price <= 150000000;
    else if (filterPrice === 'Over 150M') matchesPrice = car.price > 150000000;

    return matchesSearch && matchesBrand && matchesYear && matchesTransmission && matchesPrice;
  });

  return (
    <div className="car-listings py-5">
      <div className="container">
        <div className="listings-header text-center">
          <h1 className="mb-4">Katalog Mobil Bekas</h1>
          <p className="text-muted">Temukan mobil pilihan Anda dengan harga terbaik dan kualitas terjamin.</p>
        </div>

        <div className="filter-bar border-radius shadow-sm">
          <div className="search-box">
            <Search size={20} className="icon-search" />
            <input 
              type="text" 
              placeholder="Cari nama mobil..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <label><Filter size={16}/> Merek:</label>
              <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label><Filter size={16}/> Tahun:</label>
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label><Filter size={16}/> Transmisi:</label>
              <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)}>
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>{trans === 'All' ? 'Semua' : trans}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label><Filter size={16}/> Harga:</label>
              <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                <option value="All">Semua Harga</option>
                <option value="Under 100M">Di bawah Rp 100 Juta</option>
                <option value="100M - 150M">Rp 100 Juta - Rp 150 Juta</option>
                <option value="Over 150M">Di atas Rp 150 Juta</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-3 listings-grid">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="no-results text-center py-5">
            <h3>Mobil tidak ditemukan</h3>
            <p>Silakan sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
