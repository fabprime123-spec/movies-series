/**
 * @file server.ts
 * @description Core Express server application entry point.
 *              Initializes backend middleware, mounts REST API routes under /api,
 *              integrates Vite development middleware, serves production static assets,
 *              and binds to port 3000 on host 0.0.0.0.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ENV_CONFIG } from './config/env.config';
import { apiRouter } from './routes';
import { requestLoggerMiddleware } from './middleware/logger.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import { backendLogger } from './utils/logger.util';

export async function createServer() {
  const app = express();

  // 1. Core middlewares
  app.use(express.json());
  app.use(requestLoggerMiddleware);

  // 2. Mount API Routes FIRST
  app.use('/api', apiRouter);

  // 3. Vite development middleware vs production static file serving
  if (ENV_CONFIG.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Centralized error handling
  app.use(errorHandlerMiddleware);

  return app;
}

export async function startServer() {
  const app = await createServer();
  const server = app.listen(ENV_CONFIG.PORT, '0.0.0.0', () => {
    backendLogger.info(
      'Server',
      `MovieAce Full-Stack Server active on http://0.0.0.0:${ENV_CONFIG.PORT} [${ENV_CONFIG.NODE_ENV}]`
    );
  });
  return server;
}

// Auto-boot if run directly
if (process.argv[1] && process.argv[1].includes('backend/server.ts')) {
  startServer().catch((err) => {
    backendLogger.error('ServerBoot', 'Failed to initialize server:', err);
    process.exit(1);
  });
}
