/**
 * @file recommendations.service.ts
 * @description Curated IMDb-style recommendation engine that synthesizes
 *              thematic similarities, director spotlights, lead cast crossovers,
 *              and genre benchmark classics.
 */

import { TmdbService } from './tmdb.service';
import { backendCache } from './cache.service';
import { CuratedRecommendationsPayload, RecommendationRow } from '../models/recommendation.model';
import { backendLogger } from '../utils/logger.util';

export class RecommendationsService {
  /**
   * Generates multi-row curated recommendations for a given media title
   */
  static async getCuratedRecommendations(
    type: string,
    id: string
  ): Promise<CuratedRecommendationsPayload> {
    const mediaType = type === 'tv' || type === 'anime' ? 'tv' : 'movie';
    const cacheKey = `curated_recs_${mediaType}_${id}`;

    const cached = backendCache.get<CuratedRecommendationsPayload>(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Fetch media details with append_to_response
    const details = await TmdbService.fetchFromTmdb<any>(`/${mediaType}/${id}`, {
      append_to_response: 'credits,recommendations,similar',
    });

    const title = details.title || details.name || 'This Title';
    const primaryGenre = details.genres?.[0]?.name || 'Cinema';
    const primaryGenreId = details.genres?.[0]?.id ? String(details.genres[0].id) : '';

    // Extract director or creator
    const director = details.credits?.crew?.find(
      (c: any) => c.job === 'Director' || c.job === 'Creator'
    );
    const directorName = director?.name || null;
    const directorId = director?.id || null;

    // Extract lead actor
    const leadActor = details.credits?.cast?.[0];
    const leadActorName = leadActor?.name || null;
    const leadActorId = leadActor?.id || null;

    const rows: RecommendationRow[] = [];

    // Row 1: Thematic Matches & Official Recommendations
    const rawRecommendations = [
      ...(details.recommendations?.results || []),
      ...(details.similar?.results || []),
    ];

    const uniqueRecMap = new Map<number, any>();
    rawRecommendations.forEach((item: any) => {
      if (item && item.id && item.id !== Number(id) && !uniqueRecMap.has(item.id)) {
        uniqueRecMap.set(item.id, item);
      }
    });

    const moreLikeThisItems = Array.from(uniqueRecMap.values()).slice(0, 14);

    if (moreLikeThisItems.length > 0) {
      rows.push({
        category: 'similar',
        title: 'More Like This',
        badgeText: 'Curated Match',
        subtitle: `Curated thematic companions matching the tone and world of ${title}`,
        accentColor: 'orange',
        items: moreLikeThisItems,
      });
    }

    // Row 2: Director / Creator Spotlight
    if (directorId && directorName) {
      try {
        const directorCredits = await TmdbService.fetchFromTmdb<any>(
          `/person/${directorId}/combined_credits`
        );
        const directedWorks = (directorCredits?.crew || [])
          .filter(
            (work: any) =>
              (work.job === 'Director' || work.job === 'Creator') &&
              work.id !== Number(id) &&
              work.poster_path
          )
          .sort((a: any, b: any) => (b.vote_count || 0) - (a.vote_count || 0))
          .slice(0, 12);

        if (directedWorks.length > 0) {
          rows.push({
            category: 'director',
            title: `Directed by ${directorName}`,
            badgeText: 'Filmmaker Canon',
            subtitle: `Notable cinema craft and vision from director ${directorName}`,
            accentColor: 'indigo',
            items: directedWorks,
          });
        }
      } catch (err) {
        backendLogger.warn('RecommendationsService', `Could not fetch director works: ${err}`);
      }
    }

    // Row 3: Lead Actor Spotlight
    if (leadActorId && leadActorName) {
      try {
        const actorCredits = await TmdbService.fetchFromTmdb<any>(
          `/person/${leadActorId}/combined_credits`
        );
        const starredWorks = (actorCredits?.cast || [])
          .filter((work: any) => work.id !== Number(id) && work.poster_path)
          .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 12);

        if (starredWorks.length > 0) {
          rows.push({
            category: 'actor',
            title: `Starring ${leadActorName}`,
            badgeText: 'Cast Spotlight',
            subtitle: `Celebrated performances and filmography starring ${leadActorName}`,
            accentColor: 'amber',
            items: starredWorks,
          });
        }
      } catch (err) {
        backendLogger.warn('RecommendationsService', `Could not fetch actor works: ${err}`);
      }
    }

    // Row 4: Top Benchmark Classics in Primary Genre
    if (primaryGenreId) {
      try {
        const genreBenchmarks = await TmdbService.fetchFromTmdb<any>(`/discover/${mediaType}`, {
          with_genres: primaryGenreId,
          sort_by: 'vote_average.desc',
          'vote_count.gte': '800',
        });

        const benchmarkItems = (genreBenchmarks?.results || [])
          .filter((item: any) => item.id !== Number(id) && item.poster_path)
          .slice(0, 12);

        if (benchmarkItems.length > 0) {
          rows.push({
            category: 'benchmark',
            title: `Essential ${primaryGenre} Masterpieces`,
            badgeText: 'Genre Benchmark',
            subtitle: `Highest rated cinematic landmarks defining the ${primaryGenre} landscape`,
            accentColor: 'emerald',
            items: benchmarkItems,
          });
        }
      } catch (err) {
        backendLogger.warn('RecommendationsService', `Could not fetch genre benchmarks: ${err}`);
      }
    }

    const payload: CuratedRecommendationsPayload = {
      title,
      primaryGenre,
      directorName,
      rows,
    };

    backendCache.set(cacheKey, payload, 10 * 60 * 1000); // 10 min cache
    return payload;
  }
}
