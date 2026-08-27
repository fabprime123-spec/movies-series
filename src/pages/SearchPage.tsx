import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Sparkles, Star, Film, Tv, Users, SlidersHorizontal, ArrowUpDown, Volume2, Globe, Check, RotateCcw, Loader2 } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { MediaItem, ActorItem } from '../types';
import { MOCK_MEDIA, GENRES_LIST, GLOBAL_LANGUAGES, STREAMING_SERVICES } from '../data/mockMedia';
import { searchTmdbFull, fetchDiscoverMedia } from '../services/tmdb';
import { motion, AnimatePresence } from 'motion/react';

const TRENDING_TAGS = [
  'Dune',
  'Cyberpunk',
  'Oppenheimer',
  'White Album 2',
  'Interstellar',
  'Arcane',
  'Pedro Pascal',
  'Denis Villeneuve',
  'Spider-Man',
  'Shogun'
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv' | 'anime' | 'actors'>(initialType as any);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest' | 'title'>('popularity');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const [mediaResults, setMediaResults] = useState<MediaItem[]>([]);
  const [actorResults, setActorResults] = useState<ActorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync URL search params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (typeFilter !== 'all') params.type = typeFilter;
    setSearchParams(params, { replace: true });
  }, [query, typeFilter, setSearchParams]);

  // Execute TMDB Search or Discovery
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          const { media, actors } = await searchTmdbFull(query.trim());
          if (isMounted) {
            setMediaResults(media);
            setActorResults(actors);
          }
        } else {
          // If query is empty, show top discover titles matching active category
          const mediaType = typeFilter === 'actors' ? 'all' : typeFilter;
          const data = await fetchDiscoverMedia(mediaType, selectedGenre === 'All Genres' ? '' : selectedGenre);
          if (isMounted) {
            setMediaResults(data.length > 0 ? data : MOCK_MEDIA);
            setActorResults([]);
          }
        }
      } catch (err) {
        console.warn('Search query error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, query.trim() ? 250 : 0);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [query, typeFilter, selectedGenre]);

  // Client-side filtering & sorting
  const filteredMedia = useMemo(() => {
    return mediaResults.filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && typeFilter !== 'actors' && item.type !== typeFilter) {
        return false;
      }

      // Genre
      if (selectedGenre !== 'All Genres' && !item.genres.includes(selectedGenre)) {
        return false;
      }

      // Min Rating
      if (minRating > 0 && item.ratings.imdb < minRating) {
        return false;
      }

      // Year
      if (selectedYear !== 'all') {
        const year = parseInt(selectedYear, 10);
        if (selectedYear === '2010s' && (item.releaseYear < 2010 || item.releaseYear > 2019)) return false;
        if (selectedYear === 'classics' && item.releaseYear >= 2010) return false;
        if (!isNaN(year) && item.releaseYear !== year) return false;
      }

      // Audio Language
      if (selectedLanguage !== 'all') {
        const hasLang = item.dubbedLanguages.some((l) => l.code === selectedLanguage || l.code.startsWith(selectedLanguage));
        if (!hasLang) return false;
      }

      // Streaming provider
      if (selectedProvider !== 'all') {
        const hasProvider = item.streamingProviders.some((p) => p.name.toLowerCase().includes(selectedProvider.toLowerCase()));
        if (!hasProvider) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.ratings.imdb - a.ratings.imdb;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return (b.ratings.communityVotesCount || 0) - (a.ratings.communityVotesCount || 0);
    });
  }, [mediaResults, typeFilter, selectedGenre, minRating, selectedYear, selectedLanguage, selectedProvider, sortBy]);

  const resetAllFilters = () => {
    setSelectedGenre('All Genres');
    setMinRating(0);
    setSelectedYear('all');
    setSelectedLanguage('all');
    setSelectedProvider('all');
    setSortBy('popularity');
    setTypeFilter('all');
    setQuery('');
  };

  const hasActiveFilters = selectedGenre !== 'All Genres' || minRating > 0 || selectedYear !== 'all' || selectedLanguage !== 'all' || selectedProvider !== 'all' || sortBy !== 'popularity';

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-8">
      {/* Search Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Cinema & Talent Archive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit',sans-serif] text-white tracking-tight">
          Explore The Full Catalogue
        </h1>
        <p className="text-sm text-white/50 max-w-xl mx-auto">
          Search hundreds of thousands of films, series, anime, directors, cast members, audio dubs, and stream locations in real time.
        </p>

        {/* Large Prominent Search Input */}
        <div className="relative mt-6 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4.5 w-5 h-5 text-orange-400 pointer-events-none" />
            <input
              id="main-media-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, anime, franchise, actor, or director..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#141622]/90 border-2 border-white/15 text-white placeholder-white/40 shadow-2xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-base transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Trending Quick Search Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-white/40 mr-1">Trending Searches:</span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 border border-white/10 text-xs text-white/70 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Media', icon: Sparkles },
            { id: 'movie', label: 'Movies', icon: Film },
            { id: 'tv', label: 'TV Shows', icon: Tv },
            { id: 'anime', label: 'Anime', icon: Sparkles },
            { id: 'actors', label: 'Actors & Cast', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-white/10 bg-[#141622]/95 p-5 backdrop-blur-xl shadow-2xl space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* 1. Sort By */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="popularity">Most Popular / Relevance</option>
                  <option value="rating">Highest IMDb Score (10-1)</option>
                  <option value="newest">Newest Release Year</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* 2. Minimum Rating */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">Minimum IMDb Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value={0}>Any Rating</option>
                  <option value={8.5}>8.5+ Masterpieces Only</option>
                  <option value={8.0}>8.0+ Highly Acclaimed</option>
                  <option value={7.0}>7.0+ Solid Quality</option>
                  <option value={6.0}>6.0+ Casual Watch</option>
                </select>
              </div>

              {/* 3. Release Year */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">Release Timeline</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="all">All Release Years</option>
                  <option value="2024">2024 (Latest)</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2010s">2010 - 2019 (Modern Era)</option>
                  <option value="classics">Pre-2010 (Classics)</option>
                </select>
              </div>

              {/* 4. Spoken Audio Language */}
              <div>
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">Spoken Audio Track</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="all">Any Spoken Audio</option>
                  <option value="en">English Track</option>
                  <option value="ja">Japanese Track</option>
                  <option value="es">Spanish Track</option>
                  <option value="fr">French Track</option>
                  <option value="de">German Track</option>
                  <option value="ko">Korean Track</option>
                  <option value="hi">Hindi Track</option>
                </select>
              </div>
            </div>

            {/* Genre Select Chips inside panel */}
            <div>
              <label className="text-xs font-semibold text-white/60 mb-2 block">Filter By Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {GENRES_LIST.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedGenre === g
                        ? 'bg-orange-500 text-white font-bold'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header with Count */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>
          Showing{' '}
          <strong className="text-white">
            {typeFilter === 'actors' ? actorResults.length : filteredMedia.length}
          </strong>{' '}
          results {query ? `for "${query}"` : ''}
        </span>
      </div>

      {/* Results Rendering */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-xs text-white/50">Searching cinematic catalog...</p>
        </div>
      ) : typeFilter === 'actors' ? (
        /* Actors List Grid */
        actorResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {actorResults.map((actor) => (
              <div
                key={actor.id}
                onClick={() => navigate('/actors')}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14161f]/70 backdrop-blur-xl p-3 shadow-lg hover:border-orange-500/40 hover:shadow-orange-500/10 cursor-pointer transition-all"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-3">
                  <img
                    src={actor.profileUrl}
                    alt={actor.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-orange-400 transition-colors">
                  {actor.name}
                </h3>
                <p className="text-xs text-white/50">{actor.knownForDepartment}</p>
                {actor.knownFor.length > 0 && (
                  <p className="text-[11px] text-white/40 mt-1 line-clamp-1">
                    {actor.knownFor.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <Users className="w-12 h-12 text-white/20" />
            <h3 className="text-lg font-bold text-white">No talent found matching your search</h3>
            <p className="text-xs text-white/40 max-w-sm">
              Try searching with popular names like "Pedro Pascal", "Timothée Chalamet", or "Zendaya".
            </p>
          </div>
        )
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredMedia.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border border-white/5 bg-white/[0.02]">
          <Film className="w-14 h-14 text-orange-500/40" />
          <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">No titles match your query</h3>
          <p className="text-xs text-white/50 max-w-md">
            We couldn't find any media matching "{query}" with the current filters. Try resetting the filters or searching for another title.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            Clear All Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
