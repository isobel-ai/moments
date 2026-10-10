import type { MomentScripture } from '@moments/types';

import { supabase } from './supabase';

const TABLE = 'moment_scriptures';

export interface CreateScriptureInput {
  momentId: string;
  reference: string;
  passageKey: string;
  bibleId: string;
  translation: string;
  text?: string;
  note?: string;
}

export async function createScripture(
  input: CreateScriptureInput,
): Promise<MomentScripture> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      moment_id: input.momentId,
      reference: input.reference,
      passage_key: input.passageKey,
      bible_id: input.bibleId,
      translation: input.translation,
      text: input.text,
      note: input.note,
    })
    .select()
    .single();

  if (error) throw error;
  return data as MomentScripture;
}
