import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { Moment, MomentNote, MomentScripture } from '@moments/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { getMoment } from '../lib/moments';
import { listNotes, listScriptures } from '../lib/notes';

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
  const { momentId } = route.params;
  const [moment, setMoment] = useState<Moment | null>(null);
  const [notes, setNotes] = useState<MomentNote[]>([]);
  const [scriptures, setScriptures] = useState<MomentScripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    Promise.all([getMoment(momentId), listNotes(momentId), listScriptures(momentId)])
      .then(([m, n, s]) => {
        if (cancelled) return;
        setMoment(m);
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

  return (
    <View style={styles.container}>
      <Text variant="heading">{moment?.title ?? 'Moment'}</Text>
      {moment?.date ? (
        <Text variant="caption" color={colors.textMuted}>
          {moment.date}
        </Text>
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
            </View>
          </>
        )}
      </ScrollView>

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
});
