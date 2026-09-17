/**
 * @file index.ts
 * @description Central barrel export file for all application types.
 *              Organized into domain-specific modules:
 *              - media.types: Movies, shows, anime, cast, crew, localization
 *              - watchlist.types: Watchlist records, history, status
 *              - user.types: Authentication profile, accent themes
 *              - filter.types: Catalog filtering, search, navigation tabs
 *              - upcoming.types: Theatrical countdowns, franchises, actors
 *              - soundtrack.types: Original motion picture scores & tracklists
 */

export * from './media.types';
export * from './watchlist.types';
export * from './user.types';
export * from './filter.types';
export * from './upcoming.types';
export * from './soundtrack.types';
