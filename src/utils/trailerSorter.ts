import { MediaVideo } from '../types';

/**
 * Sorts trailers and video clips so that:
 * 1. Videos with "Official Trailer" or containing both "official" and "trailer" in the title come first.
 * 2. Other Trailers.
 * 3. Official Teasers.
 * 4. Teasers.
 * 5. Other promotional videos (clips, featurettes).
 */
export function sortVideosByOfficialTrailerFirst(videos: MediaVideo[]): MediaVideo[] {
  if (!videos || !Array.isArray(videos)) return [];

  return [...videos].sort((a, b) => {
    const getScore = (v: MediaVideo): number => {
      const name = (v.name || '').toLowerCase().trim();
      const type = (v.type || '').toLowerCase().trim();
      const isOfficial = Boolean(v.official) || name.includes('official');
      const hasTrailerWord = name.includes('trailer') || type.includes('trailer');

      // Priority 0: Name contains "official trailer" or "trailer official" (exact phrase)
      if (name.includes('official trailer') || name.includes('trailer official')) return 0;

      // Priority 1: Has both "official" and "trailer" anywhere in name or official flag + trailer in name
      if (name.includes('official') && name.includes('trailer')) return 1;
      if (isOfficial && name.includes('trailer')) return 2;

      // Priority 2: Official flagged and trailer type
      if (isOfficial && hasTrailerWord) return 3;

      // Priority 3: Any other Trailer (e.g. Teaser Trailer, Final Trailer, Main Trailer)
      if (hasTrailerWord) return 4;

      // Priority 4: Official Teasers
      if (isOfficial && (name.includes('teaser') || type.includes('teaser'))) return 5;

      // Priority 5: Teasers
      if (name.includes('teaser') || type.includes('teaser')) return 6;

      // Priority 6: Behind the scenes / Featurettes / Clips
      if (name.includes('clip') || type.includes('clip') || name.includes('featurette') || type.includes('featurette') || name.includes('behind')) return 7;

      return 8;
    };

    const scoreA = getScore(a);
    const scoreB = getScore(b);
    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }
    // Secondary sort: alphabetical by name for stability
    return (a.name || '').localeCompare(b.name || '');
  });
}
