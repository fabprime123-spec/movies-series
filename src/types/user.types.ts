/**
 * @file user.types.ts
 * @description Type definitions for user profile information, authentication state,
 *              and interface accent theme customizations.
 */

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export type AccentColor = 'orange' | 'crimson' | 'emerald' | 'indigo' | 'cyan' | 'amber';
