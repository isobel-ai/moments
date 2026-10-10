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
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, makeMiniBars } from '@moments/ui';
import { BottomNav, PaperGrain, Waveform } from '@moments/ui';

export interface CollectionsScreenProps {
  onOpenMoment: () => void;
  onRecord: () => void;
  onImport: () => void;
}

const moments = [
  { title: 'Saturday morning worship', date: '10 October 2026', duration: '12:46', privacy: 'Private' },
  { title: 'Quiet time', date: '8 October 2026', duration: '08:12', privacy: 'Private' },
  { title: 'Night prayer', date: '6 October 2026', duration: '09:15', privacy: 'Private' },
  { title: 'Spontaneous flow', date: '4 October 2026', duration: '06:40', privacy: 'Private' },
  { title: 'Sunday worship', date: '2 October 2026', duration: '14:02', privacy: 'Private' },
];

function Arrow() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6 L15 12 L9 18"
        stroke={colors.textSecondary}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Collections (S10.dc.html): search, filter, list of Moment cards, bottom nav.
 */
export function CollectionsScreen({
  onOpenMoment,
  onRecord,
  onImport,
}: CollectionsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <PaperGrain opacity={0.35} />

      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.title}>Collections</Text>
        <Text style={styles.subtitle}>Your Moments</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={colors.placeholder}
          style={styles.search}
        />
        <Pressable
          accessibilityRole="button"
          style={styles.filter}
        >
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {moments.map((moment, index) => (
          <Pressable
            key={moment.title}
            accessibilityRole="button"
            onPress={onOpenMoment}
            style={styles.card}
          >
            <View style={styles.thumb}>
              <Waveform
                bars={makeMiniBars(12, 40, index + 1, colors.collectionsCardWave)}
                height={40}
                barWidth={2}
                gap={2}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {moment.title}
              </Text>
              <Text style={styles.cardMeta}>
                {moment.date} · {moment.duration} · {moment.privacy}
              </Text>
            </View>
            <Arrow />
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.nav, { paddingBottom: insets.bottom + 8 }]}>
        <BottomNav
          active="collections"
          onPress={(tab) => {
            if (tab === 'import') onImport();
            if (tab === 'record') onRecord();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  header: {
    paddingHorizontal: 28,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 42,
    color: colors.collectionsTitle,
  },
  subtitle: {
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.collectionsSubtitle,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 28,
    marginTop: 24,
  },
  search: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.collectionsSearchBorder,
    backgroundColor: colors.collectionsSearchBg,
    paddingHorizontal: 16,
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.collectionsSearchText,
  },
  filter: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.collectionsFilterBorder,
    backgroundColor: colors.collectionsFilterBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.cobalt,
  },
  list: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.collectionsCardBorder,
    backgroundColor: colors.collectionsCardBg,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.collectionsCardTitle,
  },
  cardMeta: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.collectionsCardMeta,
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
