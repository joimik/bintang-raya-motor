import React from 'react';
import './FilmGrain.css';

// Body-level SVG noise overlay. Sits above everything, pointer-events: none.
// Inline SVG so it loads without an extra network request.
export default function FilmGrain() {
  return (
    <div className="film-grain" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
