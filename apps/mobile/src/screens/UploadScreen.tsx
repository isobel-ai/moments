import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useRecorder } from '../lib/audio';
import { uploadAudio } from '../lib/upload';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

type Status = 'idle' | 'recording' | 'uploading' | 'done' | 'error';

export function UploadScreen({ navigation }: Props) {
    const { start, stop, isRecording } = useRecorder();
    const [status, setStatus] = useState<Status>('idle');
    const [path, setPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRecord = async () => {
        setError(null);
        setPath(null);
        try {
            await start();
            setStatus('recording');
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setStatus('error');
        }
    };

    const handleStopAndUpload = async () => {
        setError(null);
        try {
            const recording = await stop();
            setStatus('uploading');
            const result = await uploadAudio(recording);
            setPath(result.path);
            setStatus('done');
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setStatus('error');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="heading">Upload Audio</Text>
            <Text variant="body" color={colors.textSecondary}>
                Record a clip and upload it to the audio bucket.
            </Text>

            <View style={styles.status}>
                {status === 'idle' && (
                    <Text variant="body" color={colors.textMuted}>
                        Ready to record.
                    </Text>
                )}
                {status === 'recording' && (
                    <Text variant="body" color={colors.brand}>
                        Recording… tap stop to upload.
                    </Text>
                )}
                {status === 'uploading' && (
                    <Text variant="body" color={colors.brand}>
                        Uploading…
                    </Text>
                )}
                {status === 'done' && path && (
                    <Text variant="body" color={colors.success}>
                        Uploaded: {path}
                    </Text>
                )}
                {status === 'error' && error && (
                    <Text variant="body" color={colors.danger}>
                        {error}
                    </Text>
                )}
            </View>

            <View style={styles.controls}>
                {status !== 'recording' ? (
                    <Button
                        label="Start recording"
                        onPress={handleRecord}
                        disabled={status === 'uploading'}
                    />
                ) : (
                    <Button
                        label="Stop & upload"
                        variant="danger"
                        onPress={handleStopAndUpload}
                    />
                )}
                <Button
                    label="Back"
                    variant="ghost"
                    onPress={() => navigation.goBack()}
                />
            </View>
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
    status: {
        flex: 1,
        justifyContent: 'center',
    },
    controls: {
        marginTop: 'auto',
        gap: spacing.md,
    },
});
