/**
 * @file user.controller.ts
 * @description Controller safeguarding private user data, masking personally
 *              identifiable email addresses, and stripping internal tokens before export.
 */

import { Request, Response } from 'express';
import { RawUserPayload, SanitizedUserProfile, UserExportItem } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/apiResponse.util';

export class UserController {
  /**
   * POST /api/user/profile/sanitize
   * Strips auth tokens and masks user email addresses
   */
  static sanitizeProfile(req: Request, res: Response) {
    try {
      const rawUser = req.body?.user as RawUserPayload | undefined;
      if (!rawUser) {
        return sendSuccess(res, { success: true, profile: null });
      }

      const email = typeof rawUser.email === 'string' ? rawUser.email : '';
      const [localPart, domain] = email.split('@');

      const maskedEmail =
        localPart && domain ? `${localPart.slice(0, 2)}***@${domain}` : 'User';

      const sanitized: SanitizedUserProfile = {
        id: rawUser.uid || rawUser.id || 'guest',
        displayName: rawUser.displayName || rawUser.name || maskedEmail.split('@')[0],
        maskedEmail,
        avatar: rawUser.photoURL || rawUser.avatar || null,
        isCloudSynced: true,
        clientSafe: true,
      };

      return sendSuccess(res, { success: true, profile: sanitized });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to sanitize user profile', 500);
    }
  }

  /**
   * POST /api/user/export
   * Strips internal metadata and produces clean export JSON for user records
   */
  static exportData(req: Request, res: Response) {
    try {
      const { watchlist = [], history = [] } = req.body;

      const cleanWatchlist: UserExportItem[] = watchlist.map((item: any) => ({
        title: item.media?.title || item.title || 'Untitled',
        type: item.media?.type || item.type || 'movie',
        year: item.media?.releaseYear || item.releaseYear,
        rating: item.media?.ratings?.imdb || item.rating,
        status: item.status,
        addedAt: item.addedAt,
        personalRating: item.personalRating,
      }));

      const cleanHistory: UserExportItem[] = history.map((item: any) => ({
        title: item.media?.title || item.title || 'Untitled',
        type: item.media?.type || item.type || 'movie',
        viewedAt: item.timestamp || item.viewedAt,
      }));

      return sendSuccess(res, {
        success: true,
        exportedAt: new Date().toISOString(),
        watchlist: cleanWatchlist,
        history: cleanHistory,
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to export user cinema logs', 500);
    }
  }
}
