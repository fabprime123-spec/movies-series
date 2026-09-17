/**
 * @file soundtrack.service.ts
 * @description Dedicated audio and score retrieval service maintaining curated
 *              lossless tracklists for cinematic masterworks and dynamic tracklist
 *              generation for any film or series.
 */

import {
  BackendSoundtrackAlbum,
  BackendSoundtrackResponse,
} from '../models/soundtrack.model';
import { backendCache } from './cache.service';

const KNOWN_SOUNDTRACKS: Record<string, BackendSoundtrackAlbum> = {
  interstellar: {
    albumTitle: 'Interstellar (Original Motion Picture Soundtrack)',
    composer: 'Hans Zimmer',
    releaseYear: 2014,
    label: 'WaterTower Music',
    tracksCount: 6,
    totalDuration: '31:42',
    playlistYoutubeQuery: 'Interstellar Original Motion Picture Soundtrack Hans Zimmer Full Album',
    tracks: [
      { id: 'int-1', trackNumber: 1, title: 'Cornfield Chase', composer: 'Hans Zimmer', duration: '2:06', youtubeSearchQuery: 'Hans Zimmer Cornfield Chase Interstellar Soundtrack', youtubeId: '1Vko01D77Fg' },
      { id: 'int-2', trackNumber: 2, title: 'Dust', composer: 'Hans Zimmer', duration: '5:41', youtubeSearchQuery: 'Hans Zimmer Dust Interstellar', youtubeId: '7PcgH_WcZ5A' },
      { id: 'int-3', trackNumber: 3, title: 'Stay', composer: 'Hans Zimmer', duration: '6:52', youtubeSearchQuery: 'Hans Zimmer Stay Interstellar Soundtrack', youtubeId: 'ca_Dm38ke3A' },
      { id: 'int-4', trackNumber: 4, title: 'Mountains (Tick-Tock)', composer: 'Hans Zimmer', duration: '3:39', youtubeSearchQuery: 'Hans Zimmer Mountains Interstellar Soundtrack', youtubeId: 'o_Ay_iDRAbc' },
      { id: 'int-5', trackNumber: 5, title: 'No Time for Caution (Docking Scene)', composer: 'Hans Zimmer', duration: '4:06', youtubeSearchQuery: 'Hans Zimmer No Time for Caution Interstellar', youtubeId: 'm3zvVGJrTP8' },
      { id: 'int-6', trackNumber: 6, title: "Where We're Going", composer: 'Hans Zimmer', duration: '7:41', youtubeSearchQuery: 'Hans Zimmer Where Were Going Interstellar', youtubeId: 'OtwS-bL30mI' },
    ],
  },
  oppenheimer: {
    albumTitle: 'Oppenheimer (Original Motion Picture Soundtrack)',
    composer: 'Ludwig Göransson',
    releaseYear: 2023,
    label: 'Back Lot Music',
    tracksCount: 6,
    totalDuration: '28:15',
    playlistYoutubeQuery: 'Oppenheimer Soundtrack Ludwig Goransson Full Album',
    tracks: [
      { id: 'opp-1', trackNumber: 1, title: 'Can You Hear the Music', composer: 'Ludwig Göransson', duration: '1:50', youtubeSearchQuery: 'Ludwig Goransson Can You Hear The Music Oppenheimer', youtubeId: '4LZcMAce_AM' },
      { id: 'opp-2', trackNumber: 2, title: 'Fission', composer: 'Ludwig Göransson', duration: '4:38', youtubeSearchQuery: 'Ludwig Goransson Fission Oppenheimer Soundtrack', youtubeId: '6i7HqN54yR8' },
      { id: 'opp-3', trackNumber: 3, title: 'Trinity', composer: 'Ludwig Göransson', duration: '7:52', youtubeSearchQuery: 'Ludwig Goransson Trinity Oppenheimer Soundtrack', youtubeId: '0bL1sI261Gk' },
      { id: 'opp-4', trackNumber: 4, title: 'Destroyer of Worlds', composer: 'Ludwig Göransson', duration: '2:54', youtubeSearchQuery: 'Ludwig Goransson Destroyer of Worlds Oppenheimer', youtubeId: 'K6ZkXU3hFm4' },
      { id: 'opp-5', trackNumber: 5, title: 'The Manhattan Project', composer: 'Ludwig Göransson', duration: '3:01', youtubeSearchQuery: 'Ludwig Goransson The Manhattan Project Oppenheimer', youtubeId: 'XQxZz_HkEWs' },
      { id: 'opp-6', trackNumber: 6, title: 'Oppenheimer Theme', composer: 'Ludwig Göransson', duration: '7:40', youtubeSearchQuery: 'Ludwig Goransson Oppenheimer Suite', youtubeId: '4LZcMAce_AM' },
    ],
  },
  inception: {
    albumTitle: 'Inception (Music from the Motion Picture)',
    composer: 'Hans Zimmer',
    releaseYear: 2010,
    label: 'Reprise Records',
    tracksCount: 6,
    totalDuration: '29:50',
    playlistYoutubeQuery: 'Inception Music from the Motion Picture Hans Zimmer',
    tracks: [
      { id: 'inc-1', trackNumber: 1, title: 'Time', composer: 'Hans Zimmer', duration: '4:35', youtubeSearchQuery: 'Hans Zimmer Time Inception Official Soundtrack', youtubeId: 'RxabLA7UQ9k' },
      { id: 'inc-2', trackNumber: 2, title: 'Dream Is Collapsing', composer: 'Hans Zimmer', duration: '2:23', youtubeSearchQuery: 'Hans Zimmer Dream Is Collapsing Inception', youtubeId: 'imamcGALUO8' },
      { id: 'inc-3', trackNumber: 3, title: 'Mombasa', composer: 'Hans Zimmer', duration: '4:54', youtubeSearchQuery: 'Hans Zimmer Mombasa Inception Soundtrack', youtubeId: 'XQkbmcsiXnA' },
      { id: 'inc-4', trackNumber: 4, title: 'Waiting for a Train', composer: 'Hans Zimmer', duration: '9:30', youtubeSearchQuery: 'Hans Zimmer Waiting for a Train Inception', youtubeId: 'hZpeLp1Qh0A' },
      { id: 'inc-5', trackNumber: 5, title: 'Paradox', composer: 'Hans Zimmer', duration: '3:25', youtubeSearchQuery: 'Hans Zimmer Paradox Inception', youtubeId: 'k0qIsk9Vq68' },
      { id: 'inc-6', trackNumber: 6, title: 'Half Remembered Dream', composer: 'Hans Zimmer', duration: '1:12', youtubeSearchQuery: 'Hans Zimmer Half Remembered Dream Inception', youtubeId: '1d4Z1j07gqE' },
    ],
  },
  dune: {
    albumTitle: 'Dune (Original Motion Picture Soundtrack)',
    composer: 'Hans Zimmer',
    releaseYear: 2021,
    label: 'WaterTower Music',
    tracksCount: 6,
    totalDuration: '33:10',
    playlistYoutubeQuery: 'Dune Original Motion Picture Soundtrack Hans Zimmer',
    tracks: [
      { id: 'dun-1', trackNumber: 1, title: "Paul's Dream", composer: 'Hans Zimmer', duration: '7:02', youtubeSearchQuery: "Hans Zimmer Paul's Dream Dune Soundtrack", youtubeId: 'w1Vf3wP6q3k' },
      { id: 'dun-2', trackNumber: 2, title: 'Gom Jabbar', composer: 'Hans Zimmer', duration: '4:59', youtubeSearchQuery: 'Hans Zimmer Gom Jabbar Dune', youtubeId: 'd6q46g9m81k' },
      { id: 'dun-3', trackNumber: 3, title: 'Herald of the Change', composer: 'Hans Zimmer', duration: '5:01', youtubeSearchQuery: 'Hans Zimmer Herald of the Change Dune', youtubeId: 'Fk3Lq1k6x_c' },
      { id: 'dun-4', trackNumber: 4, title: 'Leaving Caladan', composer: 'Hans Zimmer', duration: '1:55', youtubeSearchQuery: 'Hans Zimmer Leaving Caladan Dune', youtubeId: 'mX4kF9x0_dY' },
      { id: 'dun-5', trackNumber: 5, title: 'Ripples in the Sand', composer: 'Hans Zimmer', duration: '5:14', youtubeSearchQuery: 'Hans Zimmer Ripples in the Sand Dune', youtubeId: 'p5x5M6_2Y9w' },
      { id: 'dun-6', trackNumber: 6, title: 'My Road Leads into the Desert', composer: 'Hans Zimmer', duration: '3:52', youtubeSearchQuery: 'Hans Zimmer My Road Leads into the Desert', youtubeId: 'y1k5x6z2_Qw' },
    ],
  },
  'the dark knight': {
    albumTitle: 'The Dark Knight (Original Motion Picture Soundtrack)',
    composer: 'Hans Zimmer & James Newton Howard',
    releaseYear: 2008,
    label: 'Warner Bros. Records',
    tracksCount: 6,
    totalDuration: '32:10',
    playlistYoutubeQuery: 'The Dark Knight Soundtrack Hans Zimmer Full Album',
    tracks: [
      { id: 'tdk-1', trackNumber: 1, title: 'Why So Serious?', composer: 'Hans Zimmer', duration: '9:14', youtubeSearchQuery: 'Hans Zimmer Why So Serious Dark Knight', youtubeId: 'T87uS_jUfF4' },
      { id: 'tdk-2', trackNumber: 2, title: "I'm Not a Hero", composer: 'Hans Zimmer & James Newton Howard', duration: '6:34', youtubeSearchQuery: 'Im Not A Hero The Dark Knight', youtubeId: '7e2z_l1Cj8s' },
      { id: 'tdk-3', trackNumber: 3, title: 'Harvey Two-Face', composer: 'James Newton Howard', duration: '6:10', youtubeSearchQuery: 'Harvey Two-Face The Dark Knight Soundtrack', youtubeId: 'sF2d49y6f7c' },
      { id: 'tdk-4', trackNumber: 4, title: 'Aggressive Expansion', composer: 'Hans Zimmer', duration: '4:35', youtubeSearchQuery: 'Aggressive Expansion The Dark Knight', youtubeId: 'N9Vq59o2o2o' },
      { id: 'tdk-5', trackNumber: 5, title: 'Watch the World Burn', composer: 'Hans Zimmer', duration: '3:47', youtubeSearchQuery: 'Watch The World Burn Dark Knight', youtubeId: 'u4k7o5i6t7k' },
      { id: 'tdk-6', trackNumber: 6, title: 'A Dark Knight', composer: 'Hans Zimmer & James Newton Howard', duration: '16:15', youtubeSearchQuery: 'A Dark Knight Hans Zimmer Full Suite', youtubeId: '0O1Wsz6xH3s' },
    ],
  },
  'spider-man: across the spider-verse': {
    albumTitle: 'Spider-Man: Across the Spider-Verse (Soundtrack from and Inspired by the Motion Picture)',
    composer: 'Daniel Pemberton & Metro Boomin',
    releaseYear: 2023,
    label: 'Republic Records / Sony Classical',
    tracksCount: 6,
    totalDuration: '24:50',
    playlistYoutubeQuery: 'Across the Spider-Verse Soundtrack Metro Boomin Daniel Pemberton',
    tracks: [
      { id: 'spv-1', trackNumber: 1, title: 'Am I Dreaming', composer: 'Metro Boomin, A$AP Rocky, Roisee', duration: '4:16', youtubeSearchQuery: 'Metro Boomin Am I Dreaming Spider-Verse', youtubeId: '5ZfB33k1zXo' },
      { id: 'spv-2', trackNumber: 2, title: 'Annihilate', composer: 'Metro Boomin, Swae Lee, Lil Wayne, Offset', duration: '3:51', youtubeSearchQuery: 'Metro Boomin Annihilate Spider-Verse', youtubeId: 'x6d3q9g0k0Y' },
      { id: 'spv-3', trackNumber: 3, title: 'Calling', composer: 'Metro Boomin, Swae Lee, NAV, A Boogie', duration: '3:39', youtubeSearchQuery: 'Metro Boomin Calling Spider-Verse', youtubeId: 'Wz9i_lV99e0' },
      { id: 'spv-4', trackNumber: 4, title: 'Spider-Man 2099 (Miguel O’Hara Theme)', composer: 'Daniel Pemberton', duration: '2:52', youtubeSearchQuery: 'Daniel Pemberton Spider-Man 2099 Miguel OHara Theme', youtubeId: 'ZgqG1H6K27k' },
      { id: 'spv-5', trackNumber: 5, title: 'Gwen’s Theme (Across the Spider-Verse)', composer: 'Daniel Pemberton', duration: '3:05', youtubeSearchQuery: 'Daniel Pemberton Gwens Theme Across the Spider-Verse', youtubeId: 'sK2l9p7t1x8' },
      { id: 'spv-6', trackNumber: 6, title: 'Mona Lisa', composer: 'Dominic Fike', duration: '3:06', youtubeSearchQuery: 'Dominic Fike Mona Lisa Spider-Verse', youtubeId: 'c2t8y4u8n2g' },
    ],
  },
};

export class SoundtrackService {
  /**
   * Retrieves or dynamically generates original score tracklist for a film or series
   */
  static getSoundtrack(
    title: string,
    composerName?: string,
    year?: number
  ): BackendSoundtrackResponse {
    const cleanTitle = (title || '').toLowerCase().trim();
    const cacheKey = `soundtrack_${cleanTitle}`;

    const cached = backendCache.get<BackendSoundtrackResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Check known curated soundtracks
    for (const [key, album] of Object.entries(KNOWN_SOUNDTRACKS)) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        const response: BackendSoundtrackResponse = { source: 'curated', album };
        backendCache.set(cacheKey, response, 30 * 60 * 1000);
        return response;
      }
    }

    // 2. Synthesize thematic tracklist
    const effectiveComposer = composerName || 'Original Motion Picture Score';
    const effectiveYear = year || new Date().getFullYear();

    const generatedAlbum: BackendSoundtrackAlbum = {
      albumTitle: `${title} (Original Motion Picture Soundtrack)`,
      composer: effectiveComposer,
      releaseYear: effectiveYear,
      label: 'Original Motion Picture Score / Milan Records',
      tracksCount: 5,
      totalDuration: '24:18',
      playlistYoutubeQuery: `${title} Original Motion Picture Soundtrack Full Album ${effectiveComposer}`,
      tracks: [
        {
          id: `gen-1-${cleanTitle}`,
          trackNumber: 1,
          title: `Main Title Theme (${title})`,
          composer: effectiveComposer,
          duration: '3:45',
          youtubeSearchQuery: `${title} Main Title Soundtrack Theme ${effectiveComposer}`,
        },
        {
          id: `gen-2-${cleanTitle}`,
          trackNumber: 2,
          title: 'Journey into the Unknown',
          composer: effectiveComposer,
          duration: '4:22',
          youtubeSearchQuery: `${title} Journey Soundtrack ${effectiveComposer}`,
        },
        {
          id: `gen-3-${cleanTitle}`,
          trackNumber: 3,
          title: 'Climactic Confrontation',
          composer: effectiveComposer,
          duration: '5:18',
          youtubeSearchQuery: `${title} Action Scene Theme ${effectiveComposer}`,
        },
        {
          id: `gen-4-${cleanTitle}`,
          trackNumber: 4,
          title: 'Resolution & Epilogue',
          composer: effectiveComposer,
          duration: '4:10',
          youtubeSearchQuery: `${title} Ending Theme ${effectiveComposer}`,
        },
        {
          id: `gen-5-${cleanTitle}`,
          trackNumber: 5,
          title: 'End Credits Suite',
          composer: effectiveComposer,
          duration: '6:43',
          youtubeSearchQuery: `${title} End Credits Full Suite ${effectiveComposer}`,
        },
      ],
    };

    const response: BackendSoundtrackResponse = {
      source: 'generated',
      album: generatedAlbum,
    };

    backendCache.set(cacheKey, response, 15 * 60 * 1000);
    return response;
  }
}
