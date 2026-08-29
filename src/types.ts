export type NavTab = 'home' | 'movies' | 'shows' | 'actors' | 'upcoming' | 'watchlist' | 'history';

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

export interface UpcomingItem {
  id: string;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  type: MediaType;
  releaseDate: string; // ISO or YYYY-MM-DD or formatted date
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

export type MediaType = 'movie' | 'tv' | 'anime';

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
  hasSDH?: boolean; // Subtitles for the deaf and hard of hearing
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
  rottenTomatoes: number; // e.g. 93%
  metacritic: number; // e.g. 88
  community: number; // 0-10
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
  totalSeasons?: number; // for series
  totalEpisodes?: number; // for series
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
  streamingProviders: StreamingProvider[];
  similarMediaIds: string[];
  featured?: boolean;
  trendingRank?: number;
  images?: GalleryImages;
}

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

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export type AccentColor = 'orange' | 'crimson' | 'emerald' | 'indigo' | 'cyan' | 'amber';

export interface HistoryItem {
  id: string; // mediaId
  media: MediaItem;
  viewedAt: number; // timestamp in ms
  viewCount?: number;
}
