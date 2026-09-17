/**
 * @file user.model.ts
 * @description Backend domain models for authenticated user sessions,
 *              masked user profiles, and exported user activity streams.
 */

export interface RawUserPayload {
  uid?: string;
  id?: string;
  email?: string | null;
  displayName?: string | null;
  name?: string | null;
  photoURL?: string | null;
  avatar?: string | null;
}

export interface SanitizedUserProfile {
  id: string;
  displayName: string;
  maskedEmail: string;
  avatar: string | null;
  isCloudSynced: boolean;
  clientSafe: boolean;
}

export interface UserExportItem {
  title: string;
  type: string;
  year?: number;
  rating?: number;
  status?: string;
  addedAt?: string;
  personalRating?: number;
  viewedAt?: number;
}
