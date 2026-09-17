/**
 * @file media.model.ts
 * @description Backend domain data models and DTO interfaces representing
 *              TMDB raw responses and transformed movie/series catalog payloads.
 */

export interface TmdbMediaItemDto {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  origin_country?: string[];
  original_language?: string;
  media_type?: string;
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbPersonDto {
  id: number;
  name: string;
  profile_path?: string;
  known_for_department?: string;
  popularity?: number;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for?: TmdbMediaItemDto[];
}
