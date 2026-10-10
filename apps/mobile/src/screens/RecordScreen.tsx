import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Record'>;

export function RecordScreen({ navigation }: Props) {
  const [recording, setRecording] = useState(false);

  return (
    <View style={styles.container}>
      <Text variant="heading">Record a Moment</Text>
      <Text variant="body" color={colors.textSecondary}>
        Capture the sound and the story around it.
      </Text>

      <View style={styles.controls}>
        <Button
          label={recording ? 'Stop' : 'Start recording'}
          variant={recording ? 'danger' : 'primary'}
          onPress={() => setRecording((r) => !r)}
        />
        <Button
          label="Cancel"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </View>
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
  controls: {
    marginTop: 'auto',
    gap: spacing.md,
  },
});
