import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { colors, fonts } from '@moments/ui';
import { StepLayout } from './StepLayout';

export interface PrayerStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
}

/**
 * Prayer step (S8a.dc.html): "Write the words you prayed."
 */
export function PrayerStep({ onBack, onSave, onNext }: PrayerStepProps) {
  return (
    <StepLayout
      step={0}
      total={3}
      title="Prayer"
      subtitle="Write the words you prayed."
      onBack={onBack}
      onSave={onSave}
      onNext={onNext}
    >
      <TextInput
        multiline
        placeholder="Lord, thank you for your presence today…"
        placeholderTextColor={colors.placeholderHand}
        style={styles.input}
        textAlignVertical="top"
      />
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
});
