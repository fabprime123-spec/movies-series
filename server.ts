/**
 * @file server.ts
 * @description Workspace root server entry point delegating to backend/server.ts.
 *              Maintains seamless compatibility with dev server ("tsx server.ts")
 *              and production esbuild bundling ("esbuild server.ts --bundle ...").
 */

import { startServer } from './backend/server';

startServer().catch((error) => {
  console.error('[RootServer] Fatal server initialization error:', error);
  process.exit(1);
});
