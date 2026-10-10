-- ============================================================================
-- moments — initial schema
-- ============================================================================
-- A Moment is the audio plus everything around it. This migration creates the
-- core tables, enums, indexes, and row-level security policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type public.moment_type as enum (
  'quiet_time',
  'prayer',
  'living_room',
  'conference',
  'spontaneous',
  'worship',
  'other'
);

create type public.audio_format as enum ('m4a', 'mp3', 'wav', 'aac', 'ogg');

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
-- User profile data, linked to the auth.users table.

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text unique,
    display_name text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- moments
-- ----------------------------------------------------------------------------

create table if not exists public.moments (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references auth.users (id) on delete cascade,
    title text not null,
    date date not null default current_date,
    place text,
    people jsonb not null default '[]'::jsonb,
    type public.moment_type not null default 'other',
    artwork_path text,
    audio_path text not null,
    audio_format public.audio_format not null default 'm4a',
    audio_duration numeric not null default 0,
    audio_size bigint not null default 0,
    waveform jsonb,
    transcribed boolean not null default false,
    transcript text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.moments is 'The core object of the platform: the audio plus everything around it.';

create index moments_user_id_idx on public.moments (user_id);

create index moments_date_idx on public.moments (date desc);

create index moments_user_date_idx on public.moments (user_id, date desc);

-- ----------------------------------------------------------------------------
-- moments_audio
-- ----------------------------------------------------------------------------
-- Audio files attached to a moment. Each row references the owning moment and
-- points to a file in the private audio storage bucket.

create table if not exists public.moments_audio (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete cascade,
    storage_path text not null,
    file_name text,
    format public.audio_format not null default 'm4a',
    duration numeric not null default 0,
    size bigint not null default 0,
    waveform jsonb,
    transcribed boolean not null default false,
    transcript text,
    created_at timestamptz not null default now()
);

create index moments_audio_moment_id_idx on public.moments_audio (moment_id);

create index moments_audio_user_id_idx on public.moments_audio (user_id);

-- ----------------------------------------------------------------------------
-- moment_scriptures
-- ----------------------------------------------------------------------------

create table public.moment_scriptures (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    reference text not null,
    translation text not null default 'NIV',
    text text,
    note text,
    created_at timestamptz not null default now()
);

create index moment_scriptures_moment_id_idx on public.moment_scriptures (moment_id);

-- ----------------------------------------------------------------------------
-- moment_prayers
-- ----------------------------------------------------------------------------

create table public.moment_prayers (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    content text not null,
    prayed_at timestamptz not null default now()
);

create index moment_prayers_moment_id_idx on public.moment_prayers (moment_id);

-- ----------------------------------------------------------------------------
-- moment_revelations
-- ----------------------------------------------------------------------------

create table public.moment_revelations (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now()
);

create index moment_revelations_moment_id_idx on public.moment_revelations (moment_id);

-- ----------------------------------------------------------------------------
-- moment_highlights
-- ----------------------------------------------------------------------------

create table public.moment_highlights (
    id uuid primary key default gen_random_uuid (),
    moment_id uuid not null references public.moments (id) on delete cascade,
    timestamp numeric not null,
    note text not null,
    created_at timestamptz not null default now()
);

create index moment_highlights_moment_id_idx on public.moment_highlights (moment_id);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger moments_set_updated_at
  before update on public.moments
  for each row
  execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row-level security
-- ----------------------------------------------------------------------------

alter table public.profiles enable row level security;

alter table public.moments enable row level security;

alter table public.moments_audio enable row level security;

alter table public.moment_scriptures enable row level security;

alter table public.moment_prayers enable row level security;

alter table public.moment_revelations enable row level security;

alter table public.moment_highlights enable row level security;

-- profiles: users can only access their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for
select using (auth.uid () = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert
with
    check (auth.uid () = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update
    using (auth.uid () = id)
with
    check (auth.uid () = id);

-- moments: users can only access their own rows
drop policy if exists "Users can view own moments" on public.moments;
create policy "Users can view own moments" on public.moments for
select using (auth.uid () = user_id);

drop policy if exists "Users can insert own moments" on public.moments;
create policy "Users can insert own moments" on public.moments for insert
with
    check (auth.uid () = user_id);

drop policy if exists "Users can update own moments" on public.moments;
create policy "Users can update own moments" on public.moments
for update
    using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

drop policy if exists "Users can delete own moments" on public.moments;
create policy "Users can delete own moments" on public.moments for delete using (auth.uid () = user_id);

-- moments_audio: users can only access their own audio
drop policy if exists "Users can view own moment audio" on public.moments_audio;
create policy "Users can view own moment audio" on public.moments_audio for
select using (auth.uid () = user_id);

drop policy if exists "Users can insert own moment audio" on public.moments_audio;
create policy "Users can insert own moment audio" on public.moments_audio for insert
with
    check (auth.uid () = user_id);

drop policy if exists "Users can update own moment audio" on public.moments_audio;
create policy "Users can update own moment audio" on public.moments_audio
for update
    using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

drop policy if exists "Users can delete own moment audio" on public.moments_audio;
create policy "Users can delete own moment audio" on public.moments_audio for delete using (auth.uid () = user_id);

-- Child tables: access is granted through the owning moment.
create policy "Users can view own moment scriptures" on public.moment_scriptures for
select using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

create policy "Users can insert own moment scriptures" on public.moment_scriptures for insert
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

create policy "Users can update own moment scriptures" on public.moment_scriptures
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

create policy "Users can delete own moment scriptures" on public.moment_scriptures for delete using (
    exists (
        select 1
        from public.moments m
        where
            m.id = moment_id
            and m.user_id = auth.uid ()
    )
);

create policy "Users can view own moment prayers" on public.moment_prayers for
select using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

create policy "Users can insert own moment prayers" on public.moment_prayers for insert
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

create policy "Users can update own moment prayers" on public.moment_prayers
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

create policy "Users can delete own moment prayers" on public.moment_prayers for delete using (
    exists (
        select 1
        from public.moments m
        where
            m.id = moment_id
            and m.user_id = auth.uid ()
    )
);

create policy "Users can view own moment revelations" on public.moment_revelations for
select using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

create policy "Users can insert own moment revelations" on public.moment_revelations for insert
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

create policy "Users can update own moment revelations" on public.moment_revelations
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

create policy "Users can delete own moment revelations" on public.moment_revelations for delete using (
    exists (
        select 1
        from public.moments m
        where
            m.id = moment_id
            and m.user_id = auth.uid ()
    )
);

create policy "Users can view own moment highlights" on public.moment_highlights for
select using (
        exists (
            select 1
            from public.moments m
            where
                m.id = moment_id
                and m.user_id = auth.uid ()
        )
    );

create policy "Users can insert own moment highlights" on public.moment_highlights for insert
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

create policy "Users can update own moment highlights" on public.moment_highlights
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

create policy "Users can delete own moment highlights" on public.moment_highlights for delete using (
    exists (
        select 1
        from public.moments m
        where
            m.id = moment_id
            and m.user_id = auth.uid ()
    )
);