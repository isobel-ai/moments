import React from 'react';
import { NoteStep } from './NoteStep';

export interface RevelationStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  momentId?: string;
  onSaved?: () => void;
}

/**
 * Revelation step (S8c.dc.html): "What did God show you?"
 */
export function RevelationStep(props: RevelationStepProps) {
  return (
    <NoteStep
      {...props}
      kind="revelation"
      step={2}
      total={3}
      title="Revelation"
      subtitle="What did God show you?"
      placeholder="Rest is not passive. It is an act of trust."
    />
  );
}
