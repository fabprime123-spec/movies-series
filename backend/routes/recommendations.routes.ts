/**
 * @file recommendations.routes.ts
 * @description Express routing definition for curated multi-row title recommendations.
 */

import { Router } from 'express';
import { RecommendationsController } from '../controllers/recommendations.controller';

export const recommendationsRouter = Router();

// Curated IMDb-style recommendation rows for media title
recommendationsRouter.get('/:type/:id', RecommendationsController.getRecommendations);
