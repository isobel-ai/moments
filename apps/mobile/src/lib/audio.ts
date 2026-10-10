import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  createAudioPlayer,
  type AudioRecorder,
  type AudioStatus,
} from 'expo-audio';
import type { AudioAsset, AudioFormat } from '@moments/types';

import { supabase } from './supabase';

export interface RecordingResult {
  uri: string;
  duration: number;
  format: AudioFormat;
}

/**
 * Hook that manages an audio recorder using expo-audio (SDK 57).
 *
 * Note: For background playback and lock-screen controls, migrate to
 * react-native-track-player (see docs/decisions/0002-audio-playback.md).
 */
export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const start = async (): Promise<void> => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Microphone permission is required to record audio.');
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stop = async (): Promise<RecordingResult> => {
    await recorder.stop();
    const uri = recorder.uri;
    if (!uri) {
      throw new Error('Recording failed to produce a file.');
    }

    return {
      uri,
      duration: recorder.currentTime,
      format: 'm4a',
    };
  };

  return {
    recorder,
    start,
    stop,
    isRecording: recorder.isRecording,
  };
}

export function toAudioAsset(
  result: RecordingResult,
  path: string,
): AudioAsset {
  return {
    path,
    fileName: path.split('/').pop() ?? 'recording.m4a',
    format: result.format,
    duration: result.duration,
    size: 0,
    transcribed: false,
  };
}

export type { AudioRecorder };

/** Maps a file extension to the supported audio format. */
const AUDIO_EXTENSIONS: Record<string, AudioFormat> = {
  m4a: 'm4a',
  mp4: 'm4a',
  mp3: 'mp3',
  wav: 'wav',
  aac: 'aac',
  ogg: 'ogg',
};

/**
 * Detects the audio format of a file from its name and/or MIME type.
 * Returns `null` when the format is not supported.
 */
export function detectAudioFormat(
  fileName: string,
  mimeType?: string,
): AudioFormat | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext && AUDIO_EXTENSIONS[ext]) {
    return AUDIO_EXTENSIONS[ext];
  }

  if (mimeType) {
    const mime = mimeType.toLowerCase();
    if (mime.includes('mpeg')) return 'mp3';
    if (mime.includes('mp4')) return 'm4a';
    if (mime.includes('wav')) return 'wav';
    if (mime.includes('aac')) return 'aac';
    if (mime.includes('ogg')) return 'ogg';
  }

  return null;
}

/**
 * Reads the duration (in seconds) of an existing audio file.
 */
export async function getAudioDuration(uri: string): Promise<number> {
  const player = createAudioPlayer(uri);

  // The `SharedObject` type alias in expo-modules-core resolves to the
  // constructor type, so `addListener` is not visible on `AudioPlayer`.
  const playerWithEvents = player as unknown as {
    addListener(
      event: 'playbackStatusUpdate',
      listener: (status: AudioStatus) => void,
    ): { remove: () => void };
    remove(): void;
  };

  return new Promise<number>((resolve, reject) => {
    let timeout: ReturnType<typeof setTimeout>;
    let subscription: { remove: () => void } | null = null;
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      subscription?.remove();
      playerWithEvents.remove();
    };

    timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Could not read the audio duration.'));
    }, 10000);

    subscription = playerWithEvents.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded && status.duration > 0) {
        cleanup();
        resolve(status.duration);
      }
    });
  });
}

const SIGNED_URL_FUNCTION = 'signed-url';
const AUDIO_BUCKET = 'audio';

/**
 * Requests a short-lived signed URL for a private audio object so it can be
 * streamed by the audio player. Files stay private; the client never gets a
 * permanent URL.
 */
export async function getSignedAudioUrl(path: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ signedUrl: string }>(
    SIGNED_URL_FUNCTION,
    {
      body: { bucket: AUDIO_BUCKET, path },
    },
  );

  if (error || !data) {
    throw new Error(error?.message || 'Failed to get a signed audio URL');
  }

  return data.signedUrl;
}
