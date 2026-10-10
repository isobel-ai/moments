import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Text, colors, spacing } from '@moments/ui';
import type { AudioAsset } from '@moments/types';

import { getSignedAudioUrl } from '../lib/audio';

export interface AudioPlayerProps {
  audio: AudioAsset;
  title?: string;
}

/** Formats a number of seconds as `m:ss`. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Streams and plays a moment's audio from the private storage bucket.
 *
 * The audio file is private, so we first request a short-lived signed URL and
 * hand it to an `expo-audio` player. Playback is in-app only (see
 * docs/decisions/0002-audio-playback.md for background playback plans).
 */
export function AudioPlayer({ audio, title }: AudioPlayerProps) {
  const [signedUrl, setSignedUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [trackWidth, setTrackWidth] = useState(0);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    let cancelled = false;
    setError(undefined);
    getSignedAudioUrl(audio.path)
      .then((url) => {
        if (!cancelled) setSignedUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [audio.path]);

  useEffect(() => {
    if (signedUrl) {
      player.replace({ uri: signedUrl });
    }
  }, [signedUrl, player]);

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seek = (progress: number) => {
    if (status.duration > 0) {
      player.seekTo(progress * status.duration);
    }
  };

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={status.playing ? 'Pause' : 'Play'}
          onPress={togglePlay}
          disabled={!signedUrl || !status.isLoaded}
          style={({ pressed }) => [
            styles.playButton,
            (!signedUrl || !status.isLoaded) && styles.playButtonDisabled,
            pressed && styles.playButtonPressed,
          ]}
        >
          <Text variant="title" color={colors.background}>
            {status.playing ? '❚❚' : '▶'}
          </Text>
        </Pressable>

        <View style={styles.info}>
          {title ? (
            <Text variant="body" numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          <Text variant="caption" color={colors.textMuted}>
            {formatTime(status.currentTime)} / {formatTime(status.duration)}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel="Seek"
        onLayout={onTrackLayout}
        onPress={(event) => {
          if (trackWidth > 0) {
            seek(event.nativeEvent.locationX / trackWidth);
          }
        }}
        style={styles.progressTrack}
      >
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </Pressable>

      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playButtonPressed: {
    opacity: 0.85,
  },
  info: {
    flex: 1,
    gap: spacing.xxs,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.waveformRemaining,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.waveformPlayed,
  },
});
