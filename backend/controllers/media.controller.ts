/**
 * @file media.controller.ts
 * @description Controller managing TMDB catalog queries, pagination, search,
 *              theatrical upcoming schedules, cast filmographies, and multi-filter discovery.
 */

import { Request, Response } from 'express';
import { TmdbService } from '../services/tmdb.service';
import { resolveGenreId } from '../utils/genreMapper.util';
import { sendSuccess, sendError } from '../utils/apiResponse.util';

export class MediaController {
  /**
   * GET /api/tmdb/trending
   * Retrieves trending titles across movies and TV for day/week
   */
  static async getTrending(req: Request, res: Response) {
    try {
      const timeWindow = (req.query.timeWindow as string) || 'week';
      const data = await TmdbService.fetchFromTmdb(`/trending/all/${timeWindow}`);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch trending titles', 500);
    }
  }

  /**
   * GET /api/tmdb/discover
   * Discovers titles by type (movie, tv, anime) and genre
   */
  static async getDiscover(req: Request, res: Response) {
    try {
      const type = (req.query.type as string) || 'movie';
      const genre = (req.query.genre as string) || '';
      const page = (req.query.page as string) || '1';

      if (type === 'anime') {
        const queryParams: Record<string, string> = {
          with_genres: '16',
          with_original_language: 'ja',
          sort_by: 'popularity.desc',
          page,
        };
        const data = await TmdbService.fetchFromTmdb('/discover/tv', queryParams);
        return sendSuccess(res, data);
      }

      const mediaType = type === 'tv' ? 'tv' : 'movie';
      const genreId = resolveGenreId(genre, mediaType);

      const queryParams: Record<string, string> = {
        sort_by: 'popularity.desc',
        page,
        ...(genreId ? { with_genres: genreId } : {}),
      };

      const data = await TmdbService.fetchFromTmdb(`/discover/${mediaType}`, queryParams);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to discover media', 500);
    }
  }

  /**
   * GET /api/tmdb/details/:type/:id
   * Retrieves full cinematic metadata with cast, crew, trailers, gallery, and ratings.
   * Gracefully falls back between movie and TV endpoints if the title is an anime movie/series or miscategorized.
   */
  static async getDetails(req: Request, res: Response) {
    try {
      const { type, id } = req.params;
      const appendParams = {
        append_to_response:
          'credits,videos,images,watch/providers,release_dates,content_ratings,recommendations,similar',
      };

      const isTv = type === 'tv';
      const isAnime = type === 'anime';
      // For anime and tv, default to trying /tv first, but fall back seamlessly to /movie
      const primaryType = isTv || isAnime ? 'tv' : 'movie';
      const fallbackType = primaryType === 'tv' ? 'movie' : 'tv';

      try {
        const data = await TmdbService.fetchFromTmdb(
          `/${primaryType}/${id}`,
          appendParams,
          5 * 60 * 1000,
          { silent404: true }
        );
        return sendSuccess(res, data);
      } catch (err: any) {
        if (err?.status === 404 || err?.message?.includes('404')) {
          const fallbackData = await TmdbService.fetchFromTmdb(
            `/${fallbackType}/${id}`,
            appendParams,
            5 * 60 * 1000
          );
          return sendSuccess(res, fallbackData);
        }
        throw err;
      }
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch title details', 500);
    }
  }

  /**
   * GET /api/tmdb/images/:type/:id
   * Retrieves high-resolution posters, backdrops, and logo assets with graceful fallback
   */
  static async getImages(req: Request, res: Response) {
    try {
      const { type, id } = req.params;
      const isTv = type === 'tv';
      const isAnime = type === 'anime';
      const primaryType = isTv || isAnime ? 'tv' : 'movie';
      const fallbackType = primaryType === 'tv' ? 'movie' : 'tv';

      try {
        const data = await TmdbService.fetchFromTmdb(
          `/${primaryType}/${id}/images`,
          {},
          5 * 60 * 1000,
          { silent404: true }
        );
        return sendSuccess(res, data);
      } catch (err: any) {
        if (err?.status === 404 || err?.message?.includes('404')) {
          const fallbackData = await TmdbService.fetchFromTmdb(
            `/${fallbackType}/${id}/images`,
            {}
          );
          return sendSuccess(res, fallbackData);
        }
        throw err;
      }
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch media images', 500);
    }
  }

  /**
   * GET /api/tmdb/search
   * Unified multi-search across movies, TV series, anime, and actors
   */
  static async search(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || (req.query.query as string) || '';
      const page = (req.query.page as string) || '1';

      if (!query.trim()) {
        return sendSuccess(res, { page: 1, results: [], total_pages: 0, total_results: 0 });
      }

      const data = await TmdbService.fetchFromTmdb('/search/multi', {
        query,
        page,
        include_adult: 'false',
      });

      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Search failed', 500);
    }
  }

  /**
   * GET /api/tmdb/upcoming
   * Retrieves upcoming theatrical releases and seasonal premieres
   */
  static async getUpcoming(req: Request, res: Response) {
    try {
      const page = (req.query.page as string) || '1';
      const [movies, tvShows] = await Promise.all([
        TmdbService.fetchFromTmdb('/movie/upcoming', { page }),
        TmdbService.fetchFromTmdb('/tv/on_the_air', { page }),
      ]);

      return sendSuccess(res, {
        movies: movies.results || [],
        tv: tvShows.results || [],
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch upcoming titles', 500);
    }
  }

  /**
   * GET /api/tmdb/person/:id
   * Retrieves biography and actor details
   */
  static async getPerson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await TmdbService.fetchFromTmdb(`/person/${id}`);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch actor profile', 500);
    }
  }

  /**
   * GET /api/tmdb/person/:id/credits
   * Retrieves filmography credits for actor or filmmaker
   */
  static async getPersonCredits(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await TmdbService.fetchFromTmdb(`/person/${id}/combined_credits`);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch person credits', 500);
    }
  }

  /**
   * GET /api/tmdb/popular-actors
   * Retrieves popular cast members and stars
   */
  static async getPopularActors(req: Request, res: Response) {
    try {
      const page = (req.query.page as string) || '1';
      const data = await TmdbService.fetchFromTmdb('/person/popular', { page });
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch popular actors', 500);
    }
  }

  /**
   * GET /api/tmdb/season/:tvId/:seasonNumber
   * Retrieves full episodic breakdown with titles, overviews, still images, and air dates
   */
  static async getSeasonEpisodes(req: Request, res: Response) {
    try {
      const { tvId, seasonNumber } = req.params;
      const data = await TmdbService.fetchFromTmdb(`/tv/${tvId}/season/${seasonNumber}`);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch season episodes', 500);
    }
  }

  /**
   * GET /api/tmdb/search/person
   * Search specifically for cast, directors, and screenwriters
   */
  static async searchPerson(req: Request, res: Response) {
    try {
      const query = (req.query.query as string) || (req.query.q as string) || '';
      const page = (req.query.page as string) || '1';

      if (!query.trim()) {
        return sendSuccess(res, { page: 1, results: [], total_pages: 0, total_results: 0 });
      }

      const data = await TmdbService.fetchFromTmdb('/search/person', {
        query,
        page,
        include_adult: 'false',
      });

      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Actor search failed', 500);
    }
  }

  /**
   * GET /api/tmdb/filter
   * Advanced faceted search combining genre, rating, year, language, and sorting
   */
  static async filterMedia(req: Request, res: Response) {
    try {
      const {
        type = 'all',
        genre,
        minRating,
        yearMin,
        yearMax,
        sortBy = 'popularity.desc',
        page = '1',
      } = req.query as Record<string, string>;

      const isTv = type === 'tv' || type === 'anime';
      const endpoint = isTv ? '/discover/tv' : '/discover/movie';

      const queryParams: Record<string, string> = {
        page,
        sort_by: sortBy,
      };

      if (minRating) {
        queryParams['vote_average.gte'] = minRating;
        queryParams['vote_count.gte'] = '50';
      }

      if (type === 'anime') {
        queryParams.with_genres = '16';
        queryParams.with_original_language = 'ja';
      } else if (genre && genre !== 'All Genres') {
        const genreId = resolveGenreId(genre, isTv ? 'tv' : 'movie');
        if (genreId) queryParams.with_genres = genreId;
      }

      if (yearMin) {
        queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = `${yearMin}-01-01`;
      }
      if (yearMax) {
        queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = `${yearMax}-12-31`;
      }

      const data = await TmdbService.fetchFromTmdb(endpoint, queryParams);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to filter media catalog', 500);
    }
  }
}
