import React from 'react';
import { X, RotateCcw, Check, Sparkles, Volume2, Subtitles, Film, Tv, Star, Calendar, Radio } from 'lucide-react';
import { FilterOptions } from '../types';
import { GENRES_LIST, GLOBAL_LANGUAGES, STREAMING_SERVICES } from '../data/mockMedia';
import { motion, AnimatePresence } from 'motion/react';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#0c0e18]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-black/20">
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
                  Advanced Filters
                </h3>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  Global Options
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-indigo-400 transition-colors p-1"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Media Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-indigo-400" />
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
                          ? 'border-indigo-500 bg-indigo-500/20 text-white font-semibold shadow-sm'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{type.label}</span>
                      {filters.type === type.id && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  Genre
                </label>
                <div className="flex flex-wrap gap-1.5">
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
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Rating Slider */}
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
                  className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>0.0</span>
                  <span>5.0</span>
                  <span>7.0</span>
                  <span>8.5+</span>
                </div>
              </div>

              {/* Audio Dubbed Language Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                  Dubbed Audio Language
                </label>
                <select
                  value={filters.dubbedLanguage}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dubbedLanguage: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="" className="bg-[#0c0e18] text-white">Any Dubbed Audio (All Languages)</option>
                  {GLOBAL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0c0e18] text-white">
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtitle Language Filter */}
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="" className="bg-[#0c0e18] text-white">Any Subtitles (All Available)</option>
                  {GLOBAL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0c0e18] text-white">
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Year Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  Release Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-white/40">From Year</label>
                    <input
                      type="number"
                      min="1980"
                      max="2026"
                      value={filters.yearRange[0]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          yearRange: [parseInt(e.target.value) || 1990, prev.yearRange[1]],
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40">To Year</label>
                    <input
                      type="number"
                      min="1980"
                      max="2026"
                      value={filters.yearRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          yearRange: [prev.yearRange[0], parseInt(e.target.value) || 2026],
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-white/10 p-5 bg-black/40">
              <button
                onClick={onClose}
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-98"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
