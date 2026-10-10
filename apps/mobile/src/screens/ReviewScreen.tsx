import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts, makeMiniBars } from '@moments/ui';
import { PlayerCard, NoteRow, PaperGrain } from '@moments/ui';

export interface ReviewScreenProps {
  onBack: () => void;
  onSave: () => void;
}

const notes = [
  { time: '04:32', text: 'Peace over the exam' },
  { time: '08:17', text: 'Thank you for today' },
  { time: '11:08', text: 'Guide my steps' },
];

function BackIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6 L9 12 L15 18"
        stroke={colors.cobalt}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12 L10 17 L19 7"
        stroke={colors.white}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Review (S5.dc.html): editable title, compact player, notes list, Save Moment.
 */
export function ReviewScreen({ onBack, onSave }: ReviewScreenProps) {
  const insets = useSafeAreaInsets();
  const bars = makeMiniBars(44, 36, 3, colors.playerBar, {
    wave: 4,
    minHeight: 3,
  });

  return (
    <View style={styles.container}>
      <PaperGrain opacity={0.35} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={[styles.back, { top: insets.top + 16 }]}
      >
        <BackIcon />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 40 },
        ]}
      >
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.reviewTitle}
          defaultValue="Saturday morning worship"
          style={styles.title}
        />

        <View style={styles.player}>
          <PlayerCard duration="12:46" bars={bars} />
        </View>

        <Text style={styles.overline}>NOTES SAVED</Text>

        <View style={styles.notes}>
          {notes.map((note) => (
            <NoteRow key={note.time} time={note.time} text={note.text} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.saveWrap, { bottom: insets.bottom + 56 }]}>
        <Text style={styles.saveLabel}>Save Moment</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save Moment"
          onPress={onSave}
          style={styles.saveOrb}
        >
          <CheckIcon />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  back: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 200,
  },
  title: {
    fontFamily: fonts.handwriting,
    fontSize: 42,
    color: colors.reviewTitle,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.reviewTitleUnderline,
    paddingBottom: 8,
  },
  player: {
    marginTop: 28,
  },
  overline: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.textSecondary,
    marginTop: 32,
    marginBottom: 14,
  },
  notes: {
    gap: 12,
  },
  saveWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  saveLabel: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.reviewSaveLabel,
  },
  saveOrb: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.reviewSaveBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
