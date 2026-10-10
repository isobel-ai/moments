import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  ScripturePicker,
  type ScriptureSelection,
} from '../features/scripture';
import { createScripture } from '../lib/scriptures';

type Props = NativeStackScreenProps<RootStackParamList, 'AddScripture'>;

export function AddScriptureScreen({ navigation, route }: Props) {
  const { momentId } = route.params;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSelect(selection: ScriptureSelection) {
    setSaving(true);
    setError(undefined);
    try {
      await createScripture({
        momentId,
        reference: selection.reference,
        passageKey: selection.passageKey,
        bibleId: selection.bibleId,
        translation: selection.translation,
        text: selection.text,
      });
      navigation.goBack();
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScripturePicker
        onSelect={handleSelect}
        onCancel={() => navigation.goBack()}
        saving={saving}
      />
      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
});
