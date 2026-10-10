import type { MomentNote, MomentNoteKind, MomentScripture } from '@moments/types';

import { supabase } from './supabase';

const NOTES_TABLE = 'moment_notes';
const SCRIPTURES_TABLE = 'moment_scriptures';

/** Maps a snake_case `moment_notes` row to the camelCase domain shape. */
function normalizeNote(row: Record<string, any>): MomentNote {
  return {
    id: row.id,
    momentId: row.moment_id,
    kind: row.kind,
    isDuringRecording: row.is_during_recording,
    timestamp: row.timestamp ?? undefined,
    isUpdated: row.is_updated,
    content: row.content,
    createdAt: row.created_at,
  };
}

/** Maps a snake_case `moment_scriptures` row to the camelCase domain shape. */
function normalizeScripture(row: Record<string, any>): MomentScripture {
  return {
    id: row.id,
    reference: row.reference,
    passageKey: row.passage_key,
    bibleId: row.bible_id,
    translation: row.translation,
    text: row.text ?? undefined,
    note: row.note ?? undefined,
  };
}

export interface CreateNoteInput {
  momentId: string;
  kind: MomentNoteKind;
  content: string;
  isDuringRecording?: boolean;
  timestamp?: number;
  isUpdated?: boolean;
}

export async function createNote(input: CreateNoteInput): Promise<MomentNote> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to add a note.');
  }

  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .insert({
      moment_id: input.momentId,
      user_id: user.id,
      kind: input.kind,
      content: input.content,
      is_during_recording: input.isDuringRecording ?? false,
      timestamp: input.timestamp,
      is_updated: input.isUpdated ?? false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeNote(data);
}

export async function listNotes(momentId: string): Promise<MomentNote[]> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select('*')
    .eq('moment_id', momentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(normalizeNote);
}

export async function listScriptures(momentId: string): Promise<MomentScripture[]> {
  const { data, error } = await supabase
    .from(SCRIPTURES_TABLE)
    .select('*')
    .eq('moment_id', momentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(normalizeScripture);
}
