/**
 * @file tmdb.config.ts
 * @description The Movie Database (TMDB) API parameters, base endpoints,
 *              image CDN URLs, and standard request headers.
 */

import { ENV_CONFIG } from './env.config';

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'original',
  PROFILE_SIZE: 'w185',
  DEFAULT_HEADERS: {
    Authorization: `Bearer ${ENV_CONFIG.TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
  },
};
