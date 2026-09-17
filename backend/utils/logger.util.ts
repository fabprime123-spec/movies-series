/**
 * @file logger.util.ts
 * @description Structured console logger utility providing categorized,
 *              timestamped logging for backend routes, controllers, and services.
 */

export const backendLogger = {
  info: (tag: string, message: string, ...args: unknown[]) => {
    console.log(`[INFO][${new Date().toISOString()}][${tag}] ${message}`, ...args);
  },
  warn: (tag: string, message: string, ...args: unknown[]) => {
    console.warn(`[WARN][${new Date().toISOString()}][${tag}] ${message}`, ...args);
  },
  error: (tag: string, message: string, ...args: unknown[]) => {
    console.error(`[ERROR][${new Date().toISOString()}][${tag}] ${message}`, ...args);
  },
};
