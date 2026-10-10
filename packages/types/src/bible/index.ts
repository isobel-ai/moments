/**
 * Bible reference helpers for the moments platform.
 *
 * These are pure functions that build the api.bible passage key and the
 * human-readable reference from a book, chapter, and verse range. They are
 * shared between the mobile form and any server-side code.
 */

export * from './books';
export * from './translations';

/**
 * Build an api.bible passage key from a verse range.
 *
 * A passage key is two verse IDs joined by `-`, e.g. `JHN.3.1-JHN.3.16`. For a
 * single verse the start and end are the same, producing `JHN.3.16-JHN.3.16`.
 */
export function buildPassageKey(
  bookId: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): string {
  const start = `${bookId}.${chapter}.${startVerse}`;
  const end = `${bookId}.${chapter}.${endVerse}`;
  return `${start}-${end}`;
}

/**
 * Build a human-readable reference from a verse range.
 *
 * - Single verse: `John 3:16`
 * - Range: `John 3:1 - John 3:16`
 */
export function buildReference(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): string {
  if (startVerse === endVerse) {
    return `${bookName} ${chapter}:${startVerse}`;
  }
  return `${bookName} ${chapter}:${startVerse} - ${bookName} ${chapter}:${endVerse}`;
}
