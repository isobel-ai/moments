import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { colors, fonts } from '@moments/ui';
import { StepLayout } from './StepLayout';

export interface RevelationStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
}

/**
 * Revelation step (S8c.dc.html): "What did God show you?"
 */
export function RevelationStep({ onBack, onSave, onNext }: RevelationStepProps) {
  return (
    <StepLayout
      step={2}
      total={3}
      title="Revelation"
      subtitle="What did God show you?"
      onBack={onBack}
      onSave={onSave}
      onNext={onNext}
    >
      <TextInput
        multiline
        placeholder="Rest is not passive. It is an act of trust."
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
