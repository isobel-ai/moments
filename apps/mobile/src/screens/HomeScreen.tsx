import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { Moment } from '@moments/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../features/auth/AuthProvider';
import { listMoments } from '../lib/moments';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMoments()
      .then(setMoments)
      .catch(() => setMoments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading">Moments</Text>
        <View style={styles.headerActions}>
          <Button label="Sign out" variant="ghost" onPress={signOut} />
        </View>
      </View>

      <FlatList
        data={moments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('MomentDetail', { momentId: item.id })
            }
          >
            <View style={styles.cardText}>
              <Text variant="title">{item.title}</Text>
              <Text variant="caption" color={colors.textMuted}>
                {item.date}
              </Text>
            </View>
            <Button
              label="Add scripture"
              variant="secondary"
              onPress={() =>
                navigation.navigate('AddScripture', { momentId: item.id })
              }
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="title" color={colors.textSecondary}>
              {loading ? 'Loading…' : 'No Moments yet'}
            </Text>
            <Text variant="body" color={colors.textMuted}>
              Upload your first audio clip to begin capturing the story.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.fab}>
        <Button
          label="Upload"
          variant="secondary"
          onPress={() => navigation.navigate('Upload')}
        />
        <Button
          label="Upload file"
          variant="secondary"
          onPress={() => navigation.navigate('UploadFile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardText: {
    flex: 1,
    gap: spacing.xxs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
});
