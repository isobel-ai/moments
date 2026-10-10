import React from 'react';
import { NoteStep } from './NoteStep';

export interface PrayerStepProps {
  onBack: () => void;
  onSave: () => void;
  onNext: () => void;
  momentId?: string;
  onSaved?: () => void;
}

/**
 * Prayer step (S8a.dc.html): "Write the words you prayed."
 */
export function PrayerStep(props: PrayerStepProps) {
  return (
    <NoteStep
      {...props}
      kind="prayer"
      step={0}
      total={3}
      title="Prayer"
      subtitle="Write the words you prayed."
      placeholder="Lord, thank you for your presence today…"
    />
  );
}
