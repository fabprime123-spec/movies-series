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
   * Discovers titles with advanced filtering by type, genre, release year, rating, people/cast/crew, and sorting
   */
  static async getDiscover(req: Request, res: Response) {
    try {
      const type = (req.query.type as string) || 'movie';
      const genre = (req.query.genre as string) || '';
      const page = (req.query.page as string) || '1';
      const sortBy = (req.query.sortBy as string) || (req.query.sort_by as string) || 'popularity.desc';
      const minRating = req.query.minRating as string | undefined;
      const year = req.query.year as string | undefined;
      const yearMin = req.query.yearMin as string | undefined;
      const yearMax = req.query.yearMax as string | undefined;
      const withPeople = (req.query.with_people as string) || (req.query.people as string);
      const withCast = (req.query.with_cast as string) || (req.query.cast as string);
      const withCrew = (req.query.with_crew as string) || (req.query.director as string);
      const withOriginalLanguage = req.query.with_original_language as string | undefined;

      const isTv = type === 'tv';
      const isAnime = type === 'anime';
      const endpoint = isTv || isAnime ? '/discover/tv' : '/discover/movie';

      // Standardize TMDB sort_by
      let tmdbSort = sortBy;
      if (sortBy === 'rating' || sortBy === 'rating.desc') tmdbSort = 'vote_average.desc';
      else if (sortBy === 'rating.asc') tmdbSort = 'vote_average.asc';
      else if (sortBy === 'popularity' || sortBy === 'popularity.desc') tmdbSort = 'popularity.desc';
      else if (sortBy === 'popularity.asc') tmdbSort = 'popularity.asc';
      else if (sortBy === 'newest' || sortBy === 'release_date.desc' || sortBy === 'primary_release_date.desc') {
        tmdbSort = isTv ? 'first_air_date.desc' : 'primary_release_date.desc';
      } else if (sortBy === 'oldest' || sortBy === 'release_date.asc' || sortBy === 'primary_release_date.asc') {
        tmdbSort = isTv ? 'first_air_date.asc' : 'primary_release_date.asc';
      }

      // If director or cast is specified, resolve person and their filmography
      if (withCrew || withCast) {
        const personQuery = (withCrew || withCast).trim();
        let personId: number | null = null;
        if (!isNaN(Number(personQuery))) {
          personId = Number(personQuery);
        } else {
          try {
            const searchData = await TmdbService.fetchFromTmdb(
              '/search/person',
              { query: personQuery },
              60 * 60 * 1000,
              { silent404: true }
            );
            if (searchData.results && searchData.results.length > 0) {
              personId = searchData.results[0].id;
            }
          } catch {}
        }

        if (personId) {
          try {
            const creditsData = await TmdbService.fetchFromTmdb(
              `/person/${personId}/combined_credits`,
              {},
              30 * 60 * 1000
            );
            let rawList: any[] = [];
            if (withCrew) {
              rawList = (creditsData.crew || []).filter(
                (c: any) => c.job === 'Director' || c.department === 'Directing'
              );
            } else {
              rawList = creditsData.cast || [];
            }

            // Filter by media_type if specified
            if (type === 'movie') {
              rawList = rawList.filter((item) => !item.media_type || item.media_type === 'movie');
            } else if (type === 'tv') {
              rawList = rawList.filter((item) => item.media_type === 'tv');
            }

            // Filter by genre if specified
            if (genre && genre !== 'All Genres') {
              const genreId = Number(resolveGenreId(genre, isTv ? 'tv' : 'movie'));
              if (genreId) {
                rawList = rawList.filter(
                  (item) =>
                    item.genre_ids &&
                    Array.isArray(item.genre_ids) &&
                    item.genre_ids.includes(genreId)
                );
              }
            }

            // Filter by rating
            if (minRating && parseFloat(minRating) > 0) {
              const minVal = parseFloat(minRating);
              rawList = rawList.filter((item) => (item.vote_average || 0) >= minVal);
            }

            // Filter by year or decade
            if (year && year !== 'all') {
              if (year === '2020s') {
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y >= 2020 && y <= 2029;
                });
              } else if (year === '2010s') {
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y >= 2010 && y <= 2019;
                });
              } else if (year === '2000s') {
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y >= 2000 && y <= 2009;
                });
              } else if (year === '1990s') {
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y >= 1990 && y <= 1999;
                });
              } else if (year === 'classics') {
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y > 0 && y < 1990;
                });
              } else if (!isNaN(Number(year))) {
                const targetYear = parseInt(year);
                rawList = rawList.filter((item) => {
                  const y = parseInt((item.release_date || item.first_air_date || '').slice(0, 4));
                  return y === targetYear;
                });
              }
            }

            // Sort results
            if (sortBy.includes('vote_average') || sortBy === 'rating' || sortBy === 'rating.desc') {
              rawList.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            } else if (
              sortBy.includes('primary_release_date') ||
              sortBy.includes('first_air_date') ||
              sortBy === 'newest'
            ) {
              rawList.sort((a, b) => {
                const dateA = a.release_date || a.first_air_date || '';
                const dateB = b.release_date || b.first_air_date || '';
                return dateB.localeCompare(dateA);
              });
            } else if (sortBy.includes('release_date.asc') || sortBy === 'oldest') {
              rawList.sort((a, b) => {
                const dateA = a.release_date || a.first_air_date || '';
                const dateB = b.release_date || b.first_air_date || '';
                return dateA.localeCompare(dateB);
              });
            } else {
              // Default to popularity
              rawList.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            }

            // Deduplicate items by ID
            const seenIds = new Set();
            rawList = rawList.filter((item) => {
              if (!item || !item.id || seenIds.has(item.id)) return false;
              seenIds.add(item.id);
              return true;
            });

            const pageNum = parseInt(page) || 1;
            const pageSize = 20;
            const totalPages = Math.ceil(rawList.length / pageSize) || 1;
            const paginated = rawList.slice((pageNum - 1) * pageSize, pageNum * pageSize);

            return sendSuccess(res, {
              page: pageNum,
              total_pages: totalPages,
              total_results: rawList.length,
              results: paginated,
            });
          } catch {}
        }
      }

      const queryParams: Record<string, string> = {
        sort_by: tmdbSort,
        page,
      };

      if (isAnime) {
        queryParams.with_genres = '16';
        queryParams.with_original_language = 'ja';
      } else if (genre && genre !== 'All Genres') {
        const genreId = resolveGenreId(genre, isTv ? 'tv' : 'movie');
        if (genreId) queryParams.with_genres = genreId;
      }

      if (minRating && parseFloat(minRating) > 0) {
        queryParams['vote_average.gte'] = minRating;
        queryParams['vote_count.gte'] = '20';
      }

      if (year && year !== 'all') {
        if (year === '2020s') {
          queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = '2020-01-01';
          queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = '2029-12-31';
        } else if (year === '2010s') {
          queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = '2010-01-01';
          queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = '2019-12-31';
        } else if (year === '2000s') {
          queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = '2000-01-01';
          queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = '2009-12-31';
        } else if (year === '1990s') {
          queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = '1990-01-01';
          queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = '1999-12-31';
        } else if (year === 'classics') {
          queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = '1989-12-31';
        } else if (!isNaN(Number(year))) {
          if (isTv) {
            queryParams.first_air_date_year = year;
          } else {
            queryParams.primary_release_year = year;
          }
        }
      }

      if (yearMin) {
        queryParams[isTv ? 'first_air_date.gte' : 'primary_release_date.gte'] = `${yearMin}-01-01`;
      }
      if (yearMax) {
        queryParams[isTv ? 'first_air_date.lte' : 'primary_release_date.lte'] = `${yearMax}-12-31`;
      }

      if (withPeople) queryParams.with_people = withPeople;
      if (withCast) queryParams.with_cast = withCast;
      if (withCrew) queryParams.with_crew = withCrew;
      if (withOriginalLanguage) queryParams.with_original_language = withOriginalLanguage;
      if (req.query.dubbedLanguage && req.query.dubbedLanguage !== 'all') {
        queryParams.with_original_language = req.query.dubbedLanguage as string;
      }

      const data = await TmdbService.fetchFromTmdb(endpoint, queryParams);
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
