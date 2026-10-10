import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MomentDetail'>;

export function MomentDetailScreen({ navigation, route }: Props) {
  const { momentId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="heading">Moment</Text>
      <Text variant="body" color={colors.textSecondary}>
        {momentId}
      </Text>
      <Button
        label="Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
});
