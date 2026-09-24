import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor } from '../types';

export type Theme = 'dark' | 'light';

export interface AccentOption {
  id: AccentColor;
  label: string;
  primary: string;
  hover: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentOption> = {
  orange: {
    id: 'orange',
    label: 'Cinema Tangerine',
    primary: '#f97316',
    hover: '#ea580c',
    gradient: 'from-orange-500 via-orange-600 to-amber-500',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  crimson: {
    id: 'crimson',
    label: 'Ruby Velvet',
    primary: '#f43f5e',
    hover: '#e11d48',
    gradient: 'from-rose-500 via-rose-600 to-red-600',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
  emerald: {
    id: 'emerald',
    label: 'Jade Emerald',
    primary: '#10b981',
    hover: '#059669',
    gradient: 'from-emerald-500 via-emerald-600 to-teal-500',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  indigo: {
    id: 'indigo',
    label: 'Cyber Violet',
    primary: '#6366f1',
    hover: '#4f46e5',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-400',
    glow: 'rgba(99, 102, 241, 0.35)',
  },
  cyan: {
    id: 'cyan',
    label: 'Electric Cyan',
    primary: '#06b6d4',
    hover: '#0891b2',
    gradient: 'from-cyan-500 via-cyan-600 to-blue-500',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-400',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  amber: {
    id: 'amber',
    label: 'Sunburst Gold',
    primary: '#f59e0b',
    hover: '#d97706',
    gradient: 'from-amber-500 via-amber-600 to-yellow-500',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  rose: {
    id: 'rose',
    label: 'Neon Rose',
    primary: '#fb7185',
    hover: '#f43f5e',
    gradient: 'from-rose-400 via-pink-500 to-rose-600',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    glow: 'rgba(251, 113, 133, 0.35)',
  },
  purple: {
    id: 'purple',
    label: 'Royal Amethyst',
    primary: '#a855f7',
    hover: '#9333ea',
    gradient: 'from-purple-500 via-fuchsia-600 to-violet-600',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
  blue: {
    id: 'blue',
    label: 'Sapphire Blue',
    primary: '#3b82f6',
    hover: '#2563eb',
    gradient: 'from-blue-500 via-indigo-600 to-sky-600',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  teal: {
    id: 'teal',
    label: 'Neo Teal',
    primary: '#14b8a6',
    hover: '#0d9488',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-600',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-400',
    glow: 'rgba(20, 184, 166, 0.35)',
  },
  lime: {
    id: 'lime',
    label: 'Toxic Lime',
    primary: '#84cc16',
    hover: '#65a30d',
    gradient: 'from-lime-500 via-emerald-500 to-green-600',
    badgeBg: 'bg-lime-500/20',
    badgeText: 'text-lime-400',
    glow: 'rgba(132, 204, 22, 0.35)',
  },
  fuchsia: {
    id: 'fuchsia',
    label: 'Retro Fuchsia',
    primary: '#d946ef',
    hover: '#c026d3',
    gradient: 'from-fuchsia-500 via-pink-600 to-rose-600',
    badgeBg: 'bg-fuchsia-500/20',
    badgeText: 'text-fuchsia-400',
    glow: 'rgba(217, 70, 239, 0.35)',
  },
  sky: {
    id: 'sky',
    label: 'Astral Sky',
    primary: '#0ea5e9',
    hover: '#0284c7',
    gradient: 'from-sky-400 via-blue-500 to-cyan-600',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-400',
    glow: 'rgba(14, 165, 233, 0.35)',
  },
  yellow: {
    id: 'yellow',
    label: 'Solar Flare',
    primary: '#eab308',
    hover: '#ca8a04',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-400',
    glow: 'rgba(234, 179, 8, 0.35)',
  },
};

export const AVAILABLE_ACCENTS = Object.values(ACCENT_PALETTES);

interface ThemeContextType {
  theme: Theme;
  accent: AccentColor;
  accentColor: AccentColor;
  accentConfig: AccentOption;
  availableAccents: AccentOption[];
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentColor) => void;
  setAccentColor: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('movieace_theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Default to dark cinema aesthetic
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('movieace_accent') as AccentColor;
    if (saved && ACCENT_PALETTES[saved]) return saved;
    return 'orange';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('movieace_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const currentAccent = ACCENT_PALETTES[accent] || ACCENT_PALETTES.orange;
    
    // Set custom CSS variables for accent color
    root.style.setProperty('--accent', currentAccent.primary);
    root.style.setProperty('--accent-color', currentAccent.primary);
    root.style.setProperty('--accent-primary', currentAccent.primary);
    root.style.setProperty('--accent-hover', currentAccent.hover);
    root.style.setProperty('--accent-glow', currentAccent.glow);
    root.style.setProperty('--accent-muted', `${currentAccent.primary}26`);
    root.setAttribute('data-accent', accent);
    
    localStorage.setItem('movieace_accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
    const root = document.getElementById("root")
    if (root.classList.contains('light')) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentColor) => {
    if (ACCENT_PALETTES[newAccent]) {
      setAccentState(newAccent);
    }
  };

  const setAccentColor = setAccent;
  const accentConfig = ACCENT_PALETTES[accent] || ACCENT_PALETTES.orange;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      accent, 
      accentColor: accent, 
      accentConfig, 
      availableAccents: AVAILABLE_ACCENTS, 
      toggleTheme, 
      setTheme, 
      setAccent, 
      setAccentColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
