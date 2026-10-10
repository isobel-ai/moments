import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  ScripturePicker,
  type ScriptureSelection,
} from '../features/scripture';

type Props = NativeStackScreenProps<RootStackParamList, 'BibleTest'>;

/**
 * TEMPORARY test screen — just to verify the bible passage picker + api.bible
 * edge function work together. Delete this screen and its route after testing.
 */
export function BibleTestScreen({ navigation }: Props) {
  const [selection, setSelection] = useState<ScriptureSelection>();

  return (
    <View style={styles.container}>
      <ScripturePicker
        onSelect={setSelection}
        onCancel={() => navigation.goBack()}
      />

      {selection ? (
        <ScrollView style={styles.result}>
          <Text variant="title">Result</Text>
          <Text variant="body" color={colors.textSecondary}>
            {selection.reference}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            passageKey: {selection.passageKey}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            bibleId: {selection.bibleId}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            translation: {selection.translation}
          </Text>
          {selection.text ? (
            <Text variant="body" color={colors.textSecondary}>
              {selection.text}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}

      <Button
        label="Done"
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
  },
  result: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
