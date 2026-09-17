/**
 * @file upcoming.types.ts
 * @description Type definitions for anticipated upcoming theatrical releases,
 *              countdown clocks, universe franchises, and actor filmography profiles.
 */

import { MediaType, GalleryImages, MediaItem } from './media.types';

export interface UpcomingItem {
  id: string;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  type: MediaType;
  releaseDate: string; // ISO or YYYY-MM-DD
  targetTimestamp: number; // Unix timestamp in ms for real-time countdown
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  universe?: 'Marvel Cinematic Universe' | 'DC Universe' | 'Star Wars' | 'Sci-Fi' | 'Anime' | 'Original' | 'Blockbuster';
  studio?: string;
  director?: string;
  cast?: string[];
  trailerYoutubeId?: string;
  hypeCount?: number;
  isConfirmedDate?: boolean;
  statusText?: string;
  anticipatedSeason?: number;
  anticipatedEpisode?: number;
  images?: GalleryImages;
}

export interface ActorItem {
  id: string;
  name: string;
  originalName?: string;
  profileUrl: string;
  knownForDepartment: string;
  popularity: number;
  knownFor: string[];
  biography?: string;
  birthday?: string;
  placeOfBirth?: string;
  filmography?: MediaItem[];
}
