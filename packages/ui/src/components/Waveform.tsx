import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import type { WaveformPeaks } from '@moments/types';

export interface WaveformProps {
  peaks: WaveformPeaks;
  /** Progress from 0 to 1. */
  progress?: number;
  style?: ViewStyle;
}

/**
 * A lightweight waveform renderer driven by a peaks file.
 *
 * This is a placeholder implementation. In production it should be backed by
 * a performant canvas/SVG renderer (e.g. react-native-svg) for long audio.
 */
export function Waveform({ peaks, progress = 0, style }: WaveformProps) {
  const barCount = Math.min(peaks.peaks.length, 64);
  const bars = peaks.peaks.slice(0, barCount);

  return (
    <View style={[styles.container, style]}>
      {bars.map((value, index) => {
        const played = index / barCount <= progress;
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: Math.max(4, value * 40),
                backgroundColor: played
                  ? colors.waveformPlayed
                  : colors.waveformRemaining,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    height: 44,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
});
