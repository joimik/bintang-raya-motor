import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ThemeSwitcher from './components/ThemeSwitcher';
import FilmGrain from './components/FilmGrain';
import CursorFx from './components/CursorFx';
import CinematicIntro from './components/CinematicIntro';
import ScrollColorShift from './components/ScrollColorShift';
import TickerStrip from './components/TickerStrip';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <TickerStrip />
        <Header />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ThemeSwitcher />
        <FilmGrain />
        <CursorFx />
        <ScrollColorShift />
        <CinematicIntro />
      </div>
    </BrowserRouter>
  );
}

export default App;
