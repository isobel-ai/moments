/**
 * The core domain model for the moments platform.
 *
 * A Moment is the audio plus everything around it: the sound, the context,
 * the scripture that inspired it, the prayers prayed, the revelations received,
 * and the highlights worth returning to.
 */

import type { AudioAsset } from './audio';

/** The type of gathering or setting a Moment was captured in. */
export type MomentType =
  | 'quiet_time'
  | 'prayer'
  | 'living_room'
  | 'conference'
  | 'spontaneous'
  | 'worship'
  | 'other';

/** A person who was present during a Moment. */
export interface MomentPerson {
  id: string;
  name: string;
  role?: string;
}

/** A scripture reference attached to a Moment. */
export interface MomentScripture {
  id: string;
  /** e.g. "John 3:16" */
  reference: string;
  /** The translation code, e.g. "NIV", "ESV", "KJV". */
  translation: string;
  /** The verse text, if captured. */
  text?: string;
  /** Optional note about why this verse was referenced. */
  note?: string;
}

/** A prayer prayed during or because of a Moment. */
export interface MomentPrayer {
  id: string;
  content: string;
  /** ISO timestamp of when the prayer was recorded. */
  prayedAt: string;
}

/** A revelation — something learned or understood during a Moment. */
export interface MomentRevelation {
  id: string;
  content: string;
  /** ISO timestamp of when the revelation was recorded. */
  createdAt: string;
}

/** A meaningful timestamp within the audio, with a short note. */
export interface MomentHighlight {
  id: string;
  /** Position in the audio, in seconds. */
  timestamp: number;
  note: string;
}

/** The core object of the platform. */
export interface Moment {
  id: string;
  /** The owner of the Moment. */
  userId: string;
  title: string;
  /** ISO date of when the Moment happened. */
  date: string;
  place?: string;
  people: MomentPerson[];
  type: MomentType;
  /** Storage path to the artwork image. */
  artworkPath?: string;
  /** The audio asset for this Moment. */
  audio: AudioAsset;
  scriptures: MomentScripture[];
  prayers: MomentPrayer[];
  revelations: MomentRevelation[];
  highlights: MomentHighlight[];
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a new Moment. */
export type CreateMomentInput = Omit<
  Moment,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

/** Payload for updating an existing Moment. */
export type UpdateMomentInput = Partial<CreateMomentInput>;
