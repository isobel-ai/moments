import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Expo config that reads environment variables at build time.
 * Values are injected via EAS build profiles or a local .env file.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Moments',
  slug: 'moments',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'moments',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.moments.app',
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Moments uses the microphone to record audio for your Moments.',
      UIBackgroundModes: ['audio'],
    },
  },
  android: {
    package: 'com.moments.app',
    permissions: ['RECORD_AUDIO'],
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
});
