/**
 * @file watchlist.types.ts
 * @description Type definitions for user watchlist items, watching states,
 *              personal ratings/notes, and viewing history tracking.
 */

import { MediaItem } from './media.types';

export type WatchlistStatus = 'plan_to_watch' | 'watching' | 'completed' | 'on_hold' | 'dropped';

export interface WatchlistItem {
  id: string; // mediaId
  media: MediaItem;
  status: WatchlistStatus;
  isFavorite: boolean;
  personalRating?: number; // 1-10
  personalNote?: string;
  watchedEpisodes?: number; // for series tracking
  totalEpisodes?: number;
  addedAt: string;
  updatedAt: string;
}

export interface HistoryItem {
  id: string; // mediaId
  media: MediaItem;
  viewedAt: number; // timestamp in ms
  viewCount?: number;
}
