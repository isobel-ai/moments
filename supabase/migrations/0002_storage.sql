-- ============================================================================
-- moments — storage buckets
-- ============================================================================
-- Private storage buckets for audio and artwork. Files are never publicly
-- accessible; the client requests signed URLs to stream them.
-- ============================================================================

-- Audio bucket (private)
insert into
    storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
values (
        'audio',
        'audio',
        false,
        52428800, -- 50 MiB
        array[
            'audio/m4a',
            'audio/mp4',
            'audio/mpeg',
            'audio/wav',
            'audio/aac',
            'audio/ogg'
        ]
    )
on conflict (id) do nothing;

-- Artwork bucket (private)
insert into
    storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
values (
        'artwork',
        'artwork',
        false,
        10485760, -- 10 MiB
        array[
            'image/jpeg',
            'image/png',
            'image/webp'
        ]
    )
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Storage policies
-- ----------------------------------------------------------------------------
-- Users can only access objects in their own folder. Objects are stored under
-- the path `<user_id>/<object>`.

create policy "Users can view own audio" on storage.objects for
select using (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can upload own audio" on storage.objects for insert
with
    check (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can update own audio" on storage.objects
for update
    using (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can delete own audio" on storage.objects for delete using (
    bucket_id = 'audio'
    and (storage.foldername (name)) [1] = auth.uid ()::text
);

create policy "Users can view own artwork" on storage.objects for
select using (
        bucket_id = 'artwork'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can upload own artwork" on storage.objects for insert
with
    check (
        bucket_id = 'artwork'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can update own artwork" on storage.objects
for update
    using (
        bucket_id = 'artwork'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

create policy "Users can delete own artwork" on storage.objects for delete using (
    bucket_id = 'artwork'
    and (storage.foldername (name)) [1] = auth.uid ()::text
);