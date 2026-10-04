/**
 * @file filter.types.ts
 * @description Type definitions for media search filtering, country exclusion rules,
 *              navigation tabs, and catalog sorting preferences.
 */

export type NavTab = 'home' | 'movies' | 'series' | 'shows' | 'actors' | 'upcoming' | 'watchlist' | 'history' | 'library';

export type SortField = 'popularity' | 'rating' | 'release_date' | 'newest' | 'title';
export type SortOrder = 'desc' | 'asc';

export interface FilterOptions {
  searchQuery: string;
  type: 'all' | 'movie' | 'tv' | 'anime';
  genre: string;
  minRating: number;
  yearRange: [number, number];
  year?: string;
  director?: string;
  cast?: string;
  dubbedLanguage: string;
  subtitledLanguage: string;
  streamingService: string;
  sortBy: SortField;
  sortOrder?: SortOrder;
}
