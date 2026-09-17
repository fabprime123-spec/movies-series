/**
 * @file env.config.ts
 * @description Centralized environment configuration and security credentials loader.
 *              Validates environment variables and provides fallback configurations.
 */

import dotenv from 'dotenv';
dotenv.config();

export interface ServerEnvConfig {
  PORT: number;
  NODE_ENV: string;
  TMDB_TOKEN: string;
  CACHE_TTL_MS: number;
}

export const ENV_CONFIG: ServerEnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  TMDB_TOKEN:
    process.env.TMDB_TOKEN ||
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjU0NzJmOTdiNGUyMTRjZjZkMDMxZmUyMDVjNzVlMyIsIm5iZiI6MTc3NTgzOTU4NC44MDQ5OTk4LCJzdWIiOiI2OWQ5Mjk2MDlkM2RhODI2OGYwMjY2NzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.i2zWeCNYyzyVYjlH8rJPuBfq_tRPc_DjUBH5qBGmC5E',
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes default in-memory cache TTL
};
