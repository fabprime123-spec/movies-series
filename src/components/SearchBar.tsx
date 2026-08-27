import React from 'react';
import { Search, SlidersHorizontal, X, Sparkles, Film, Tv, PlaySquare } from 'lucide-react';
import { FilterOptions } from '../types';

interface SearchBarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  setFilters,
  onOpenFilterDrawer,
  activeFilterCount,
  totalResults,
}) => {
  const typeButtons = [
    { id: 'all', label: 'All Titles', icon: PlaySquare },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'Series', icon: Tv },
    { id: 'anime', label: 'Anime', icon: Sparkles },
  ] as const;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  const handleTypeSelect = (type: 'all' | 'movie' | 'tv' | 'anime') => {
    setFilters((prev) => ({ ...prev, type }));
  };

  return (
    <div className="space-y-4">
      {/* Main Search Input & Filter Button Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Glassmorphic Search Field */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-indigo-400 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          
          <input
            id="main-media-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title, director, cast member, or character..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 pl-12 pr-10 text-sm font-medium text-white placeholder-white/40 backdrop-blur-xl shadow-lg shadow-black/20 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />

          {filters.searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Drawer Trigger Button */}
        <button
          id="filter-drawer-toggle-btn"
          onClick={onOpenFilterDrawer}
          className={`flex items-center justify-center gap-2 rounded-full border py-3.5 px-6 text-sm font-semibold backdrop-blur-xl transition-all shadow-md active:scale-95 ${
            activeFilterCount > 0
              ? 'border-indigo-500 bg-indigo-600/30 text-indigo-300 shadow-indigo-500/20'
              : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick Category Chips & Active Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {typeButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = filters.type === btn.id;
            return (
              <button
                key={btn.id}
                id={`type-chip-${btn.id}`}
                onClick={() => handleTypeSelect(btn.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Counter & Quick Sort Summary */}
        <div className="flex items-center gap-3 text-white/50 font-medium">
          <span>Showing <strong className="text-white">{totalResults}</strong> titles</span>
          
          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md focus:border-indigo-500 focus:outline-none"
          >
            <option value="popularity" className="bg-[#0e121f] text-white">Sort: Most Popular</option>
            <option value="rating" className="bg-[#0e121f] text-white">Sort: Highest Rated</option>
            <option value="newest" className="bg-[#0e121f] text-white">Sort: Newest Release</option>
            <option value="title" className="bg-[#0e121f] text-white">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
