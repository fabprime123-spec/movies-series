/**
 * @file recommendations.controller.ts
 * @description Controller delivering curated IMDb-style multi-row recommendations
 *              including thematic lookalikes, director filmography, and genre classics.
 */

import { Request, Response } from 'express';
import { RecommendationsService } from '../services/recommendations.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';

export class RecommendationsController {
  /**
   * GET /api/recommendations/:type/:id
   * Retrieves categorized multi-row recommendations for a specific movie or series
   */
  static async getRecommendations(req: Request, res: Response) {
    try {
      const { type, id } = req.params;
      const data = await RecommendationsService.getCuratedRecommendations(type, id);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to generate recommendations', 500);
    }
  }
}
