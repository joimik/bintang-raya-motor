import React from 'react';
import './SectionHeader.css';

// Section header with a huge stylized number/label accent behind the title.
// Pure visual flex — adds editorial/fashion-magazine vibe.
export default function SectionHeader({ num = '01', label, title, sub }) {
  return (
    <div className="section-header">
      <div className="section-header-accent" aria-hidden="true">
        {num}
      </div>
      <div className="section-header-text">
        {label && <span className="section-header-label">{label}</span>}
        <h2 className="section-header-title">{title}</h2>
        {sub && <p className="section-header-sub">{sub}</p>}
      </div>
    </div>
  );
}
