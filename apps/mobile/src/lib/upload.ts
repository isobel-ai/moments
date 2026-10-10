import { File } from 'expo-file-system';
import type { AudioFormat } from '@moments/types';

import { supabase } from './supabase';

/** The private storage bucket for audio. */
const AUDIO_BUCKET = 'audio';

/** Maps an AudioFormat to a valid MIME type for the audio bucket. */
const CONTENT_TYPES: Record<AudioFormat, string> = {
    m4a: 'audio/mp4',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
};

export interface UploadAudioInput {
    /** Local file URI from the recorder (e.g. `file:///.../recording.m4a`). */
    uri: string;
    /** Duration in seconds. */
    duration: number;
    format: AudioFormat;
}

export interface UploadAudioResult {
    /** Storage path within the private audio bucket (`<user_id>/<file>`). */
    path: string;
    fileName: string;
    format: AudioFormat;
    duration: number;
    /** Size in bytes. */
    size: number;
}

/**
 * Uploads an audio recording to the private `audio` bucket.
 *
 * Objects are stored under `<user_id>/<file>` to satisfy the storage RLS
 * policies, so the user must be signed in. Returns the storage path, which can
 * be used to create a Moment or request a signed URL.
 */
export async function uploadAudio(
    input: UploadAudioInput,
): Promise<UploadAudioResult> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('You must be signed in to upload audio.');
    }

    const fileName =
        input.uri.split('/').pop() ?? `recording-${Date.now()}.${input.format}`;

    const file = new File(input.uri);
    if (!file.exists) {
        throw new Error('The recording file could not be found. Please record again.');
    }
    const bytes = await file.bytes();

    const { error } = await supabase.storage
        .from(AUDIO_BUCKET)
        .upload(fileName, bytes, {
            contentType: CONTENT_TYPES[input.format],
            upsert: false,
        });

    if (error) throw error;

    return {
        path,
        fileName,
        format: input.format,
        duration: input.duration,
        size: bytes.byteLength,
    };
}
