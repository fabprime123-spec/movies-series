import React, { useState, useEffect, useRef } from 'react';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { fetchDiscoverMediaWithPagination } from '../services/tmdb';
import { Film, ChevronRight, Loader2, RotateCcw, Layers } from 'lucide-react';
import { useCountryFilter } from '../context/CountryFilterContext';
import { CountryExclusionBar } from '../components/CountryExclusionBar';
import { 
  AdvancedFilterBar, 
  AdvancedFilterState 
} from '../components/AdvancedFilterBar';
import { 
  AppButton, 
  EmptyState, 
  SectionHeader 
} from '../components/common';

export const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [filters, setFilters] = useState<AdvancedFilterState>({
    type: 'movie',
    genre: 'All Genres',
    sortBy: 'popularity.desc',
    year: 'all',
    minRating: 0,
    director: '',
    cast: '',
    dubbedLanguage: 'all',
    subtitledLanguage: 'all',
  });

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const contentTopRef = useRef<HTMLDivElement>(null);
  const { filterMediaList } = useCountryFilter();

  const handleFilterChange = (updated: Partial<AdvancedFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'movie',
      genre: 'All Genres',
      sortBy: 'popularity.desc',
      year: 'all',
      minRating: 0,
      director: '',
      cast: '',
      dubbedLanguage: 'all',
      subtitledLanguage: 'all',
    });
    setPage(1);
  };

  // Initial load for page 1 on filter criteria change
  useEffect(() => {
    let isMounted = true;
    async function loadInitialMovies() {
      setLoading(true);
      try {
        const result = await fetchDiscoverMediaWithPagination(
          'movie',
          filters.genre === 'All Genres' ? '' : filters.genre,
          filters.sortBy,
          filters.dubbedLanguage === 'all' ? undefined : filters.dubbedLanguage,
          filters.minRating,
          filters.year === 'all' ? undefined : filters.year,
          1,
          {
            director: filters.director.trim() || undefined,
            cast: filters.cast.trim() || undefined,
            subtitledLang:
              filters.subtitledLanguage === 'all' ? undefined : filters.subtitledLanguage,
          }
        );
        if (isMounted) {
          setMovies(result.items || []);
          setTotalPages(Math.max(1, result.totalPages || 1));
          setPage(1);
        }
      } catch (err) {
        console.error('Error loading movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitialMovies();
    return () => {
      isMounted = false;
    };
  }, [
    filters.genre,
    filters.sortBy,
    filters.year,
    filters.minRating,
    filters.director,
    filters.cast,
    filters.dubbedLanguage,
    filters.subtitledLanguage,
  ]);

  // Consecutive page load handler: appends page 2, 3, etc. without removing previous movies
  const handleLoadNextConsecutivePage = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const result = await fetchDiscoverMediaWithPagination(
        'movie',
        filters.genre === 'All Genres' ? '' : filters.genre,
        filters.sortBy,
        filters.dubbedLanguage === 'all' ? undefined : filters.dubbedLanguage,
        filters.minRating,
        filters.year === 'all' ? undefined : filters.year,
        nextPage,
        {
          director: filters.director.trim() || undefined,
          cast: filters.cast.trim() || undefined,
          subtitledLang:
            filters.subtitledLanguage === 'all' ? undefined : filters.subtitledLanguage,
        }
      );
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newUniqueItems = (result.items || []).filter((m) => !existingIds.has(m.id));
        return [...prev, ...newUniqueItems];
      });
      setPage(nextPage);
      setTotalPages(Math.max(1, result.totalPages || 1));
    } catch (err) {
      console.error('Error loading consecutive page:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Reset to initial page 1
  const handleResetToFirstPage = async () => {
    setLoading(true);
    try {
      const result = await fetchDiscoverMediaWithPagination(
        'movie',
        filters.genre === 'All Genres' ? '' : filters.genre,
        filters.sortBy,
        filters.dubbedLanguage === 'all' ? undefined : filters.dubbedLanguage,
        filters.minRating,
        filters.year === 'all' ? undefined : filters.year,
        1,
        {
          director: filters.director.trim() || undefined,
          cast: filters.cast.trim() || undefined,
          subtitledLang:
            filters.subtitledLanguage === 'all' ? undefined : filters.subtitledLanguage,
        }
      );
      setMovies(result.items || []);
      setPage(1);
      setTotalPages(Math.max(1, result.totalPages || 1));
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error resetting to page 1:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = filterMediaList(movies);

  return (
    <div ref={contentTopRef} className="w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-6">
      {/* Editorial Header using common SectionHeader */}
      <SectionHeader
        title="The Cinema Catalog"
        subtitle="Explore global cinematic classics, modern blockbusters, award-winning auteur works, and festival premieres with advanced filtering."
        badge="Cinema Edition"
        icon={<Film className="w-5 h-5 text-amber-400" />}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-400"
        className="px-0 sm:px-0 lg:px-0 mb-2"
        action={
          <div className="flex items-center gap-2 text-xs text-muted">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {filteredMovies.length} titles loaded (Page {page} of {totalPages})
            </span>
          </div>
        }
      />

      {/* Country Exclusion Filter */}
      <CountryExclusionBar />

      {/* Advanced Filtering & Sorting Bar */}
      <AdvancedFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        showTypeFilter={false}
        totalResultsCount={filteredMovies.length}
      />

      {/* Media Grid / Page Loading Skeleton */}
      {loading ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Filtering cinema catalogue (Page 1)...</span>
          </div>
          <MediaGridSkeleton count={18} />
        </div>
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          icon={<Film className="w-8 h-8 text-amber-400/60" />}
          title="No Films Found"
          description="No cinematic titles matched your current combination of genre, director, cast, release year, or language filters. Try loosening your criteria."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
          className="my-12"
        />
      ) : (
        <div className="space-y-8 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((item) => (
              <MediaCard key={`${item.id}-${item.releaseYear}`} item={item} />
            ))}
          </div>

          {/* Consecutive Page Appending Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            {/* Status indicators */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-foreground">
                Showing {filteredMovies.length} titles
              </span>
              <span>•</span>
              <span>Consecutively loaded Pages 1 to {page} (of {totalPages})</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Reset to Page 1 if multiple pages loaded */}
              {page > 1 && (
                <AppButton
                  variant="secondary"
                  size="sm"
                  onClick={handleResetToFirstPage}
                  icon={<RotateCcw className="w-3.5 h-3.5 text-muted" />}
                  title="Reset to Page 1 only"
                >
                  Reset to Page 1
                </AppButton>
              )}

              {/* Consecutive Load More Button */}
              {page < totalPages ? (
                <AppButton
                  variant="primary"
                  size="md"
                  onClick={handleLoadNextConsecutivePage}
                  disabled={loadingMore}
                  loading={loadingMore}
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  Load Next Page {page + 1} (Consecutive)
                </AppButton>
              ) : (
                <span className="text-xs text-muted italic">All available pages loaded</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
