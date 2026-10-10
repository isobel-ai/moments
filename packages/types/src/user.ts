/** User-related types for the moments platform. */

/** A user of the moments platform. */
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

/** The user's preferences. */
export interface UserPreferences {
  userId: string;
  /** Default translation for scripture references. */
  defaultTranslation: string;
  /** Whether to auto-transcribe new recordings. */
  autoTranscribe: boolean;
}
