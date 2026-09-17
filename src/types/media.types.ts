/**
 * @file media.types.ts
 * @description Core domain type definitions for movies, television series, anime,
 *              cast, crew, localization (audio/subtitle tracks), streaming providers,
 *              and rating breakdowns.
 */

export type MediaType = 'movie' | 'tv' | 'anime';

export interface MediaVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string; // 'Trailer' | 'Teaser' | 'Clip' | 'Behind the Scenes' | 'Featurette' | 'Bloopers'
  official: boolean;
  publishedAt?: string;
}

export interface MediaImage {
  url: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  voteAverage?: number;
  type?: 'backdrop' | 'poster' | 'still' | 'logo';
}

export interface GalleryImages {
  backdrops: MediaImage[];
  posters: MediaImage[];
  logos?: MediaImage[];
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profileUrl: string;
  popularFor?: string;
  birthPlace?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'Director' | 'Creator' | 'Writer' | 'Composer' | 'Cinematographer' | 'Producer';
  profileUrl?: string;
}

export interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  runtimeMinutes: number;
  airDate: string;
  stillUrl: string;
  voteAverage: number;
}

export interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterUrl: string;
  overview: string;
  airYear: number;
  episodes: Episode[];
}

export interface LanguageTrack {
  code: string;
  name: string;
  nativeName: string;
  audioFormat?: 'Dolby Atmos' | 'Dolby 5.1' | 'Stereo' | 'DTS-HD';
  isOriginal?: boolean;
}

export interface SubtitleTrack {
  code: string;
  name: string;
  nativeName: string;
  hasSDH?: boolean; // Subtitles for deaf/hard of hearing
  hasCC?: boolean;  // Closed Captions
}

export interface StreamingProvider {
  name: string;
  logoUrl: string;
  type: 'stream' | 'rent' | 'buy';
  url?: string;
}

export interface UserRatingBreakdown {
  imdb: number;
  rottenTomatoes: number; // e.g. 93
  metacritic: number;     // e.g. 88
  community: number;      // 0-10
  communityVotesCount: number;
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  overview: string;
  type: MediaType;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  releaseDate: string;
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-PG' | 'TV-14' | 'TV-MA';
  genres: string[];
  ratings: UserRatingBreakdown;
  runtimeMinutes?: number; // for movies
  totalSeasons?: number;   // for series
  totalEpisodes?: number;  // for series
  status: 'Released' | 'Returning Series' | 'Ended' | 'In Production' | 'Canceled';
  originalLanguage: string;
  originCountry: string;
  
  // Localization details
  dubbedLanguages: LanguageTrack[];
  subtitledLanguages: SubtitleTrack[];
  
  // Cast & crew
  directors: CrewMember[];
  creators?: CrewMember[];
  writers: CrewMember[];
  composers?: CrewMember[];
  cast: CastMember[];
  
  // Series specific
  seasons?: Season[];
  
  // Production stats
  budget?: number; // in USD
  revenue?: number; // in USD box office
  productionCompanies: string[];
  awards: string[];
  
  // Media & streaming
  trailerYoutubeId: string;
  trailerTitle?: string;
  videos?: MediaVideo[];
  streamingProviders: StreamingProvider[];
  similarMediaIds: string[];
  recommendations?: MediaItem[];
  similar?: MediaItem[];
  featured?: boolean;
  trendingRank?: number;
  images?: GalleryImages;
}
