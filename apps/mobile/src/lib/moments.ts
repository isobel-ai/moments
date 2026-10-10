import type { Moment, CreateMomentInput } from '@moments/types';

import { supabase } from './supabase';

const MOMENTS_TABLE = 'moments';

export async function listMoments(): Promise<Moment[]> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Moment[];
}

export async function getMoment(id: string): Promise<Moment | null> {
  const { data, error } = await supabase
    .from(MOMENTS_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return (data as Moment) ?? null;
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
