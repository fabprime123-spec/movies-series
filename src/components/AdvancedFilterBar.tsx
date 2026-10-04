import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  Star, 
  Calendar, 
  Volume2, 
  Subtitles, 
  UserCheck, 
  Clapperboard, 
  Film, 
  Check, 
  ArrowUpDown, 
  X, 
  Search,
  ChevronDown
} from 'lucide-react';
import { GENRES_LIST, GLOBAL_LANGUAGES } from '../data/constants';
import { AppButton, IconButton, Modal, GlassBox } from './common';

export interface AdvancedFilterState {
  type?: 'all' | 'movie' | 'tv' | 'anime';
  genre: string;
  sortBy: string;
  year: string;
  minRating: number;
  director: string;
  cast: string;
  dubbedLanguage: string;
  subtitledLanguage: string;
}

export interface AdvancedFilterBarProps {
  filters: AdvancedFilterState;
  onChange: (updated: Partial<AdvancedFilterState>) => void;
  onReset: () => void;
  showTypeFilter?: boolean;
  totalResultsCount?: number;
  className?: string;
}

export const POPULAR_DIRECTORS = [
  'Christopher Nolan',
  'Denis Villeneuve',
  'Quentin Tarantino',
  'Martin Scorsese',
  'Hayao Miyazaki',
  'Steven Spielberg',
  'James Cameron',
  'David Fincher',
  'Greta Gerwig',
  'Ridley Scott',
];

export const POPULAR_ACTORS = [
  'Leonardo DiCaprio',
  'Cillian Murphy',
  'Keanu Reeves',
  'Christian Bale',
  'Margot Robbie',
  'Tom Cruise',
  'Brad Pitt',
  'Zendaya',
  'Timothée Chalamet',
  'Pedro Pascal',
];

export const YEAR_OPTIONS = [
  { id: 'all', label: 'All Years' },
  { id: '2026', label: '2026 (Upcoming)' },
  { id: '2025', label: '2025 (Recent)' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2020s', label: '2020s Era' },
  { id: '2010s', label: '2010s Era' },
  { id: '2000s', label: '2000s Era' },
  { id: '1990s', label: '1990s Era' },
  { id: 'classics', label: 'Golden Classics (Pre-1990)' },
];

export const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Most Popular', icon: Sparkles },
  { id: 'popularity.asc', label: 'Hidden Gems (Least Popular)', icon: Sparkles },
  { id: 'vote_average.desc', label: 'Highest Rated', icon: Star },
  { id: 'vote_average.asc', label: 'Lowest Rated', icon: Star },
  { id: 'primary_release_date.desc', label: 'Newest Release Date', icon: Calendar },
  { id: 'primary_release_date.asc', label: 'Oldest / Classics First', icon: Calendar },
  { id: 'title.asc', label: 'Title (A → Z)', icon: ArrowUpDown },
  { id: 'title.desc', label: 'Title (Z → A)', icon: ArrowUpDown },
];

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  showTypeFilter = true,
  totalResultsCount,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count active non-default filters
  const activeCount = [
    filters.genre && filters.genre !== 'All Genres',
    filters.year && filters.year !== 'all',
    filters.minRating > 0,
    filters.director && filters.director.trim() !== '',
    filters.cast && filters.cast.trim() !== '',
    filters.dubbedLanguage && filters.dubbedLanguage !== 'all',
    filters.subtitledLanguage && filters.subtitledLanguage !== 'all',
    filters.type && filters.type !== 'all' && showTypeFilter,
    filters.sortBy && filters.sortBy !== 'popularity.desc',
  ].filter(Boolean).length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Inline Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-[#141622]/60 backdrop-blur-xl shadow-lg">
        {/* Left side: Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Quick Genre Select */}
          <div className="relative">
            <select
              value={filters.genre}
              onChange={(e) => onChange({ genre: e.target.value })}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2 pl-3.5 pr-8 text-xs font-semibold text-white hover:border-white/20 focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="All Genres" className="bg-[#0c0e18] text-white">All Genres</option>
              {GENRES_LIST.map((g) => (
                <option key={g} value={g} className="bg-[#0c0e18] text-white">{g}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
          </div>

          {/* Quick Year Era Select */}
          <div className="relative">
            <select
              value={filters.year}
              onChange={(e) => onChange({ year: e.target.value })}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2 pl-3.5 pr-8 text-xs font-semibold text-white hover:border-white/20 focus:border-accent focus:outline-none cursor-pointer"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y.id} value={y.id} className="bg-[#0c0e18] text-white">{y.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
          </div>

          {/* Quick Sort Order Select */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value })}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2 pl-3.5 pr-8 text-xs font-semibold text-white hover:border-white/20 focus:border-accent focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0c0e18] text-white">{s.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
          </div>

          {/* Type Filter Buttons if requested */}
          {showTypeFilter && (
            <div className="hidden md:flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              {[
                { id: 'all', label: 'All' },
                { id: 'movie', label: 'Movies' },
                { id: 'tv', label: 'Series' },
                { id: 'anime', label: 'Anime' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChange({ type: t.id as any })}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    filters.type === t.id
                      ? 'bg-accent text-white font-bold shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: All Filters Modal Trigger & Reset */}
        <div className="flex items-center gap-2">
          {totalResultsCount !== undefined && (
            <span className="text-xs text-white/50 hidden lg:inline mr-1">
              Showing <strong className="text-white">{totalResultsCount}</strong> titles
            </span>
          )}

          <AppButton
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<SlidersHorizontal className="w-3.5 h-3.5 text-accent" />}
          >
            <span>All Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-accent text-white text-[10px] font-extrabold">
                {activeCount}
              </span>
            )}
          </AppButton>

          {activeCount > 0 && (
            <IconButton
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset all filters"
              size="sm"
              variant="default"
              onClick={onReset}
              title="Reset all filters"
            />
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar (Shows what's actively filtering) */}
      {activeCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1 text-xs">
          <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mr-1">Active:</span>

          {filters.genre && filters.genre !== 'All Genres' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-medium text-[11px]">
              Genre: {filters.genre}
              <button onClick={() => onChange({ genre: 'All Genres' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.year && filters.year !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-medium text-[11px]">
              Year: {filters.year}
              <button onClick={() => onChange({ year: 'all' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.director && filters.director.trim() !== '' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-medium text-[11px]">
              Director: {filters.director}
              <button onClick={() => onChange({ director: '' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.cast && filters.cast.trim() !== '' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-medium text-[11px]">
              Cast: {filters.cast}
              <button onClick={() => onChange({ cast: '' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium text-[11px]">
              ★ {filters.minRating}+
              <button onClick={() => onChange({ minRating: 0 })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.dubbedLanguage && filters.dubbedLanguage !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-medium text-[11px]">
              Dub: {filters.dubbedLanguage.toUpperCase()}
              <button onClick={() => onChange({ dubbedLanguage: 'all' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          {filters.subtitledLanguage && filters.subtitledLanguage !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-medium text-[11px]">
              Sub: {filters.subtitledLanguage.toUpperCase()}
              <button onClick={() => onChange({ subtitledLanguage: 'all' })} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}

          <button
            onClick={onReset}
            className="text-[11px] text-white/50 hover:text-accent font-semibold ml-2 underline transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Full Advanced Filter Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Advanced Film & Series Filtering"
        subtitle="Filter cinematic masterworks by director, cast, release year, language tracks, and sort metrics"
        icon={<SlidersHorizontal className="w-5 h-5 text-accent" />}
        size="lg"
        footer={
          <div className="w-full flex items-center justify-between">
            <AppButton
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onReset}
            >
              Reset Filters
            </AppButton>
            <AppButton
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Apply Filtered Results {activeCount > 0 ? `(${activeCount})` : ''}
            </AppButton>
          </div>
        }
      >
        <div className="space-y-6">
          {/* 1. Sorting Metric */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
              Sort Titles By
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SORT_OPTIONS.map((s) => {
                const isSelected = filters.sortBy === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => onChange({ sortBy: s.id })}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/15 text-white font-bold shadow-md shadow-accent/10'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-white/40'}`} />
                      <span>{s.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Director Search & Quick Picks */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-accent" />
              Director / Filmmaker
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={filters.director}
                onChange={(e) => onChange({ director: e.target.value })}
                placeholder="Search director (e.g. Christopher Nolan, Denis Villeneuve...)"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-xs text-white placeholder-white/40 focus:border-accent focus:outline-none"
              />
              {filters.director && (
                <button
                  onClick={() => onChange({ director: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Quick Director Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Popular:</span>
              {POPULAR_DIRECTORS.map((dir) => (
                <button
                  key={dir}
                  onClick={() => onChange({ director: filters.director === dir ? '' : dir })}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                    filters.director === dir
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cast / Actor Search & Quick Picks */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-accent" />
              Starring Cast Member
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={filters.cast}
                onChange={(e) => onChange({ cast: e.target.value })}
                placeholder="Search actor (e.g. Leonardo DiCaprio, Keanu Reeves...)"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-xs text-white placeholder-white/40 focus:border-accent focus:outline-none"
              />
              {filters.cast && (
                <button
                  onClick={() => onChange({ cast: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Quick Actor Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Popular:</span>
              {POPULAR_ACTORS.map((actor) => (
                <button
                  key={actor}
                  onClick={() => onChange({ cast: filters.cast === actor ? '' : actor })}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                    filters.cast === actor
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {actor}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Release Year Era */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              Release Year / Era
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {YEAR_OPTIONS.map((y) => {
                const isSelected = filters.year === y.id;
                return (
                  <button
                    key={y.id}
                    onClick={() => onChange({ year: y.id })}
                    className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/20 text-accent font-bold shadow-sm'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {y.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Minimum Rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-white/60">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Minimum User Rating
              </span>
              <span className="text-sm font-black text-amber-400">
                {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+ Stars` : 'Any Rating'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 6.0, 7.0, 7.5, 8.0, 8.5].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => onChange({ minRating: ratingVal })}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    filters.minRating === ratingVal
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {ratingVal === 0 ? 'Any' : `${ratingVal}+`}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Dubbed & Subtitled Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dubbed Audio */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                Available Dubbed Audio
              </label>
              <select
                value={filters.dubbedLanguage}
                onChange={(e) => onChange({ dubbedLanguage: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0c0e18] text-white">Any Audio Language</option>
                {GLOBAL_LANGUAGES.map((lang, idx) => (
                  <option key={`afb-dub-${lang.code}-${idx}`} value={lang.code} className="bg-[#0c0e18] text-white">
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Subtitles */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Subtitles className="w-3.5 h-3.5 text-purple-400" />
                Available Subtitles & CC
              </label>
              <select
                value={filters.subtitledLanguage}
                onChange={(e) => onChange({ subtitledLanguage: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-accent focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0c0e18] text-white">Any Subtitles Language</option>
                {GLOBAL_LANGUAGES.map((lang, idx) => (
                  <option key={`afb-sub-${lang.code}-${idx}`} value={lang.code} className="bg-[#0c0e18] text-white">
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. Genre Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Genre Catalog
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {['All Genres', ...GENRES_LIST].map((g) => {
                const isSelected = filters.genre === g || (g === 'All Genres' && !filters.genre);
                return (
                  <button
                    key={g}
                    onClick={() => onChange({ genre: g === 'All Genres' ? 'All Genres' : g })}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-accent text-white font-bold shadow-md shadow-accent/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
