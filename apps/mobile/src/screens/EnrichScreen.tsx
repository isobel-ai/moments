import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@moments/ui';
import { Tile, PaperGrain } from '@moments/ui';

export interface EnrichScreenProps {
  onBack: () => void;
  onContinue: (selected: string[]) => void;
  onLater: () => void;
}

const options = [
  'Scripture',
  'Prayer',
  'Revelation',
  'Favourite Moment',
  'Reflection',
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

/**
 * Enrich (S7.dc.html): two-column grid of selectable tiles.
 */
export function EnrichScreen({ onBack, onContinue, onLater }: EnrichScreenProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([
    'Scripture',
    'Prayer',
    'Revelation',
  ]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label],
    );
  };

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

      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Text style={styles.title}>
          Would you like to enrich your Moment?
        </Text>
        <Text style={styles.subtitle}>
          Add Scripture, a prayer, a revelation and more.
        </Text>

        <View style={styles.grid}>
          {options.map((label) => (
            <Tile
              key={label}
              label={label}
              selected={selected.includes(label)}
              onPress={() => toggle(label)}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onContinue(selected)}
          style={styles.continue}
        >
          <Text style={styles.continueText}>Continue with selected</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onLater}
          style={styles.later}
        >
          <Text style={styles.laterText}>Maybe later</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 34,
    lineHeight: 37,
    color: colors.enrichTitle,
  },
  subtitle: {
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.enrichSubtitle,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 36,
  },
  footer: {
    paddingHorizontal: 28,
    gap: 16,
  },
  continue: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: colors.enrichContinue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontFamily: fonts.uiMedium,
    fontSize: 15,
    color: colors.white,
  },
  later: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  laterText: {
    fontFamily: fonts.uiMedium,
    fontSize: 15,
    color: colors.enrichLater,
  },
});
