/**
 * @file genreMapper.util.ts
 * @description Utility for mapping natural language film and TV genre names
 *              to TMDB numeric genre IDs for both movies and series.
 */

export const GENRE_MAP: Record<string, { movie: string; tv: string }> = {
  Action: { movie: '28', tv: '10759' },
  Adventure: { movie: '12', tv: '10759' },
  Animation: { movie: '16', tv: '16' },
  Anime: { movie: '16', tv: '16' },
  Comedy: { movie: '35', tv: '35' },
  Crime: { movie: '80', tv: '80' },
  Documentary: { movie: '99', tv: '99' },
  Drama: { movie: '18', tv: '18' },
  Family: { movie: '10751', tv: '10751' },
  Fantasy: { movie: '14', tv: '10765' },
  History: { movie: '36', tv: '36' },
  Horror: { movie: '27', tv: '27' },
  Music: { movie: '10402', tv: '10402' },
  Mystery: { movie: '9648', tv: '9648' },
  Romance: { movie: '10749', tv: '10749' },
  'Sci-Fi': { movie: '878', tv: '10765' },
  Thriller: { movie: '53', tv: '53' },
  War: { movie: '10752', tv: '10768' },
  Western: { movie: '37', tv: '37' },
};

/**
 * Resolves genre name or id to TMDB genre ID string
 */
export function resolveGenreId(genre: string, mediaType: 'movie' | 'tv'): string {
  if (!genre || genre === 'All Genres') return '';
  if (/^\d+$/.test(genre)) return genre;
  const mapped =
    GENRE_MAP[genre] ||
    Object.entries(GENRE_MAP).find(
      ([k]) => k.toLowerCase() === genre.toLowerCase()
    )?.[1];
  return mapped ? mapped[mediaType] : genre;
}
