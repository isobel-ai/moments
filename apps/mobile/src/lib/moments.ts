import type { Moment, CreateMomentInput, AudioAsset } from '@moments/types';

import { supabase } from './supabase';

const MOMENTS_TABLE = 'moments';
const AUDIO_TABLE = 'moments_audio';

/**
 * Normalises a raw `moments` row (with its nested `moments_audio` relation) into
 * the `Moment` domain shape. Audio lives in a separate table, so we pull it out
 * of the nested relation and attach it to the `audio` field.
 */
function normalizeMoment(row: Record<string, unknown>): Moment {
  const audioRow = Array.isArray(row.moments_audio)
    ? row.moments_audio[0]
    : row.moments_audio;

  const { moments_audio, ...moment } = row;

  return {
    ...moment,
    audio: audioRow
      ? {
          path: audioRow.storage_path,
          fileName: audioRow.file_name,
          format: audioRow.format,
          duration: audioRow.duration,
          size: audioRow.size,
          waveform: audioRow.waveform,
          transcribed: audioRow.transcribed,
          transcript: audioRow.transcript,
        }
      : {
          path: '',
          fileName: '',
          format: 'm4a',
          duration: 0,
          size: 0,
          transcribed: false,
        },
  } as Moment;
}

export async function listMoments(): Promise<Moment[]> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .select('*, moments_audio(*)')
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeMoment);
}

export async function getMoment(id: string): Promise<Moment | null> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .select('*, moments_audio(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? normalizeMoment(data) : null;
}

/**
 * Fetches the audio asset for a moment from the `moments_audio` table.
 * Returns `null` when the moment has no recording yet.
 */
export async function getMomentAudio(
  momentId: string,
): Promise<AudioAsset | null> {
  const { data, error } = await supabase
    .from(AUDIO_TABLE)
    .select('*')
    .eq('moment_id', momentId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    path: data.storage_path,
    fileName: data.file_name,
    format: data.format,
    duration: data.duration,
    size: data.size,
    waveform: data.waveform,
    transcribed: data.transcribed,
    transcript: data.transcript,
  };
}

export async function createMoment(
  input: CreateMomentInput,
): Promise<Moment> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Moment;
}

/**
 * Create a minimal moment with just a title. Other columns (date, people, type)
 * use their database defaults. Useful for attaching scripture before recording.
 */
export async function createMomentForScripture(title: string): Promise<Moment> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .insert({ title })
    .select()
    .single();

  if (error) throw error;
  return data as Moment;
}

export async function updateMoment(
  id: string,
  input: Partial<CreateMomentInput>,
): Promise<Moment> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Moment;
}

export async function deleteMoment(id: string): Promise<void> {
  const { error } = await supabase.from(MOMENTS_TABLE).delete().eq('id', id);
  if (error) throw error;
}
