-- ============================================================================
-- moments — bible passages
-- ============================================================================
-- Extends moment_scriptures with the api.bible passage key and bibleId so a
-- scripture reference can be resolved back to a passage on the api.bible API.
-- ============================================================================

alter table public.moment_scriptures
    add column if not exists passage_key text,
    add column if not exists bible_id text;

-- A passage key is unique per translation, so index it for lookups.
create index if not exists moment_scriptures_passage_key_idx
    on public.moment_scriptures (passage_key);

create index if not exists moment_scriptures_bible_id_idx
    on public.moment_scriptures (bible_id);
