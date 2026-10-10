import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, makeWaveformBars } from '@moments/ui';
import { Waveform } from '@moments/ui';
import { StepLayout } from './StepLayout';

export interface FavouriteStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
}

function PlayIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 5 L19 12 L8 19 Z"
        fill={colors.favouritePlay}
        stroke={colors.favouritePlay}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Favourite Moment step (S8d.dc.html): waveform with a selected range, Start/End
 * boxes and an optional title.
 */
export function FavouriteStep({ onBack, onSave, onNext }: FavouriteStepProps) {
  const bars = makeWaveformBars(64, 120, 11, colors.favouriteBar);

  return (
    <StepLayout
      step={0}
      total={2}
      title="Favourite Moment"
      subtitle="Choose the part of your recording to keep close."
      onBack={onBack}
      onSave={onSave}
      onNext={onNext}
    >
      <View style={styles.waveWrap}>
        <Waveform
          bars={bars}
          height={120}
          barWidth={2}
          gap={2}
          paddingHorizontal={0}
        />
        <View style={styles.range} />
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>START</Text>
          <Text style={styles.timeValue}>04:32</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>END</Text>
          <Text style={styles.timeValue}>05:04</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Play selection"
          style={styles.play}
        >
          <PlayIcon />
        </Pressable>
      </View>

      <TextInput
        placeholder="TITLE (OPTIONAL)"
        placeholderTextColor={colors.favouriteTitle}
        style={styles.title}
      />
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  waveWrap: {
    marginTop: 28,
    position: 'relative',
  },
  range: {
    position: 'absolute',
    left: '36.67%',
    right: '40%',
    top: 0,
    bottom: 0,
    backgroundColor: colors.favouriteRangeBg,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.favouriteRangeBorder,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  timeBox: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.favouriteBoxBg,
  },
  timeLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.favouriteBoxLabel,
  },
  timeValue: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    color: colors.favouriteBoxValue,
    marginTop: 2,
  },
  play: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: colors.favouritePlayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 28,
    fontFamily: fonts.handwriting,
    fontSize: 32,
    color: colors.favouriteTitle,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.favouriteTitleUnderline,
    paddingBottom: 8,
  },
});
