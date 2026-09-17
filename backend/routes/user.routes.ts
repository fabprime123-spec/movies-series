/**
 * @file user.routes.ts
 * @description Express routing definition for user profile privacy and export.
 */

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export const userRouter = Router();

// Profile sanitization endpoint
userRouter.post('/profile/sanitize', UserController.sanitizeProfile);

// Secure export endpoint
userRouter.post('/export', UserController.exportData);
