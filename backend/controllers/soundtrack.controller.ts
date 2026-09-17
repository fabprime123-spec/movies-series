/**
 * @file soundtrack.controller.ts
 * @description Controller handling original score tracklist lookups, composer suites,
 *              lossless durations, and YouTube audio preview stream queries.
 */

import { Request, Response } from 'express';
import { SoundtrackService } from '../services/soundtrack.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';

export class SoundtrackController {
  /**
   * GET /api/soundtrack
   * Query params: title, composer, year
   */
  static async getSoundtrack(req: Request, res: Response) {
    try {
      const title = (req.query.title as string) || '';
      const composer = req.query.composer as string | undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;

      if (!title.trim()) {
        return sendError(res, 'Title query parameter is required', 400);
      }

      const data = SoundtrackService.getSoundtrack(title, composer, year);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch soundtrack data', 500);
    }
  }
}
