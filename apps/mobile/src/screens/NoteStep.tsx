import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { colors, fonts } from '@moments/ui';
import type { MomentNoteKind } from '@moments/types';
import { createNote } from '../lib/notes';
import { StepLayout } from './StepLayout';

export interface NoteStepProps {
  kind: MomentNoteKind;
  title: string;
  subtitle: string;
  placeholder: string;
  step: number;
  total: number;
  nextLabel?: string;
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  /** When set, the step edits this moment directly: Save writes a note. */
  momentId?: string;
  onSaved?: () => void;
}

/**
 * Shared text-note step for Prayer, Revelation and Reflection. Without a
 * `momentId` it is the post-recording enrich step; with one it is a standalone
 * editor that saves a note to an existing moment.
 */
export function NoteStep({
  kind,
  title,
  subtitle,
  placeholder,
  step,
  total,
  nextLabel,
  onBack,
  onSave,
  onNext,
  momentId,
  onSaved,
}: NoteStepProps) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const editing = Boolean(momentId);
  const canSave = content.trim().length > 0 && !saving;

  async function handleSave() {
    if (!momentId || !canSave) return;
    setSaving(true);
    setError(undefined);
    try {
      await createNote({
        momentId,
        kind,
        content: content.trim(),
        isDuringRecording: false,
        isUpdated: true,
      });
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <StepLayout
      step={editing ? undefined : step}
      total={editing ? undefined : total}
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      onSave={editing ? undefined : onSave}
      onNext={editing ? handleSave : onNext}
      nextLabel={editing ? (saving ? 'Saving…' : 'Save') : nextLabel}
      nextDisabled={editing && !canSave}
    >
      <TextInput
        multiline
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderHand}
        style={styles.input}
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
        editable={!saving}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 28,
    fontFamily: fonts.handwriting,
    fontSize: 32,
    lineHeight: 44,
    color: colors.stepFieldText,
    padding: 0,
    minHeight: 200,
  },
  error: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.danger,
    marginTop: 12,
  },
});
