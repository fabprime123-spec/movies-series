import React from 'react';

interface FilmGrainOverlayProps {
  opacity?: number;
  className?: string;
  blendMode?: 'overlay' | 'soft-light' | 'screen' | 'difference';
}

/**
 * Authentic 35mm Film Grain Texture Overlay
 * Generates an SVG turbulence noise texture directly in the browser.
 */
export const FilmGrainOverlay: React.FC<FilmGrainOverlayProps> = ({
  opacity = 0.35,
  className = '',
  blendMode = 'overlay',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 select-none overflow-hidden ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '160px 160px',
      }}
    />
  );
};
