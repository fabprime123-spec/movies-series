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
    root.style.setProperty('--accent-color', currentAccent.primary);
    root.style.setProperty('--accent-primary', currentAccent.primary);
    root.style.setProperty('--accent-hover', currentAccent.hover);
    root.style.setProperty('--accent-glow', currentAccent.glow);
    root.setAttribute('data-accent', accent);
    
    localStorage.setItem('movieace_accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
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
