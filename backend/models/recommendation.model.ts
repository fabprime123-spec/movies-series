/**
 * @file recommendation.model.ts
 * @description Backend domain models for multi-tier curated recommendation rows
 *              (thematic similar, director spotlight, lead cast titles, genre benchmarks).
 */

export interface RecommendationRow {
  category: 'similar' | 'director' | 'actor' | 'benchmark';
  title: string;
  badgeText: string;
  subtitle: string;
  accentColor: string;
  items: any[];
}

export interface CuratedRecommendationsPayload {
  title: string;
  primaryGenre: string;
  directorName: string | null;
  rows: RecommendationRow[];
}
