import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { Moment, MomentNote, MomentScripture, AudioAsset } from '@moments/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { getMoment, getMomentAudio } from '../lib/moments';
import { createNote, listNotes, listScriptures } from '../lib/notes';
import { NoteForm, type NoteFormInput } from '../features/note';
import { AudioPlayer } from '../components/AudioPlayer';

type Props = NativeStackScreenProps<RootStackParamList, 'MomentDetail'>;

/** Strip HTML tags (e.g. api.bible's `<p>`, `<span>`) to render as plain text. */
function stripHtml(html: string): string {
  return html
    // Remove verse-number spans entirely (e.g. <span class="v">1</span>).
    .replace(/<span[^>]*class="v"[^>]*>.*?<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function MomentDetailScreen({ navigation, route }: Props) {
  const { momentId, openNoteForm } = route.params;
  const [moment, setMoment] = useState<Moment | null>(null);
  const [audio, setAudio] = useState<AudioAsset | null>(null);
  const [notes, setNotes] = useState<MomentNote[]>([]);
  const [scriptures, setScriptures] = useState<MomentScripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [noteFormOpen, setNoteFormOpen] = useState(Boolean(openNoteForm));
  const [saving, setSaving] = useState(false);
  const [noteError, setNoteError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    Promise.all([
      getMoment(momentId),
      getMomentAudio(momentId),
      listNotes(momentId),
      listScriptures(momentId),
    ])
      .then(([m, a, n, s]) => {
        if (cancelled) return;
        setMoment(m);
        setAudio(a);
        setNotes(n);
        setScriptures(s);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [momentId]);

  async function handleSaveNote(input: NoteFormInput) {
    setSaving(true);
    setNoteError(undefined);
    try {
      const note = await createNote({
        momentId,
        kind: input.kind,
        content: input.content,
        isDuringRecording: false,
        isUpdated: true,
      });
      setNotes((prev) => [...prev, note]);
      setNoteFormOpen(false);
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="heading">{moment?.title ?? 'Moment'}</Text>
      {moment?.date ? (
        <Text variant="caption" color={colors.textMuted}>
          {moment.date}
        </Text>
      ) : null}

      {audio ? (
        <AudioPlayer audio={audio} title={moment?.title} />
      ) : null}

      {error ? (
        <Text variant="body" color={colors.danger}>
          {error}
        </Text>
      ) : null}

      <ScrollView style={styles.content}>
        {loading ? (
          <Text variant="body" color={colors.textMuted}>
            Loading…
          </Text>
        ) : (
          <>
            <View style={styles.section}>
              <Text variant="title">Scriptures</Text>
              {scriptures.length === 0 ? (
                <Text variant="body" color={colors.textMuted}>
                  No scriptures yet.
                </Text>
              ) : (
                scriptures.map((s) => (
                  <View key={s.id} style={styles.card}>
                    <Text variant="body" color={colors.textSecondary}>
                      {s.reference} ({s.translation})
                    </Text>
                    {s.text ? (
                      <Text variant="body" color={colors.textMuted}>
                        {stripHtml(s.text)}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <Text variant="title">Notes</Text>
              {notes.length === 0 ? (
                <Text variant="body" color={colors.textMuted}>
                  No notes yet.
                </Text>
              ) : (
                notes.map((n) => (
                  <View key={n.id} style={styles.card}>
                    <Text variant="caption" color={colors.textSecondary}>
                      {n.kind}
                    </Text>
                    <Text variant="body" color={colors.textMuted}>
                      {n.content}
                    </Text>
                  </View>
                ))
              )}
              {noteFormOpen ? (
                <View style={styles.noteForm}>
                  <NoteForm
                    onSave={handleSaveNote}
                    onCancel={() => setNoteFormOpen(false)}
                    saving={saving}
                  />
                  {noteError ? (
                    <Text variant="caption" color={colors.danger}>
                      {noteError}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </>
        )}
      </ScrollView>

      <Button
        label="Add note"
        variant="secondary"
        onPress={() => setNoteFormOpen(true)}
      />
      <Button
        label="Add scripture"
        variant="secondary"
        onPress={() => navigation.navigate('AddScripture', { momentId })}
      />
      <Button
        label="Back"
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
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  section: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
  },
  noteForm: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
