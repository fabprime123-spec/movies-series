import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem } from '../types';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  languages?: string[];
}

export const POPULAR_COUNTRIES: CountryOption[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', languages: ['hi', 'te', 'ta', 'ml', 'kn', 'bn', 'pa', 'mr', 'gu', 'ur'] },
  { code: 'US', name: 'United States', flag: '🇺🇸', languages: ['en'] },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', languages: ['en'] },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', languages: ['ko'] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', languages: ['ja'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', languages: ['fr'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', languages: ['de'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', languages: ['es'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', languages: ['it'] },
  { code: 'CN', name: 'China', flag: '🇨🇳', languages: ['zh'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', languages: ['en', 'fr'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', languages: ['en'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', languages: ['pt'] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', languages: ['es'] },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', languages: ['tr'] },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', languages: ['ru'] },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', languages: ['sv'] },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', languages: ['nl'] },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', languages: ['pl'] },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', languages: ['th'] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', languages: ['en'] },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', languages: ['id'] },
];

interface CountryFilterContextType {
  excludedCountries: string[]; // country codes like ['IN', 'RU']
  excludeCountry: (code: string) => void;
  includeCountry: (code: string) => void;
  toggleCountryExclusion: (code: string) => void;
  clearAllExclusions: () => void;
  isExcluded: (code: string) => boolean;
  filterMediaList: (items: MediaItem[]) => MediaItem[];
  isMediaExcluded: (item: MediaItem) => boolean;
}

const CountryFilterContext = createContext<CountryFilterContextType | undefined>(undefined);

const STORAGE_KEY = 'movieace_excluded_countries';

export const CountryFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [excludedCountries, setExcludedCountries] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse excluded countries:', e);
    }
    // Default to excluding India as requested by user
    return ['IN'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(excludedCountries));
    } catch (e) {
      console.error('Failed to save excluded countries:', e);
    }
  }, [excludedCountries]);

  const excludeCountry = (code: string) => {
    const upper = code.toUpperCase();
    if (!excludedCountries.includes(upper)) {
      setExcludedCountries((prev) => [...prev, upper]);
    }
  };

  const includeCountry = (code: string) => {
    const upper = code.toUpperCase();
    setExcludedCountries((prev) => prev.filter((c) => c !== upper));
  };

  const toggleCountryExclusion = (code: string) => {
    const upper = code.toUpperCase();
    if (excludedCountries.includes(upper)) {
      includeCountry(upper);
    } else {
      excludeCountry(upper);
    }
  };

  const clearAllExclusions = () => {
    setExcludedCountries([]);
  };

  const isExcluded = (code: string) => {
    return excludedCountries.includes(code.toUpperCase());
  };

  const isMediaExcluded = (item: MediaItem): boolean => {
    if (excludedCountries.length === 0) return false;

    // Check direct origin country code
    const origin = (item.originCountry || '').toUpperCase();
    if (origin && excludedCountries.includes(origin)) {
      return true;
    }

    // Check known language mappings for excluded countries
    const lang = (item.originalLanguage || '').toLowerCase();
    for (const code of excludedCountries) {
      const countryConfig = POPULAR_COUNTRIES.find((c) => c.code === code);
      if (countryConfig?.languages && countryConfig.languages.includes(lang)) {
        // Double check: if it's English, don't blindly exclude US unless origin matches
        if (lang === 'en' && code !== origin) {
          continue;
        }
        return true;
      }
    }

    return false;
  };

  const filterMediaList = (items: MediaItem[]): MediaItem[] => {
    if (excludedCountries.length === 0) return items;
    return items.filter((item) => !isMediaExcluded(item));
  };

  return (
    <CountryFilterContext.Provider
      value={{
        excludedCountries,
        excludeCountry,
        includeCountry,
        toggleCountryExclusion,
        clearAllExclusions,
        isExcluded,
        filterMediaList,
        isMediaExcluded,
      }}
    >
      {children}
    </CountryFilterContext.Provider>
  );
};

export const useCountryFilter = (): CountryFilterContextType => {
  const context = useContext(CountryFilterContext);
  if (!context) {
    throw new Error('useCountryFilter must be used within a CountryFilterProvider');
  }
  return context;
};
