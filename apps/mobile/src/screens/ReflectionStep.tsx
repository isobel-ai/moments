import React from 'react';
import { NoteStep } from './NoteStep';

export interface ReflectionStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  momentId?: string;
  onSaved?: () => void;
}

/**
 * Reflection step (S8e.dc.html): "What do you want to remember about this Moment?"
 */
export function ReflectionStep(props: ReflectionStepProps) {
  return (
    <NoteStep
      {...props}
      kind="reflection"
      step={1}
      total={2}
      title="Reflection"
      subtitle="What do you want to remember about this Moment?"
      placeholder="I came in anxious about the exam. By the end I was just glad to be with Him."
      nextLabel="Finish"
    />
  );
}
