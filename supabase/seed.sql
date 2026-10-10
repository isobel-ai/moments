-- ============================================================================
-- moments — seed data
-- ============================================================================
-- Optional sample data for local development. Run with `supabase db reset`.
-- ============================================================================

-- A sample user (password: password123)
insert into
    auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at
    )
values (
        '00000000-0000-0000-0000-000000000001',
        'demo@moments.app',
        crypt (
            'password123',
            gen_salt ('bf')
        ),
        now()
    )
on conflict (id) do nothing;

insert into
    auth.identities (
        id,
        user_id,
        provider,
        identity_data,
        last_sign_in_at
    )
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'email',
        jsonb_build_object(
            'sub',
            '00000000-0000-0000-0000-000000000001'
        ),
        now()
    )
on conflict (id) do nothing;

-- A sample Moment
insert into
    public.moments (
        id,
        user_id,
        title,
        date,
        place,
        people,
        type,
        audio_path,
        audio_format,
        audio_duration,
        transcribed
    )
values (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'Morning quiet time',
        current_date,
        'Living room',
        '[{"id": "p1", "name": "Isobel"}]'::jsonb,
        'quiet_time',
        '00000000-0000-0000-0000-000000000001/quiet-time.m4a',
        'm4a',
        184,
        false
    )
on conflict (id) do nothing;

insert into
    public.moment_scriptures (
        moment_id,
        reference,
        translation,
        text
    )
values (
        '10000000-0000-0000-0000-000000000001',
        'Psalm 46:10',
        'NIV',
        'Be still, and know that I am God.'
    )
on conflict do nothing;

insert into
    public.moment_prayers (moment_id, content)
values (
        '10000000-0000-0000-0000-000000000001',
        'Lord, help me to be still and know that you are God.'
    )
on conflict do nothing;

insert into
    public.moment_revelations (moment_id, content)
values (
        '10000000-0000-0000-0000-000000000001',
        'Stillness is not emptiness — it is presence.'
    )
on conflict do nothing;

insert into
    public.moment_highlights (moment_id, timestamp, note)
values (
        '10000000-0000-0000-0000-000000000001',
        42,
        'The moment of stillness'
    )
on conflict do nothing;