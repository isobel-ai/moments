import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';

export interface NoteRowProps {
  /** Timestamp in mm:ss. */
  time: string;
  text: string;
  onPress?: () => void;
}

/**
 * A single timestamped note row: a time chip on the left and the note text.
 */
export function NoteRow({ time, text, onPress }: NoteRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.chip}>
        <Text style={styles.chipText}>{time}</Text>
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(49,86,184,0.12)',
  },
  pressed: {
    opacity: 0.8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.paleBlue,
  },
  chipText: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    color: colors.cobalt,
  },
  text: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
  },
});
