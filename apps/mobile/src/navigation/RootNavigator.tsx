import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { LogoRevealScreen } from '../screens/LogoRevealScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { SignInUpScreen } from '../screens/SignInUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RecordingScreen } from '../screens/RecordingScreen';
import { AddNoteScreen } from '../screens/AddNoteScreen';
import { NoteSavedScreen } from '../screens/NoteSavedScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { SavingScreen } from '../screens/SavingScreen';
import { EnrichScreen } from '../screens/EnrichScreen';
import { PrayerStep } from '../screens/PrayerStep';
import { ScriptureStep } from '../screens/ScriptureStep';
import { RevelationStep } from '../screens/RevelationStep';
import { FavouriteStep } from '../screens/FavouriteStep';
import { ReflectionStep } from '../screens/ReflectionStep';
import { CompleteScreen } from '../screens/CompleteScreen';
import { PlayerScreen, type EnrichmentType } from '../screens/PlayerScreen';
import { MomentSheetScreen } from '../screens/MomentSheetScreen';
import { CollectionsScreen } from '../screens/CollectionsScreen';
import { ImportScreen } from '../screens/ImportScreen';
import { ImportDetailsScreen } from '../screens/ImportDetailsScreen';
import { useAuth } from '../features/auth/AuthProvider';
import { uploadAudio } from '../lib/upload';
import type { SelectedAudioFile } from '../lib/audio';

export type RootStackParamList = {
  Splash: undefined;
  LogoReveal: undefined;
  Welcome: undefined;
  SignInUp: undefined;
  Home: undefined;
  Recording: undefined;
  AddNote: undefined;
  NoteSaved: undefined;
  Review: undefined;
  Saving: undefined;
  Enrich: undefined;
  // `momentId` opens the step as a standalone editor for an existing moment.
  PrayerStep: { momentId?: string } | undefined;
  ScriptureStep: { momentId?: string } | undefined;
  RevelationStep: { momentId?: string } | undefined;
  FavouriteStep: undefined;
  ReflectionStep: { momentId?: string } | undefined;
  Complete: undefined;
  // `savedAt` changes after an enrichment is saved, prompting a refetch.
  Player: { momentId?: string; savedAt?: number } | undefined;
  MomentSheet: undefined;
  Collections: undefined;
  Import: undefined;
  ImportDetails: { file: SelectedAudioFile } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

function SplashRoute({ navigation }: ScreenProps) {
  const { session, loading } = useAuth();

  const handleEnter = () => {
    // Already authenticated: skip the welcome/sign-in flow and go straight home.
    if (session) {
      navigation.replace('Home');
    } else {
      navigation.replace('LogoReveal');
    }
  };

  // Wait for the session to load before deciding where to route.
  if (loading) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return <SplashScreen onEnter={handleEnter} />;
}

function LogoRevealRoute({ navigation }: ScreenProps) {
  return <LogoRevealScreen onDone={() => navigation.replace('Welcome')} />;
}

function WelcomeRoute({ navigation }: ScreenProps) {
  return <WelcomeScreen onStart={() => navigation.replace('SignInUp')} />;
}

function SignInUpRoute({ navigation }: ScreenProps) {
  return (
    <SignInUpScreen
      onBack={() => navigation.navigate('Welcome')}
      onAuthenticated={() => navigation.replace('Home')}
    />
  );
}

function HomeRoute({ navigation }: ScreenProps) {
  const { signOut } = useAuth();
  return (
    <HomeScreen
      onRecord={() => navigation.navigate('Recording')}
      onOpenMoment={(momentId) => navigation.navigate('Player', { momentId })}
      onSeeAll={() => navigation.navigate('Collections')}
      onImport={() => navigation.navigate('Import')}
      onCollections={() => navigation.navigate('Collections')}
      onSignOut={() => {
        signOut();
        navigation.navigate('Welcome');
      }}
    />
  );
}

function RecordingRoute({ navigation }: ScreenProps) {
  return (
    <RecordingScreen
      onBack={() => navigation.navigate('Home')}
      onAddNote={() => navigation.navigate('AddNote')}
      onStop={() => navigation.navigate('Review')}
    />
  );
}

function AddNoteRoute({ navigation }: ScreenProps) {
  return (
    <AddNoteScreen
      onClose={() => navigation.goBack()}
      onSave={() => navigation.replace('NoteSaved')}
    />
  );
}

function NoteSavedRoute({ navigation }: ScreenProps) {
  return (
    <NoteSavedScreen
      onAddNote={() => navigation.navigate('AddNote')}
      onStop={() => navigation.navigate('Review')}
    />
  );
}

function ReviewRoute({ navigation }: ScreenProps) {
  return (
    <ReviewScreen
      onBack={() => navigation.navigate('Recording')}
      onSave={() => navigation.navigate('Saving')}
    />
  );
}

function SavingRoute({ navigation }: ScreenProps) {
  return <SavingScreen onDone={() => navigation.replace('Enrich')} />;
}

function EnrichRoute({ navigation }: ScreenProps) {
  return (
    <EnrichScreen
      onBack={() => navigation.navigate('Home')}
      onContinue={(selected) => {
        const hasFavourite = selected.includes('Favourite Moment');
        if (hasFavourite) {
          navigation.navigate('FavouriteStep');
        } else {
          navigation.navigate('PrayerStep');
        }
      }}
      onLater={() => navigation.navigate('Player')}
    />
  );
}

function PrayerStepRoute({ navigation, route }: ScreenProps<'PrayerStep'>) {
  return (
    <PrayerStep
      momentId={route.params?.momentId}
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('ScriptureStep')}
      onSaved={() =>
        // Return to the Player with a fresh `savedAt` so it refetches right away.
        navigation.popTo('Player', {
          momentId: route.params?.momentId,
          savedAt: Date.now(),
        })
      }
    />
  );
}

function ScriptureStepRoute({ navigation, route }: ScreenProps<'ScriptureStep'>) {
  return (
    <ScriptureStep
      momentId={route.params?.momentId}
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('RevelationStep')}
      onSaved={() =>
        // Return to the Player with a fresh `savedAt` so it refetches right away.
        navigation.popTo('Player', {
          momentId: route.params?.momentId,
          savedAt: Date.now(),
        })
      }
    />
  );
}

function RevelationStepRoute({ navigation, route }: ScreenProps<'RevelationStep'>) {
  return (
    <RevelationStep
      momentId={route.params?.momentId}
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('Complete')}
      onSaved={() =>
        // Return to the Player with a fresh `savedAt` so it refetches right away.
        navigation.popTo('Player', {
          momentId: route.params?.momentId,
          savedAt: Date.now(),
        })
      }
    />
  );
}

function FavouriteStepRoute({ navigation }: ScreenProps) {
  return (
    <FavouriteStep
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('ReflectionStep')}
    />
  );
}

function ReflectionStepRoute({ navigation, route }: ScreenProps<'ReflectionStep'>) {
  return (
    <ReflectionStep
      momentId={route.params?.momentId}
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('Complete')}
      onSaved={() =>
        // Return to the Player with a fresh `savedAt` so it refetches right away.
        navigation.popTo('Player', {
          momentId: route.params?.momentId,
          savedAt: Date.now(),
        })
      }
    />
  );
}

function CompleteRoute({ navigation }: ScreenProps) {
  return (
    <CompleteScreen
      onViewMoment={() => navigation.navigate('Player')}
      onHome={() => navigation.navigate('Home')}
    />
  );
}

const enrichmentRoutes: Record<
  EnrichmentType,
  'ScriptureStep' | 'PrayerStep' | 'RevelationStep' | 'ReflectionStep'
> = {
  scripture: 'ScriptureStep',
  prayer: 'PrayerStep',
  revelation: 'RevelationStep',
  reflection: 'ReflectionStep',
};

function PlayerRoute({ navigation, route }: ScreenProps<'Player'>) {
  const momentId = route.params?.momentId;

  return (
    <PlayerScreen
      momentId={momentId}
      reloadKey={route.params?.savedAt}
      onBack={() => navigation.navigate('Home')}
      onAddMore={() => navigation.navigate('Enrich')}
      onAddEnrichment={(type) =>
        navigation.navigate(enrichmentRoutes[type], { momentId })
      }
    />
  );
}

function MomentSheetRoute({ navigation }: ScreenProps) {
  return (
    <MomentSheetScreen
      onBack={() => navigation.navigate('Home')}
      onAddMore={() => navigation.navigate('Enrich')}
    />
  );
}

function CollectionsRoute({ navigation }: ScreenProps) {
  return (
    <CollectionsScreen
      onBack={() => navigation.navigate('Home')}
      onOpenMoment={(momentId) => navigation.navigate('Player', { momentId })}
      onRecord={() => navigation.navigate('Recording')}
      onImport={() => navigation.navigate('Import')}
    />
  );
}

function ImportRoute({ navigation }: ScreenProps) {
  return (
    <ImportScreen
      onBack={() => navigation.navigate('Home')}
      onChooseFiles={(file) => navigation.navigate('ImportDetails', { file })}
      onVoiceMemos={(file) => navigation.navigate('ImportDetails', { file })}
      onRecord={() => navigation.navigate('Recording')}
      onCollections={() => navigation.navigate('Collections')}
    />
  );
}

function ImportDetailsRoute({ navigation, route }: ScreenProps<'ImportDetails'>) {
  const file = route.params?.file ?? {
    uri: '',
    fileName: 'Audio file',
    duration: 0,
    format: 'm4a' as const,
  };

  return (
    <ImportDetailsScreen
      file={file}
      onBack={() => navigation.goBack()}
      onImport={async (selected, title) => {
        await uploadAudio({
          uri: selected.uri,
          duration: selected.duration,
          format: selected.format,
          fileName: selected.fileName,
          title,
        });
        navigation.navigate('Saving');
      }}
    />
  );
}

/**
 * Design-only prototype navigator. Auth gating is bypassed so the whole flow is
 * tappable without signing in.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#071F49' },
        animation: 'fade',
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="Splash" component={SplashRoute} />
      <Stack.Screen name="LogoReveal" component={LogoRevealRoute} />
      <Stack.Screen name="Welcome" component={WelcomeRoute} />
      <Stack.Screen name="SignInUp" component={SignInUpRoute} />
      <Stack.Screen name="Home" component={HomeRoute} />
      <Stack.Screen name="Recording" component={RecordingRoute} />
      <Stack.Screen name="AddNote" component={AddNoteRoute} />
      <Stack.Screen name="NoteSaved" component={NoteSavedRoute} />
      <Stack.Screen name="Review" component={ReviewRoute} />
      <Stack.Screen name="Saving" component={SavingRoute} />
      <Stack.Screen name="Enrich" component={EnrichRoute} />
      <Stack.Screen name="PrayerStep" component={PrayerStepRoute} />
      <Stack.Screen name="ScriptureStep" component={ScriptureStepRoute} />
      <Stack.Screen name="RevelationStep" component={RevelationStepRoute} />
      <Stack.Screen name="FavouriteStep" component={FavouriteStepRoute} />
      <Stack.Screen name="ReflectionStep" component={ReflectionStepRoute} />
      <Stack.Screen name="Complete" component={CompleteRoute} />
      <Stack.Screen name="Player" component={PlayerRoute} />
      <Stack.Screen name="MomentSheet" component={MomentSheetRoute} />
      <Stack.Screen name="Collections" component={CollectionsRoute} />
      <Stack.Screen name="Import" component={ImportRoute} />
      <Stack.Screen name="ImportDetails" component={ImportDetailsRoute} />
    </Stack.Navigator>
  );
}
