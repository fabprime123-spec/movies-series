import React, { useState, useEffect, useRef } from 'react';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { fetchDiscoverMediaWithPagination } from '../services/tmdb';
import { Tv, ChevronRight, Loader2, RotateCcw, Layers } from 'lucide-react';
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

export const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [filters, setFilters] = useState<AdvancedFilterState>({
    type: 'tv',
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
      type: 'tv',
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

  // Initial load on filter change
  useEffect(() => {
    let isMounted = true;
    async function loadInitialSeries() {
      setLoading(true);
      try {
        const result = await fetchDiscoverMediaWithPagination(
          'tv',
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

  // Consecutive page load handler
  const handleLoadNextConsecutivePage = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const result = await fetchDiscoverMediaWithPagination(
        'tv',
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
      setSeries(result.items || []);
      setPage(1);
      setTotalPages(Math.max(1, result.totalPages || 1));
      contentTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error resetting series to page 1:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeries = filterMediaList(series);

  return (
    <div ref={contentTopRef} className="w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-6">
      {/* Editorial Header */}
      <SectionHeader
        title="Television & Limited Series"
        subtitle="Prestige television drama, animated anthologies, comedy seasons, and miniseries from around the world."
        badge="TV Edition"
        icon={<Tv className="w-5 h-5 text-sky-400" />}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-400"
        className="px-0 sm:px-0 lg:px-0 mb-2"
        action={
          <div className="flex items-center gap-2 text-xs text-muted">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {filteredSeries.length} series loaded (Page {page} of {totalPages})
            </span>
          </div>
        }
      />

      {/* Country Exclusion */}
      <CountryExclusionBar />

      {/* Advanced Filtering & Sorting Bar */}
      <AdvancedFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        showTypeFilter={false}
        totalResultsCount={filteredSeries.length}
      />

      {/* Media Grid / Page Loading Skeleton */}
      {loading ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Filtering television series (Page 1)...</span>
          </div>
          <MediaGridSkeleton count={18} />
        </div>
      ) : filteredSeries.length === 0 ? (
        <EmptyState
          icon={<Tv className="w-8 h-8 text-sky-400/60" />}
          title="No Series Found"
          description="No television or animated shows matched your current combination of genre, creator, cast, release year, or language filters. Try loosening your criteria."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
          className="my-12"
        />
      ) : (
        <div className="space-y-8 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredSeries.map((item) => (
              <MediaCard key={`${item.id}-${item.releaseYear}`} item={item} />
            ))}
          </div>

          {/* Consecutive Consecutive Page Appending Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            {/* Status indicators */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-foreground">
                Showing {filteredSeries.length} titles
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

export const ShowsPage = SeriesPage;
