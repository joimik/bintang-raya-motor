import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CarListings from './pages/CarListings';
import CarDetail from './pages/CarDetail';
import About from './pages/About';
import Contact from './pages/Contact';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mobil" element={<CarListings />} />
      <Route path="/mobil/:id" element={<CarDetail />} />
      <Route path="/tentang-kami" element={<About />} />
      <Route path="/kontak" element={<Contact />} />
    </Routes>
  );
}
