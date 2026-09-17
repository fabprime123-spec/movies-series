import React, { useState, useRef, useEffect } from 'react';
import { Globe, X, Plus, Filter, Check, ShieldAlert } from 'lucide-react';
import { useCountryFilter, POPULAR_COUNTRIES, CountryOption } from '../context/CountryFilterContext';

interface CountryExclusionBarProps {
  className?: string;
  totalFilteredCount?: number;
}

export const CountryExclusionBar: React.FC<CountryExclusionBarProps> = ({
  className = '',
  totalFilteredCount,
}) => {
  const {
    excludedCountries,
    toggleCountryExclusion,
    includeCountry,
    clearAllExclusions,
  } = useCountryFilter();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = POPULAR_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const excludedObjects: CountryOption[] = excludedCountries
    .map((code) => POPULAR_COUNTRIES.find((c) => c.code === code) || {
      code,
      name: code,
      flag: '🌐',
    });

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs select-none ${className}`}>
      {/* Label / Filter Indicator */}
      <div className="flex items-center gap-1.5 text-muted font-medium py-1">
        <Globe className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[11px] sm:text-xs">Country Exclusions:</span>
      </div>

      {/* Excluded Country Badges with Flags and Remove Button */}
      {excludedObjects.map((country) => (
        <span
          key={country.code}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold shadow-sm transition-all"
        >
          <span className="text-sm">{country.flag}</span>
          <span>{country.name}</span>
          <button
            type="button"
            onClick={() => includeCountry(country.code)}
            className="p-0.5 rounded-full hover:bg-rose-500/30 text-rose-300 hover:text-white transition-colors"
            title={`Restore ${country.name} content`}
            aria-label={`Remove ${country.name} exclusion`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Add / Exclude More Countries Button & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card hover:bg-muted/20 border border-border text-foreground/80 hover:text-foreground font-medium transition-all"
        >
          <Plus className="w-3 h-3 text-amber-500" />
          <span>Exclude Country</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-[#141622] border border-white/15 p-2 shadow-2xl z-50 backdrop-blur-xl text-white">
            <div className="p-1 mb-1 border-b border-white/10">
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {filteredOptions.map((c) => {
                const isItemExcluded = excludedCountries.includes(c.code);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleCountryExclusion(c.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      isItemExcluded
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                        : 'hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                    {isItemExcluded ? (
                      <span className="text-[10px] font-bold text-rose-400">EXCLUDED</span>
                    ) : (
                      <span className="text-[10px] text-white/40">Include</span>
                    )}
                  </button>
                );
              })}
            </div>

            {excludedCountries.length > 0 && (
              <div className="pt-2 mt-1 border-t border-white/10 flex justify-between items-center px-1">
                <span className="text-[10px] text-white/40">
                  {excludedCountries.length} excluded
                </span>
                <button
                  type="button"
                  onClick={clearAllExclusions}
                  className="text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden count note if applicable */}
      {typeof totalFilteredCount === 'number' && totalFilteredCount > 0 && (
        <span className="text-[11px] text-muted italic ml-1">
          ({totalFilteredCount} items hidden)
        </span>
      )}
    </div>
  );
};
