-- ============================================================================
-- moments — notes & audio refactor
-- ============================================================================
-- Consolidates the per-moment note types (prayers, revelations, highlights)
-- into a single moment_notes table, and moves audio metadata fully into
-- moments_audio (removing the embedded audio fields from moments).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.moment_note_kind as enum (
  'prayer',
  'revelation',
  'reflection',
  'highlight'
);

-- ----------------------------------------------------------------------------
-- moment_notes
-- ----------------------------------------------------------------------------
-- A single table for every note attached to a moment. A note can be captured
-- during the recording (highlight, with a timestamp) or added after the fact
-- (prayer, revelation, reflection).

create table if not exists public.moment_notes (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete cascade,
    kind public.moment_note_kind not null,
    is_during_recording boolean not null default false,
    timestamp numeric,
    is_updated boolean not null default false,
    content text not null,
    created_at timestamptz not null default now()
);

create index moment_notes_moment_id_idx on public.moment_notes (moment_id);

create index moment_notes_user_id_idx on public.moment_notes (user_id);

-- ----------------------------------------------------------------------------
-- moments_audio: one audio per moment
-- ----------------------------------------------------------------------------
-- A moment has a single recording, so enforce a unique moment_id.

drop index if exists moments_audio_moment_id_idx;
create unique index moments_audio_moment_id_idx on public.moments_audio (moment_id);

-- ----------------------------------------------------------------------------
-- moments: remove embedded audio fields
-- ----------------------------------------------------------------------------
-- Audio metadata now lives entirely in moments_audio.

alter table public.moments
    drop column if exists audio_path,
    drop column if exists audio_format,
    drop column if exists audio_duration,
    drop column if exists audio_size,
    drop column if exists waveform,
    drop column if exists transcribed,
    drop column if exists transcript;

-- ----------------------------------------------------------------------------
-- Drop consolidated tables
-- ----------------------------------------------------------------------------

drop table if exists public.moment_prayers;

drop table if exists public.moment_revelations;

drop table if exists public.moment_highlights;

-- ----------------------------------------------------------------------------
-- Row-level security
-- ----------------------------------------------------------------------------

alter table public.moment_notes enable row level security;

-- moment_notes: access is granted through the owning moment.
drop policy if exists "Users can view own moment notes" on public.moment_notes;
create policy "Users can view own moment notes" on public.moment_notes for
select using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

drop policy if exists "Users can insert own moment notes" on public.moment_notes;
create policy "Users can insert own moment notes" on public.moment_notes for insert
with
    check (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

drop policy if exists "Users can update own moment notes" on public.moment_notes;
create policy "Users can update own moment notes" on public.moment_notes
for update
    using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

drop policy if exists "Users can delete own moment notes" on public.moment_notes;
create policy "Users can delete own moment notes" on public.moment_notes for delete using (
    exists (
        select 1
        from public.moments m
        where
            m.id = moment_id
            and m.user_id = auth.uid ()
    )
);
