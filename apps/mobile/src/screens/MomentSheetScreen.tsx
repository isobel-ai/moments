import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, makeWaveformBars } from '@moments/ui';
import { Waveform, PaperGrain } from '@moments/ui';

export interface MomentSheetScreenProps {
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

const notes = [
  { time: '04:32', text: 'Peace over the exam' },
  { time: '08:17', text: 'Thank you for today' },
  { time: '11:08', text: 'Guide my steps' },
];

/**
 * Moment-Sheet (S9b.dc.html): player compressed above an expanded sheet.
 */
export function MomentSheetScreen({ onBack, onAddMore }: MomentSheetScreenProps) {
  const insets = useSafeAreaInsets();
  const bars = makeWaveformBars(64, 60, 5, colors.playerBar);

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
        <Text style={styles.topTitle}>Saturday morning worship</Text>
        <Text style={styles.topDate}>10 October 2026</Text>
      </View>

      <View style={styles.player}>
        <Waveform
          bars={bars}
          height={60}
          barWidth={2}
          gap={2}
          paddingHorizontal={28}
        />
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
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.grabber} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Reflect on your moment</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onAddMore}
            style={styles.addMore}
          >
            <Text style={styles.addMoreText}>Add more</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <Text style={styles.sectionLabel}>NOTES</Text>
          <View style={styles.notes}>
            {notes.map((note) => (
              <View key={note.time} style={styles.noteRow}>
                <View style={styles.noteChip}>
                  <Text style={styles.noteChipText}>{note.time}</Text>
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>SCRIPTURE</Text>
          <View style={styles.card}>
            <Text style={styles.cardQuote}>“</Text>
            <Text style={styles.cardText}>
              As the deer pants for streams of water, so my soul pants for you,
              my God.
            </Text>
            <Text style={styles.cardRef}>Psalm 42:1 · NIV</Text>
          </View>

          <Text style={styles.sectionLabel}>PRAYER</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Lord, thank you for your presence today. Help me to rest in you.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  top: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconBtn: {
    position: 'absolute',
    left: 24,
    top: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: fonts.handwriting,
    fontSize: 28,
    color: colors.playerTitle,
    marginTop: 8,
  },
  topDate: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.playerDate,
    marginTop: 2,
  },
  player: {
    marginTop: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    marginTop: 12,
  },
  control: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    flex: 1,
    marginTop: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.playerSheetBg,
    borderWidth: 1,
    borderColor: colors.playerSheetBorder,
    paddingTop: 10,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.playerSheetGrabber,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sheetTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.playerSheetTitle,
  },
  addMore: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.2,
    borderColor: colors.playerSheetAddBorder,
  },
  addMoreText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.playerSheetAdd,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.playerSheetMeta,
    marginTop: 20,
    marginBottom: 10,
  },
  notes: {
    gap: 10,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.playerSheetRowBorder,
  },
  noteChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.playerSheetNoteChip,
  },
  noteChipText: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    color: colors.playerSheetNoteChipText,
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.playerSheetNoteText,
  },
  card: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.playerSheetCardBg,
    borderWidth: 1,
    borderColor: colors.playerSheetCardBorder,
  },
  cardQuote: {
    fontFamily: fonts.heading,
    fontSize: 34,
    color: colors.playerSheetIcon,
    lineHeight: 26,
  },
  cardText: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24,
    color: colors.playerSheetNoteText,
    marginTop: 4,
  },
  cardRef: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.playerSheetRef,
    marginTop: 10,
  },
});
