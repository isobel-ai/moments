import type { MomentNote, MomentScripture } from '@moments/types';

import { supabase } from './supabase';

const NOTES_TABLE = 'moment_notes';
const SCRIPTURES_TABLE = 'moment_scriptures';

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
