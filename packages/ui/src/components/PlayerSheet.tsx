import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fonts, radii } from '../theme';
import { NoteRow } from './NoteRow';

export interface PlayerSheetSection {
  type: 'notes' | 'scripture' | 'prayer' | 'revelation' | 'favourite' | 'reflection';
  title: string;
  preview: string;
  time?: string;
}

export interface PlayerSheetProps {
  expanded: boolean;
  onToggle: () => void;
  sections: PlayerSheetSection[];
  onAddMore?: () => void;
}

function SectionIcon({ type }: { type: PlayerSheetSection['type'] }) {
  return (
    <View style={styles.iconCircle}>
      <Text style={styles.iconGlyph}>
        {type === 'notes' ? '✎' : type === 'scripture' ? '❝' : '✦'}
      </Text>
    </View>
  );
}

/**
 * The swipe-up "Reflect on your moment" sheet on the Player screen. For the
 * prototype it animates between collapsed and expanded states.
 */
export function PlayerSheet({
  expanded,
  onToggle,
  sections,
  onAddMore,
}: PlayerSheetProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [expanded, translateY]);

  const sheetHeight = 420;
  const collapsedOffset = sheetHeight - 96;

  const translate = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, collapsedOffset],
  });

  return (
    <Animated.View
      style={[
        styles.sheet,
        { height: sheetHeight, transform: [{ translateY: translate }] },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
        onPress={onToggle}
        style={styles.grabberWrap}
      >
        <View style={styles.grabber} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reflect on your moment</Text>
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
        contentContainerStyle={styles.content}
      >
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <SectionIcon type={section.type} />
            <View style={styles.sectionBody}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionPreview} numberOfLines={2}>
                {section.preview}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  grabberWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  grabber: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(49,86,184,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.darkBlue,
  },
  addMore: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.button,
    borderWidth: 1.2,
    borderColor: colors.cobalt,
  },
  addMoreText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.cobalt,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    color: colors.cobalt,
  },
  sectionBody: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.darkBlue,
  },
  sectionPreview: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontFamily: fonts.ui,
    fontSize: 22,
    color: colors.textSecondary,
  },
});
