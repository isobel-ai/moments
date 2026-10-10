import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, makeWaveformBars } from '@moments/ui';
import { Waveform, PlayerSheet, PaperGrain } from '@moments/ui';
import type { Moment } from '@moments/types';
import { getMoment } from '../lib/moments';

export interface PlayerScreenProps {
  momentId?: string;
  onBack: () => void;
  onAddMore: () => void;
}

function BackIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6 L9 12 L15 18"
        stroke={colors.cobalt}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShareIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3 L12 15 M7 8 L12 3 L17 8 M5 19 L19 19"
        stroke={colors.cobalt}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Back15Icon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5 A7 7 0 1 1 5 12 M5 12 L2 9 M5 12 L8 9"
        stroke={colors.playerControl}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Forward15Icon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5 A7 7 0 1 0 19 12 M19 12 L22 9 M19 12 L16 9"
        stroke={colors.playerControl}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PauseIcon() {
  return (
    <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6 L9 18 M15 6 L15 18"
        stroke={colors.playerControl}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const sections = [
  { type: 'notes' as const, title: 'Notes', preview: '3 notes saved', time: '04:32' },
  { type: 'scripture' as const, title: 'Scripture', preview: 'Psalm 42:1 · As the deer pants for streams of water…' },
  { type: 'prayer' as const, title: 'Prayer', preview: 'Lord, thank you for your presence today…' },
  { type: 'revelation' as const, title: 'Revelation', preview: 'Rest is not passive. It is an act of trust.' },
];

function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Player (S9.dc.html): back/share, handwritten title, waveform, controls, sheet.
 */
export function PlayerScreen({ momentId, onBack, onAddMore }: PlayerScreenProps) {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [moment, setMoment] = useState<Moment | null>(null);

  useEffect(() => {
    if (!momentId) return;
    let active = true;
    getMoment(momentId)
      .then((data) => {
        if (active) setMoment(data);
      })
      .catch(() => {
        if (active) setMoment(null);
      });
    return () => {
      active = false;
    };
  }, [momentId]);

  const title = moment?.title ?? 'Saturday morning worship';
  const date = moment ? formatDate(moment.date) : '10 October 2026';
  const duration = moment ? formatDuration(moment.audio.duration) : '12:46';

  const bars = makeWaveformBars(64, 200, 5, colors.playerBar, {
    frequency: 1.6,
    phase: -0.9,
    power: 1.4,
    wave: 12,
    waveFrequency: 1.2,
    wavePhase: 0.3,
    minHeight: 6,
    playhead: 0.355,
    playedOpacity: 1,
    unplayedOpacity: 0.28,
  });

  return (
    <View style={styles.container}>
      <PaperGrain opacity={0.35} />

      <View style={[styles.top, { paddingTop: insets.top + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={styles.iconBtn}
        >
          <BackIcon />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share"
          style={styles.iconBtn}
        >
          <ShareIcon />
        </Pressable>
      </View>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.meta}>{duration} · Private</Text>
      </View>

      <View style={styles.waveWrap}>
        <Waveform
          bars={bars}
          height={200}
          barWidth={2}
          gap={2}
          paddingHorizontal={28}
        />
        <View style={styles.progress} />
        <View style={[styles.marker, { left: '64.8%' }]} />
        <View style={[styles.marker, { left: '87.2%' }]} />
      </View>

      <View style={styles.times}>
        <Text style={styles.time}>04:32</Text>
        <Text style={styles.time}>12:46</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back 15 seconds"
          style={styles.control}
        >
          <Back15Icon />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pause"
          style={styles.control}
        >
          <PauseIcon />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Forward 15 seconds"
          style={styles.control}
        >
          <Forward15Icon />
        </Pressable>
      </View>

      <View style={styles.secondary}>
        <Text style={styles.secondaryText}>1x</Text>
        <Text style={styles.secondaryText}>Favourite</Text>
        <Text style={styles.secondaryText}>Add note</Text>
      </View>

      <PlayerSheet
        expanded={expanded}
        onToggle={() => setExpanded((e) => !e)}
        sections={sections}
        onAddMore={onAddMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 8,
  },
  title: {
    fontFamily: fonts.handwriting,
    fontSize: 46,
    color: colors.playerTitle,
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.playerDate,
    marginTop: 6,
  },
  meta: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.playerMeta,
    marginTop: 2,
  },
  waveWrap: {
    marginTop: 32,
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: 28,
    width: '35.5%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(49,86,184,0.2)',
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.playerMarker,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginTop: 12,
  },
  time: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.playerTime,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    marginTop: 24,
  },
  control: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 16,
  },
  secondaryText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.playerSpeed,
  },
});
