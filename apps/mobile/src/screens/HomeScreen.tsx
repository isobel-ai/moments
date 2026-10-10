import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@moments/ui';
import { Orb, BottomNav, PaperGrain } from '@moments/ui';
import { useAuth } from '../features/auth/AuthProvider';
import { getProfile } from '../lib/profile';
import { listMoments } from '../lib/moments';
import type { Moment } from '@moments/types';

export interface HomeScreenProps {
  onRecord: () => void;
  onOpenMoment: () => void;
  onSeeAll: () => void;
  onImport: () => void;
  onCollections: () => void;
}

function CollectionsIcon() {
  return (
    <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4h18v5H3z"
        stroke={colors.cobalt}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"
        stroke={colors.cobalt}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Formats an ISO date string into a short, human-friendly label. */
function formatMomentDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) {
    return `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  return d.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function Chevron() {
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
 * Home (S2.dc.html): greeting, recording orb, Recent Moments row, bottom nav.
 */
export function HomeScreen({
  onRecord,
  onOpenMoment,
  onSeeAll,
  onImport,
  onCollections,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    let active = true;
    getProfile(userId)
      .then((profile) => {
        if (active && profile?.display_name) {
          setDisplayName(profile.display_name);
        }
      })
      .catch(() => {
        // Ignore profile fetch errors; fall back to a generic greeting.
      });

    listMoments(userId)
      .then((data) => {
        if (active) setMoments(data);
      })
      .catch(() => {
        // Ignore moment fetch errors; show an empty Recent Moments row.
      });

    return () => {
      active = false;
    };
  }, [session]);

  const greetingName = displayName ?? 'friend';
  const recentMoments = moments.slice(0, 3);

  return (
    <View style={styles.container}>
      <PaperGrain opacity={0.35} />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.greeting}>
          Welcome back,{'\n'}{greetingName}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Collections"
          onPress={onCollections}
          style={styles.headerIcon}
        >
          <CollectionsIcon />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Record a moment"
          onPress={onRecord}
          style={styles.orbWrap}
        >
          <Orb size={300} />
        </Pressable>

        <View style={styles.orbCaption}>
          <Text style={styles.orbTitle}>Come sit with Jesus</Text>
          <Text style={styles.orbSubtitle}>Press and be still</Text>
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Moments</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onSeeAll}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentRow}
        >
          {recentMoments.length === 0 ? (
            <Text style={styles.recentEmpty}>
              No moments yet. Press the orb to record your first one.
            </Text>
          ) : (
            recentMoments.map((moment) => (
              <Pressable
                key={moment.id}
                accessibilityRole="button"
                onPress={onOpenMoment}
                style={styles.recentCard}
              >
                <View style={styles.recentCardBody}>
                  <Text style={styles.recentCardTitle} numberOfLines={1}>
                    {moment.title}
                  </Text>
                  <Text style={styles.recentCardTime}>
                    {formatMomentDate(moment.date)}
                  </Text>
                </View>
                <Chevron />
              </Pressable>
            ))
          )}
        </ScrollView>
      </ScrollView>

      <View style={[styles.nav, { paddingBottom: insets.bottom + 8 }]}>
        <BottomNav
          active="record"
          onPress={(tab) => {
            if (tab === 'import') onImport();
            if (tab === 'collections') onCollections();
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
    backgroundColor: colors.homeBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  greeting: {
    fontFamily: fonts.handwriting,
    fontSize: 32,
    lineHeight: 38,
    color: colors.cobalt,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 120,
  },
  orbWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  orbCaption: {
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  orbTitle: {
    fontFamily: fonts.handwriting,
    fontSize: 34,
    color: colors.cobalt,
  },
  orbSubtitle: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textSecondary,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 16,
  },
  recentTitle: {
    fontFamily: fonts.heading,
    fontSize: 25,
    color: colors.darkBlue,
  },
  seeAll: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.cobalt,
  },
  recentRow: {
    gap: 14,
    paddingRight: 28,
  },
  recentEmpty: {
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 24,
  },
  recentCard: {
    width: 292,
    height: 84,
    borderRadius: 18,
    backgroundColor: colors.warmWhiteCard,
    borderWidth: 1,
    borderColor: colors.homeBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
  },
  recentCardBody: {
    flex: 1,
    gap: 4,
  },
  recentCardTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.darkBlue,
  },
  recentCardTime: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textSecondary,
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
