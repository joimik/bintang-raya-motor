import React, { useState, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import './ThemeSwitcher.css';

const themes = [
  { name: 'Crimson', label: 'Crimson', primary: '#B91C1C', primaryLight: '#991B1B', accent: '#7F1D1D', accentHover: '#991B1B', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Deep Dark', label: 'Deep Dark', primary: '#7F1D1D', primaryLight: '#991B1B', accent: '#B91C1C', accentHover: '#DC2626', bg: '#1C1917', textDark: '#FAFAF9', textMuted: '#A8A29E' },
  { name: 'Crimson Night', label: 'Crimson Night', primary: '#1C1917', primaryLight: '#292524', accent: '#B91C1C', accentHover: '#DC2626', bg: '#0C0A09', textDark: '#FAFAF9', textMuted: '#78716C' },
  { name: 'Amber Glow', label: 'Amber Glow', primary: '#B45309', primaryLight: '#D97706', accent: '#B91C1C', accentHover: '#DC2626', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Amber Dark', label: 'Amber Dark', primary: '#1C1917', primaryLight: '#292524', accent: '#B45309', accentHover: '#D97706', bg: '#0C0A09', textDark: '#FAFAF9', textMuted: '#A8A29E' },
  { name: 'Deep Elegance', label: 'Deep Elegance', primary: '#7F1D1D', primaryLight: '#991B1B', accent: '#B45309', accentHover: '#D97706', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Stone Modern', label: 'Stone Modern', primary: '#1C1917', primaryLight: '#44403C', accent: '#78716C', accentHover: '#A8A29E', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Crimson Light', label: 'Crimson Light', primary: '#B91C1C', primaryLight: '#DC2626', accent: '#B45309', accentHover: '#D97706', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Charcoal Red', label: 'Charcoal Red', primary: '#78716C', primaryLight: '#A8A29E', accent: '#B91C1C', accentHover: '#DC2626', bg: '#FAFAF9', textDark: '#1C1917', textMuted: '#78716C' },
  { name: 'Midnight Crimson', label: 'Midnight Crimson', primary: '#7F1D1D', primaryLight: '#991B1B', accent: '#FAFAF9', accentHover: '#fff', bg: '#1C1917', textDark: '#FAFAF9', textMuted: '#A8A29E' },
];

const toHex = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--primary-light', theme.primaryLight);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--accent-hover', theme.accentHover);
  root.style.setProperty('--bg-color', theme.bg);
  root.style.setProperty('--text-dark', theme.textDark);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--primary-color-e0', toHex(theme.primary, 0.85));
  root.style.setProperty('--accent-color-20', toHex(theme.accent, 0.2));
  localStorage.setItem('theme', theme.name);
};

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('theme') || 'Crimson');

  useEffect(() => {
    const theme = themes.find(t => t.name === activeTheme) || themes[0];
    applyTheme(theme);
  }, [activeTheme]);

  const selectTheme = (theme) => {
    applyTheme(theme);
    setActiveTheme(theme.name);
  };

  return (
    <>
      <button className="theme-toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Change theme">
        {isOpen ? <X size={20} /> : <Palette size={20} />}
      </button>
      {isOpen && <div className="theme-backdrop" onClick={() => setIsOpen(false)} />}
      <div className={`theme-panel ${isOpen ? 'open' : ''}`}>
        <div className="theme-panel-header">
          <h4>Pilih Tema</h4>
          <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
        </div>
        <div className="theme-grid">
          {themes.map((theme) => (
            <button key={theme.name} className={`theme-option ${activeTheme === theme.name ? 'active' : ''}`} onClick={() => selectTheme(theme)}>
              <div className="theme-preview">
                <span className="preview-primary" style={{ backgroundColor: theme.primary }} />
                <span className="preview-accent" style={{ backgroundColor: theme.accent }} />
                <span className="preview-bg" style={{ backgroundColor: theme.bg }} />
              </div>
              <span className="theme-label">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
