/**
 * @file soundtrack.types.ts
 * @description Type definitions for original movie and series soundtracks (OSTs),
 *              tracklists, composers, labels, and audio playback streams.
 */

export interface SoundtrackTrack {
  id: string;
  trackNumber: number;
  title: string;
  composer: string;
  duration: string; // e.g. "3:45"
  youtubeSearchQuery: string;
  youtubeId?: string; // known preview ID
}

export interface SoundtrackAlbum {
  albumTitle: string;
  composer: string;
  releaseYear?: number;
  label: string;
  tracksCount: number;
  totalDuration: string;
  playlistYoutubeQuery: string;
  tracks: SoundtrackTrack[];
}

export interface SoundtrackResponse {
  source: 'curated' | 'generated';
  album: SoundtrackAlbum;
}
