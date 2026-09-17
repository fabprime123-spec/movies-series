/**
 * @file media.routes.ts
 * @description Express routing definition for TMDB film, series, and cast queries.
 */

import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';

export const mediaRouter = Router();

// Trending releases
mediaRouter.get('/trending', MediaController.getTrending);

// Discover by genre & media type
mediaRouter.get('/discover', MediaController.getDiscover);

// Complete title details with cast, videos, images, and providers
mediaRouter.get('/details/:type/:id', MediaController.getDetails);

// High-resolution posters, backdrops, and logos
mediaRouter.get('/images/:type/:id', MediaController.getImages);

// Multi-category search
mediaRouter.get('/search', MediaController.search);

// Upcoming theatrical releases & TV airings
mediaRouter.get('/upcoming', MediaController.getUpcoming);

// Person / actor profile
mediaRouter.get('/person/:id', MediaController.getPerson);

// Person filmography credits
mediaRouter.get('/person/:id/credits', MediaController.getPersonCredits);

// Popular actor directory (both /actors and /popular-actors)
mediaRouter.get('/actors', MediaController.getPopularActors);
mediaRouter.get('/popular-actors', MediaController.getPopularActors);

// Multi-attribute faceted filter
mediaRouter.get('/filter', MediaController.filterMedia);
