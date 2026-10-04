import React from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Volume2, 
  Subtitles, 
  Film, 
  Star, 
  Calendar, 
  Clapperboard, 
  UserCheck, 
  ArrowUpDown 
} from 'lucide-react';
import { FilterOptions } from '../types';
import { GENRES_LIST, GLOBAL_LANGUAGES } from '../data/constants';
import { POPULAR_DIRECTORS, POPULAR_ACTORS, SORT_OPTIONS } from './AdvancedFilterBar';
import { AppButton, IconButton } from './common';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop blur overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer panel */}
      <div
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#0c0e18]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden text-white transition-transform duration-300 transform translate-x-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 bg-black/20">
          <div className="flex items-center gap-2">
            <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
              Advanced Filters
            </h3>
            <span className="rounded-full bg-accent/20 border border-accent/30 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              Global Options
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-accent transition-colors p-1"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <IconButton
              icon={<X className="h-4 w-4" />}
              aria-label="Close filters"
              size="sm"
              rounded="full"
              variant="default"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. Sorting Metric */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-accent" />
              Sort Criteria
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'popularity', label: 'Popularity' },
                { id: 'rating', label: 'Rating (Top)' },
                { id: 'release_date', label: 'Release Date' },
                { id: 'title', label: 'Title (A-Z)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilters((prev) => ({ ...prev, sortBy: s.id as any }))}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-all ${
                    filters.sortBy === s.id
                      ? 'border-accent bg-accent/20 text-accent font-bold shadow-sm'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  {filters.sortBy === s.id && <Check className="h-3 w-3 text-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Media Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-accent" />
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'movie', label: 'Feature Films' },
                { id: 'tv', label: 'TV Series' },
                { id: 'anime', label: 'Anime & Animation' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilters((prev) => ({ ...prev, type: type.id as any }))}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all ${
                    filters.type === type.id
                      ? 'border-accent bg-accent/20 text-white font-semibold shadow-sm'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{type.label}</span>
                  {filters.type === type.id && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Director Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Clapperboard className="h-3.5 w-3.5 text-accent" />
              Director / Filmmaker
            </label>
            <input
              type="text"
              value={filters.director || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, director: e.target.value }))}
              placeholder="e.g. Christopher Nolan, Denis Villeneuve..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {POPULAR_DIRECTORS.slice(0, 5).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFilters((prev) => ({ ...prev, director: prev.director === dir ? '' : dir }))}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    filters.director === dir
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Cast Member Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-accent" />
              Starring Cast Member
            </label>
            <input
              type="text"
              value={filters.cast || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, cast: e.target.value }))}
              placeholder="e.g. Leonardo DiCaprio, Cillian Murphy..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {POPULAR_ACTORS.slice(0, 5).map((actor) => (
                <button
                  key={actor}
                  onClick={() => setFilters((prev) => ({ ...prev, cast: prev.cast === actor ? '' : actor }))}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    filters.cast === actor
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {actor}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Genres Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Genre
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {GENRES_LIST.map((genre) => {
                const isSelected = filters.genre === genre || (genre === 'All Genres' && !filters.genre);
                return (
                  <button
                    key={genre}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        genre: genre === 'All Genres' ? '' : genre,
                      }))
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-accent text-white shadow-md shadow-accent/20 font-bold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Minimum Rating Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-white/50">
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                Minimum User Rating
              </span>
              <span className="text-sm font-extrabold text-amber-400">
                {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+ Stars` : 'Any Rating'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9.5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minRating: parseFloat(e.target.value) }))
              }
              className="w-full accent-accent h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>0.0</span>
              <span>5.0</span>
              <span>7.0</span>
              <span>8.5+</span>
            </div>
          </div>

          {/* 7. Audio Dubbed Language Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-accent" />
              Dubbed Audio Language
            </label>
            <select
              value={filters.dubbedLanguage}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dubbedLanguage: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0c0e18] text-white">Any Dubbed Audio (All Languages)</option>
              {GLOBAL_LANGUAGES.map((lang, idx) => (
                <option key={`fd-dub-${lang.code}-${idx}`} value={lang.code} className="bg-[#0c0e18] text-white">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* 8. Subtitle Language Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Subtitles className="h-3.5 w-3.5 text-sky-400" />
              Subtitles Language
            </label>
            <select
              value={filters.subtitledLanguage}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subtitledLanguage: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0c0e18] text-white">Any Subtitles (All Available)</option>
              {GLOBAL_LANGUAGES.map((lang, idx) => (
                <option key={`fd-sub-${lang.code}-${idx}`} value={lang.code} className="bg-[#0c0e18] text-white">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* 9. Release Year Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              Release Period
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40">From Year</label>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={filters.yearRange[0]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      yearRange: [parseInt(e.target.value) || 1990, prev.yearRange[1]],
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40">To Year</label>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={filters.yearRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      yearRange: [prev.yearRange[0], parseInt(e.target.value) || 2026],
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="border-t border-white/10 p-5 bg-black/40">
          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Apply Filters
          </AppButton>
        </div>
      </div>
    </div>
  );
};
