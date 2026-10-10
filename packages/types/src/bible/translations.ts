/**
 * Static list of Bible translations the user can pick from.
 *
 * The `id` is the api.bible `bibleId` (a long hash) required to fetch chapters,
 * verses, and passage content. The `abbreviation` is the human-readable code
 * (e.g. "KJV") stored in `moment_scriptures.translation`.
 *
 * NOTE: Verify these `bibleId` values against your api.bible dashboard — they
 * are the well-known defaults but can change per account/team. You can also
 * fetch the full list at runtime via the `bible` edge function's `bibles`
 * action if you'd rather not hardcode them.
 */

export interface BibleTranslation {
  /** api.bible bibleId, e.g. "de4e12af7f28f599". */
  id: string;
  /** Human-readable translation name, e.g. "King James Version". */
  name: string;
  /** Short code stored in the DB, e.g. "KJV". */
  abbreviation: string;
}

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { id: 'de4e12af7f28f599-01', name: 'King James Version', abbreviation: 'KJV' },
  { id: '9879dbb7cfe39e4d-04', name: 'World English Bible', abbreviation: 'WEB' },
  { id: 'f72b840c855f362c-04', name: 'World Messianic Bible', abbreviation: 'WMB' },
];
