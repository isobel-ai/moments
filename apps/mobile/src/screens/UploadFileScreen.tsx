import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, colors, spacing } from '@moments/ui';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDocumentAsync } from 'expo-document-picker';
import type { DocumentPickerAsset } from 'expo-document-picker';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { detectAudioFormat, getAudioDuration } from '../lib/audio';
import { uploadAudio } from '../lib/upload';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadFile'>;

type Status = 'idle' | 'uploading' | 'done' | 'error';

export function UploadFileScreen({ navigation }: Props) {
    const [status, setStatus] = useState<Status>('idle');
    const [asset, setAsset] = useState<DocumentPickerAsset | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePick = async () => {
        setError(null);
        setStatus('idle');
        try {
            const result = await getDocumentAsync({
                type: ['audio/*'],
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (result.canceled) return;

            const picked = result.assets[0];
            if (!picked) return;

            const format = detectAudioFormat(picked.name, picked.mimeType);
            if (!format) {
                setError('Please choose an audio file (m4a, mp3, wav, aac, or ogg).');
                setStatus('error');
                return;
            }

            const fileDuration = await getAudioDuration(picked.uri);
            setAsset(picked);
            setDuration(fileDuration);
            setStatus('idle');
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setStatus('error');
        }
    };

    const handleUpload = async () => {
        if (!asset || duration === null) return;
        setError(null);
        setStatus('uploading');
        try {
            const format = detectAudioFormat(asset.name, asset.mimeType);
            if (!format) throw new Error('Unsupported audio format.');
            await uploadAudio({
                uri: asset.uri,
                duration,
                format,
                fileName: asset.name,
            });
            setStatus('done');
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setStatus('error');
        }
    };

    const format = asset ? detectAudioFormat(asset.name, asset.mimeType) : null;

    return (
        <View style={styles.container}>
            <Text variant="heading">Upload Audio File</Text>
            <Text variant="body" color={colors.textSecondary}>
                Choose an existing audio file and upload it to the audio bucket.
            </Text>

            <View style={styles.status}>
                {status === 'idle' && !asset && (
                    <Text variant="body" color={colors.textMuted}>
                        Choose an audio file to upload.
                    </Text>
                )}
                {asset && (
                    <View style={styles.fileInfo}>
                        <Text variant="body" color={colors.text}>
                            {asset.name}
                        </Text>
                        <Text variant="caption" color={colors.textMuted}>
                            {format?.toUpperCase()}
                            {duration !== null ? ` · ${duration.toFixed(1)}s` : ''}
                            {asset.size ? ` · ${(asset.size / 1024).toFixed(0)} KB` : ''}
                        </Text>
                    </View>
                )}
                {status === 'uploading' && (
                    <Text variant="body" color={colors.brand}>
                        Uploading…
                    </Text>
                )}
                {status === 'done' && (
                    <Text variant="body" color={colors.success}>
                        Uploaded successfully.
                    </Text>
                )}
                {status === 'error' && error && (
                    <Text variant="body" color={colors.danger}>
                        {error}
                    </Text>
                )}
            </View>

            <View style={styles.controls}>
                <Button
                    label={asset ? 'Choose another file' : 'Choose audio file'}
                    onPress={handlePick}
                    disabled={status === 'uploading'}
                />
                {asset && (
                    <Button
                        label="Upload"
                        onPress={handleUpload}
                        disabled={status === 'uploading'}
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
    fileInfo: {
        gap: spacing.xs,
    },
    controls: {
        marginTop: 'auto',
        gap: spacing.md,
    },
});
