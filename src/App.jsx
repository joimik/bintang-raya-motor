import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ThemeSwitcher from './components/ThemeSwitcher';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ThemeSwitcher />
      </div>
    </BrowserRouter>
  );
}

export default App;
