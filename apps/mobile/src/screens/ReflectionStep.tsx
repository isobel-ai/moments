import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { colors, fonts } from '@moments/ui';
import { StepLayout } from './StepLayout';

export interface ReflectionStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
}

/**
 * Reflection step (S8e.dc.html): "What do you want to remember about this Moment?"
 */
export function ReflectionStep({ onBack, onSave, onNext }: ReflectionStepProps) {
  return (
    <StepLayout
      step={1}
      total={2}
      title="Reflection"
      subtitle="What do you want to remember about this Moment?"
      onBack={onBack}
      onSave={onSave}
      onNext={onNext}
      nextLabel="Finish"
    >
      <TextInput
        multiline
        placeholder="I came in anxious about the exam. By the end I was just glad to be with Him."
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
