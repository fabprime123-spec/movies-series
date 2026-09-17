/**
 * @file soundtrack.routes.ts
 * @description Express routing definition for original soundtracks and score tracklists.
 */

import { Router } from 'express';
import { SoundtrackController } from '../controllers/soundtrack.controller';

export const soundtrackRouter = Router();

// Soundtrack tracklist lookup and YouTube query generator
soundtrackRouter.get('/', SoundtrackController.getSoundtrack);
