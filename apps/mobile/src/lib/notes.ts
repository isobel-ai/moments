import type { MomentNote, MomentNoteKind, MomentScripture } from '@moments/types';

import { supabase } from './supabase';

const NOTES_TABLE = 'moment_notes';
const SCRIPTURES_TABLE = 'moment_scriptures';

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
  return data as MomentNote;
}

export async function listNotes(momentId: string): Promise<MomentNote[]> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select('*')
    .eq('moment_id', momentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as MomentNote[];
}

export async function listScriptures(momentId: string): Promise<MomentScripture[]> {
  const { data, error } = await supabase
    .from(SCRIPTURES_TABLE)
    .select('*')
    .eq('moment_id', momentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as MomentScripture[];
}
