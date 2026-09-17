/**
 * @file filter.types.ts
 * @description Type definitions for media search filtering, country exclusion rules,
 *              navigation tabs, and catalog sorting preferences.
 */

export type NavTab = 'home' | 'movies' | 'series' | 'shows' | 'actors' | 'upcoming' | 'watchlist' | 'history' | 'library';

export interface FilterOptions {
  searchQuery: string;
  type: 'all' | 'movie' | 'tv' | 'anime';
  genre: string;
  minRating: number;
  yearRange: [number, number];
  dubbedLanguage: string;
  subtitledLanguage: string;
  streamingService: string;
  sortBy: 'popularity' | 'rating' | 'newest' | 'title';
}
