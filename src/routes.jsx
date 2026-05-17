import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import CarListings from './pages/CarListings';
import CarDetail from './pages/CarDetail';
import About from './pages/About';
import Contact from './pages/Contact';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.35, ease: [0.21, 0.6, 0.32, 0.99] };

function PageWrap({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/mobil" element={<PageWrap><CarListings /></PageWrap>} />
        <Route path="/mobil/:id" element={<PageWrap><CarDetail /></PageWrap>} />
        <Route path="/tentang-kami" element={<PageWrap><About /></PageWrap>} />
        <Route path="/kontak" element={<PageWrap><Contact /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
}
