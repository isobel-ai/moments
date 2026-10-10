-- ============================================================================
-- moments — storage buckets
-- ============================================================================
-- Private storage bucket for audio. Files are never publicly accessible; the
-- client requests signed URLs to stream them.
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

-- ----------------------------------------------------------------------------
-- Storage policies
-- ----------------------------------------------------------------------------
-- Users can only access objects in their own folder. Objects are stored under
-- the path `<user_id>/<object>`.

drop policy if exists "Users can view own audio" on storage.objects;
create policy "Users can view own audio" on storage.objects for
select using (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

drop policy if exists "Users can upload own audio" on storage.objects;
create policy "Users can upload own audio" on storage.objects for insert
with
    check (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

drop policy if exists "Users can update own audio" on storage.objects;
create policy "Users can update own audio" on storage.objects
for update
    using (
        bucket_id = 'audio'
        and (storage.foldername (name)) [1] = auth.uid ()::text
    );

drop policy if exists "Users can delete own audio" on storage.objects;
create policy "Users can delete own audio" on storage.objects for delete using (
    bucket_id = 'audio'
    and (storage.foldername (name)) [1] = auth.uid ()::text
);