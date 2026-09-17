/**
 * @file index.ts
 * @description Master router aggregating all backend REST sub-routers under /api:
 *              - /api/tmdb: Media catalog, search, discover, upcoming, actors
 *              - /api/recommendations: Curated multi-row recommendation rows
 *              - /api/soundtrack: Score and soundtrack tracklists
 *              - /api/user: User profile privacy and data export
 */

import { Router } from 'express';
import { mediaRouter } from './media.routes';
import { recommendationsRouter } from './recommendations.routes';
import { soundtrackRouter } from './soundtrack.routes';
import { userRouter } from './user.routes';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount domain routes
apiRouter.use('/tmdb', mediaRouter);
apiRouter.use('/recommendations', recommendationsRouter);
apiRouter.use('/soundtrack', soundtrackRouter);
apiRouter.use('/user', userRouter);
