import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../features/auth/AuthProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading">Moments</Text>
        <Button label="Sign out" variant="ghost" onPress={signOut} />
      </View>

      <FlatList
        data={[]}
        keyExtractor={(item) => item}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="title" color={colors.textSecondary}>
              No Moments yet
            </Text>
            <Text variant="body" color={colors.textMuted}>
              Record your first Moment to begin capturing the story.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.fab}>
        <Button
          label="Record"
          onPress={() => navigation.navigate('Record')}
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
  list: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
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
  },
});
