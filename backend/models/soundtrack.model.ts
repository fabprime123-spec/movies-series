/**
 * @file soundtrack.model.ts
 * @description Backend domain models for original motion picture soundtracks,
 *              composers, tracklists, durations, and audio preview queries.
 */

export interface BackendSoundtrackTrack {
  id: string;
  trackNumber: number;
  title: string;
  composer: string;
  duration: string; // e.g. "3:45"
  youtubeSearchQuery: string;
  youtubeId?: string; // known preview ID
}

export interface BackendSoundtrackAlbum {
  albumTitle: string;
  composer: string;
  releaseYear?: number;
  label: string;
  tracksCount: number;
  totalDuration: string;
  playlistYoutubeQuery: string;
  tracks: BackendSoundtrackTrack[];
}

export interface BackendSoundtrackResponse {
  source: 'curated' | 'generated';
  album: BackendSoundtrackAlbum;
}
