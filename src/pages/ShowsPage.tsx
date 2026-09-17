import React, { useState, useEffect, useRef } from 'react';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { GENRES_LIST } from '../data/constants';
import { fetchDiscoverMediaWithPagination } from '../services/tmdb';
import { Tv, Filter, ChevronRight, Loader2, RotateCcw, Layers } from 'lucide-react';
import { useCountryFilter } from '../context/CountryFilterContext';
import { CountryExclusionBar } from '../components/CountryExclusionBar';

const ALL_GENRES_OPTIONS = ['All Genres', ...GENRES_LIST];

export const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const contentTopRef = useRef<HTMLDivElement>(null);
  const { filterMediaList } = useCountryFilter();

  // When genre or sort changes, reset page to 1
  const handleGenreChange = (genre: string) => {
    if (genre !== selectedGenre) {
      setSelectedGenre(genre);
      setPage(1);
    }
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };

  // Initial load on genre or sort change
  useEffect(() => {
    let isMounted = true;
    async function loadInitialSeries() {
      setLoading(true);
      try {
        const result = await fetchDiscoverMediaWithPagination(
          'tv',
          selectedGenre === 'All Genres' ? '' : selectedGenre,
          sortBy,
          undefined,
          undefined,
          undefined,
          1
        );
        if (isMounted) {
          setSeries(result.items || []);
          setTotalPages(Math.max(1, result.totalPages || 1));
          setPage(1);
        }
      } catch (err) {
        console.error('Error loading series:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitialSeries();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre, sortBy]);

  // Consecutive page load handler: appends page 2, 3, etc. without removing previous series
  const handleLoadNextConsecutivePage = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const result = await fetchDiscoverMediaWithPagination(
        'tv',
        selectedGenre === 'All Genres' ? '' : selectedGenre,
        sortBy,
        undefined,
        undefined,
        undefined,
        nextPage
      );
      setSeries((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newUniqueItems = (result.items || []).filter((s) => !existingIds.has(s.id));
        return [...prev, ...newUniqueItems];
      });
      setPage(nextPage);
      setTotalPages(Math.max(1, result.totalPages || 1));
    } catch (err) {
      console.error('Error loading consecutive series page:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Reset to initial page 1
  const handleResetToFirstPage = async () => {
    setLoading(true);
    try {
      const result = await fetchDiscoverMediaWithPagination(
        'tv',
        selectedGenre === 'All Genres' ? '' : selectedGenre,
        sortBy,
        undefined,
        undefined,
        undefined,
        1
      );
      setSeries(result.items || []);
      setPage(1);
      setTotalPages(Math.max(1, result.totalPages || 1));
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error resetting to page 1:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeries = filterMediaList(series);

  return (
    <div ref={contentTopRef} className="w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">
            <Tv className="w-4 h-4" />
            <span>The Series Edition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] text-foreground tracking-tight">
            Peak Series & Serialized Drama
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Complete episode guides, season arcs, broadcast timelines, and multi-language dubbing tracks for world-class television series.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-ring focus:outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="first_air_date.desc">Latest Air Dates</option>
          </select>
        </div>
      </div>

      {/* Country Exclusion & Genre Filters */}
      <div className="space-y-4">
        <CountryExclusionBar />

        {/* Genre Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Filter by Genre</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>
                Pages 1 to {page} loaded ({filteredSeries.length} series)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ALL_GENRES_OPTIONS.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                      : 'bg-surface text-muted hover:bg-surface/80 hover:text-foreground border border-border'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Media Grid / Page Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Loading {selectedGenre} series (Page 1)...</span>
          </div>
          <MediaGridSkeleton count={18} />
        </div>
      ) : filteredSeries.length === 0 ? (
        <div className="p-12 text-center text-muted bg-card border border-border rounded-2xl">
          No series found matching current filters. Try adjusting your genre or country exclusions.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredSeries.map((item) => (
              <MediaCard key={`${item.id}-${item.releaseYear}`} item={item} />
            ))}
          </div>

          {/* Consecutive Page Appending Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            {/* Status indicators */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-foreground">
                Showing {filteredSeries.length} series
              </span>
              <span>•</span>
              <span>Consecutively loaded Pages 1 to {page} (of {totalPages})</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Reset to Page 1 if multiple pages loaded */}
              {page > 1 && (
                <button
                  type="button"
                  onClick={handleResetToFirstPage}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-foreground text-xs font-semibold transition-all active:scale-95"
                  title="Reset to Page 1 only"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted" />
                  <span>Reset to Page 1</span>
                </button>
              )}

              {/* Consecutive Load More Button */}
              {page < totalPages ? (
                <button
                  type="button"
                  onClick={handleLoadNextConsecutivePage}
                  disabled={loadingMore}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Loading Consecutive Page {page + 1}...</span>
                    </>
                  ) : (
                    <>
                      <span>Load Next Page {page + 1} (Consecutive)</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs text-muted italic">All available series pages loaded</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Aliased export for backward compatibility
export const ShowsPage = SeriesPage;
