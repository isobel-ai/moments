import { supabase } from './supabase';

const PROFILES_TABLE = 'profiles';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

/**
 * Fetches the current user's profile from the `profiles` table.
 * Returns `null` when there is no authenticated user or no profile row.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile) ?? null;
}
