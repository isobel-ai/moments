import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts, makeWaveformBars } from '@moments/ui';
import { Waveform } from '@moments/ui';

export interface RecordingScreenProps {
  onBack: () => void;
  onAddNote: () => void;
  onStop: () => void;
}

function BackIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6 L9 12 L15 18"
        stroke={colors.recordingControl}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PauseIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6 L9 18 M15 6 L15 18"
        stroke={colors.recordingControl}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function StopIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={colors.recordingControl}
        strokeWidth="1.8"
      />
      <Circle cx="12" cy="12" r="4" fill={colors.recordingControl} />
    </Svg>
  );
}

/**
 * Recording (S3.dc.html): navy screen with timer, live waveform, Add notes and
 * Pause/Stop controls.
 */
export function RecordingScreen({ onBack, onAddNote, onStop }: RecordingScreenProps) {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0); // starts at 00:00
  const [ms, setMs] = useState(0);
  const bars = useRef(
    makeWaveformBars(68, 250, 7, colors.recordingBar, {
      accentColor: colors.recordingBarAccent,
    }),
  ).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setMs((prev) => {
        if (prev + 1 >= 1000) {
          setSeconds((s) => s + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={[styles.back, { top: insets.top + 16 }]}
      >
        <BackIcon />
      </Pressable>

      <View style={[styles.timerWrap, { paddingTop: insets.top + 112 }]}>
        <View style={styles.timerRow}>
          <Text style={styles.timer}>
            {mm}:{ss}
          </Text>
          <Text style={styles.ms}>.{String(ms).padStart(3, '0')}</Text>
        </View>
        <Text style={styles.label}>Recording</Text>
      </View>

      <View style={styles.waveWrap}>
        <Waveform
          bars={bars}
          height={260}
          barWidth={2}
          gap={2}
          paddingHorizontal={28}
        />
      </View>

      <View style={[styles.controls, { bottom: insets.bottom + 92 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={onAddNote}
          style={styles.addNote}
        >
          <Text style={styles.addNoteText}>Add notes</Text>
        </Pressable>

        <View style={styles.roundControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pause"
            style={styles.roundControl}
          >
            <PauseIcon />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Stop"
            onPress={onStop}
            style={styles.roundControl}
          >
            <StopIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.recordingBgMid,
  },
  back: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrap: {
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timer: {
    fontFamily: fonts.uiLight,
    fontSize: 64,
    color: colors.recordingTimer,
    fontVariant: ['tabular-nums'],
  },
  ms: {
    fontFamily: fonts.uiLight,
    fontSize: 18,
    color: colors.recordingMs,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.recordingLabel,
    marginTop: 4,
  },
  waveWrap: {
    marginTop: 40,
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 28,
  },
  addNote: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 9999,
    borderWidth: 1.2,
    borderColor: colors.recordingAddBorder,
  },
  addNoteText: {
    fontFamily: fonts.uiMedium,
    fontSize: 15,
    color: colors.recordingAddText,
  },
  roundControls: {
    flexDirection: 'row',
    gap: 40,
  },
  roundControl: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.2,
    borderColor: colors.recordingControl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
