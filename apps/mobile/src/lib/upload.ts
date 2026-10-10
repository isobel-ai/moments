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
    /** Optional original file name (defaults to the URI's last segment). */
    fileName?: string;
}

export interface UploadAudioResult {
    /** ID of the Moment created for this audio upload. */
    momentId: string;
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
 * Creates a Moment and its moments_audio metadata row for the uploaded file.
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
        input.fileName ??
        input.uri.split('/').pop() ??
        `recording-${Date.now()}.${input.format}`;
    const path = `${user.id}/${fileName}`;

    const file = new File(input.uri);
    if (!file.exists) {
        throw new Error('The recording file could not be found. Please record again.');
    }
    const bytes = await file.bytes();

    const { error } = await supabase.storage
        .from(AUDIO_BUCKET)
        .upload(path, bytes, {
            contentType: CONTENT_TYPES[input.format],
            upsert: false,
        });

    if (error) throw error;

    let momentId: string | undefined;
    try {
        const { data: moment, error: momentError } = await supabase
            .from('moments')
            .insert({
                user_id: user.id,
                title: 'Audio recording',
            })
            .select('id')
            .single();

        if (momentError) throw momentError;
        const createdMomentId = moment.id;
        momentId = createdMomentId;

        const { error: audioError } = await supabase
            .from('moments_audio')
            .insert({
                moment_id: createdMomentId,
                user_id: user.id,
                storage_path: path,
                file_name: fileName,
                format: input.format,
                duration: input.duration,
                size: bytes.byteLength,
            });

        if (audioError) throw audioError;

        return {
            momentId: createdMomentId,
            path,
            fileName,
            format: input.format,
            duration: input.duration,
            size: bytes.byteLength,
        };
    } catch (error) {
        const cleanupErrors: string[] = [];
        if (momentId) {
            const { error: momentCleanupError } = await supabase
                .from('moments')
                .delete()
                .eq('id', momentId)
                .eq('user_id', user.id);
            if (momentCleanupError) cleanupErrors.push(momentCleanupError.message);
        }

        const { error: storageCleanupError } = await supabase
            .storage
            .from(AUDIO_BUCKET)
            .remove([path]);
        if (storageCleanupError) cleanupErrors.push(storageCleanupError.message);

        if (cleanupErrors.length > 0) {
            const cause = error instanceof Error ? error.message : String(error);
            throw new Error(
                `Could not save the uploaded audio to the database: ${cause}. Cleanup also failed: ${cleanupErrors.join('; ')}`,
            );
        }
        throw error;
    }
}
