import React, { useEffect, useRef } from 'react';
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

export interface NoteSavedScreenProps {
  onAddNote: () => void;
  onStop: () => void;
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
 * Note-Saved (S4b.dc.html): back on the recorder with the "Note saved" toast.
 */
export function NoteSavedScreen({ onAddNote, onStop }: NoteSavedScreenProps) {
  const insets = useSafeAreaInsets();
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const bars = useRef(
    makeWaveformBars(68, 250, 7, colors.recordingBar, {
      accentColor: colors.recordingBarAccent,
    }),
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toastOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.toast, { top: insets.top + 52, opacity: toastOpacity }]}
      >
        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12 L10 17 L19 7"
            stroke={colors.toastCheck}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.toastText}>Note saved</Text>
      </Animated.View>

      <View style={[styles.timerWrap, { paddingTop: insets.top + 112 }]}>
        <View style={styles.timerRow}>
          <Text style={styles.timer}>04:36</Text>
          <Text style={styles.ms}>.512</Text>
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
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.toastBg,
    borderWidth: 1,
    borderColor: colors.toastBorder,
  },
  toastText: {
    fontFamily: fonts.uiMedium,
    fontSize: 14,
    color: colors.onNavy,
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
