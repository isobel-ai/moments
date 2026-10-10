import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, fonts, radii } from '@moments/ui';
import { ScripturePicker, type ScriptureSelection } from '../features/scripture';
import { createScripture } from '../lib/scriptures';
import { StepLayout } from './StepLayout';

export interface ScriptureStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  /** When set, the step edits this moment directly: picking a passage saves it. */
  momentId?: string;
  onSaved?: () => void;
}

const results = [
  { ref: 'Psalm 42:1', text: 'As the deer pants for streams of water, so my soul pants for you, my God.' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
  { ref: 'John 15:5', text: 'I am the vine; you are the branches.' },
  { ref: 'Isaiah 40:31', text: 'Those who hope in the Lord will renew their strength.' },
];

/**
 * Scripture step (S8b.dc.html): search field, results, passage preview.
 */
export function ScriptureStep({
  onBack,
  onSave,
  onNext,
  momentId,
  onSaved,
}: ScriptureStepProps) {
  const [selected, setSelected] = useState<string | null>('Psalm 42:1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  if (momentId) {
    const handleSelect = async (selection: ScriptureSelection) => {
      setSaving(true);
      setError(undefined);
      try {
        await createScripture({ momentId, ...selection });
        onSaved?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSaving(false);
      }
    };

    return (
      <StepLayout
        title="Scripture"
        subtitle="Add a verse that spoke to you."
        onBack={onBack}
      >
        <View style={styles.picker}>
          <ScripturePicker
            onSelect={handleSelect}
            saving={saving}
            showHeader={false}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      step={1}
      total={3}
      title="Scripture"
      subtitle="Add a verse that spoke to you."
      onBack={onBack}
      onSave={onSave}
      onNext={onNext}
    >
      <View style={styles.search}>
        <TextInput
          placeholder="Search a verse"
          placeholderTextColor={colors.scriptureSearchPlaceholder}
          style={styles.searchInput}
        />
        <View style={styles.translation}>
          <Text style={styles.translationText}>NIV</Text>
        </View>
      </View>

      <View style={styles.results}>
        {results.map((result) => {
          const isSelected = selected === result.ref;
          return (
            <Pressable
              key={result.ref}
              accessibilityRole="button"
              onPress={() => setSelected(result.ref)}
              style={[
                styles.result,
                isSelected && styles.resultSelected,
              ]}
            >
              <Text style={styles.resultRef}>{result.ref}</Text>
              <Text style={styles.resultText} numberOfLines={1}>
                {result.text}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selected && (
        <View style={styles.preview}>
          <Text style={styles.previewQuote}>“</Text>
          <Text style={styles.previewText}>
            As the deer pants for streams of water, so my soul pants for you, my
            God.
          </Text>
          <Text style={styles.previewRef}>Psalm 42:1 · NIV</Text>
        </View>
      )}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  picker: {
    marginTop: 28,
  },
  error: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.danger,
    marginTop: 12,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    borderWidth: 1,
    borderColor: colors.scriptureSearchBorder,
    borderRadius: radii.field,
    backgroundColor: colors.scriptureSearchBg,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.scriptureSearchText,
    paddingVertical: 14,
  },
  translation: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: colors.hairline,
  },
  translationText: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.scriptureResultTranslation,
  },
  results: {
    marginTop: 16,
    gap: 10,
  },
  result: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.field,
    borderWidth: 1,
    borderColor: colors.scriptureResultBorder,
    backgroundColor: colors.scriptureResultBg,
  },
  resultSelected: {
    backgroundColor: colors.scriptureResultSelected,
  },
  resultRef: {
    fontFamily: fonts.uiMedium,
    fontSize: 14,
    color: colors.scriptureResultText,
  },
  resultText: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.scriptureResultTranslation,
    marginTop: 2,
  },
  preview: {
    marginTop: 20,
    padding: 20,
    borderRadius: radii.card,
    backgroundColor: colors.scripturePreviewBg,
    borderWidth: 1,
    borderColor: colors.scripturePreviewBorder,
  },
  previewQuote: {
    fontFamily: fonts.heading,
    fontSize: 40,
    color: colors.scripturePreviewQuote,
    lineHeight: 30,
  },
  previewText: {
    fontFamily: fonts.heading,
    fontSize: 21,
    lineHeight: 27,
    color: colors.scripturePreviewText,
    marginTop: 6,
  },
  previewRef: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    color: colors.scripturePreviewRef,
    marginTop: 12,
  },
});
