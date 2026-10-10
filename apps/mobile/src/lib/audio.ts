import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  type AudioRecorder,
} from 'expo-audio';
import type { AudioAsset, AudioFormat } from '@moments/types';

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
