import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { LogoRevealScreen } from '../screens/LogoRevealScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
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
import { PlayerScreen } from '../screens/PlayerScreen';
import { MomentSheetScreen } from '../screens/MomentSheetScreen';
import { CollectionsScreen } from '../screens/CollectionsScreen';
import { ImportScreen } from '../screens/ImportScreen';
import { ImportDetailsScreen } from '../screens/ImportDetailsScreen';

export type RootStackParamList = {
  Splash: undefined;
  LogoReveal: undefined;
  Welcome: undefined;
  Home: undefined;
  Recording: undefined;
  AddNote: undefined;
  NoteSaved: undefined;
  Review: undefined;
  Saving: undefined;
  Enrich: undefined;
  PrayerStep: undefined;
  ScriptureStep: undefined;
  RevelationStep: undefined;
  FavouriteStep: undefined;
  ReflectionStep: undefined;
  Complete: undefined;
  Player: undefined;
  MomentSheet: undefined;
  Collections: undefined;
  Import: undefined;
  ImportDetails: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenProps = NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>;

function SplashRoute({ navigation }: ScreenProps) {
  return <SplashScreen onEnter={() => navigation.replace('LogoReveal')} />;
}

function LogoRevealRoute({ navigation }: ScreenProps) {
  return <LogoRevealScreen onDone={() => navigation.replace('Welcome')} />;
}

function WelcomeRoute({ navigation }: ScreenProps) {
  return <WelcomeScreen onStart={() => navigation.replace('Home')} />;
}

function HomeRoute({ navigation }: ScreenProps) {
  return (
    <HomeScreen
      onRecord={() => navigation.navigate('Recording')}
      onOpenMoment={() => navigation.navigate('Player')}
      onSeeAll={() => navigation.navigate('Collections')}
      onImport={() => navigation.navigate('Import')}
      onCollections={() => navigation.navigate('Collections')}
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

function PrayerStepRoute({ navigation }: ScreenProps) {
  return (
    <PrayerStep
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('ScriptureStep')}
    />
  );
}

function ScriptureStepRoute({ navigation }: ScreenProps) {
  return (
    <ScriptureStep
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('RevelationStep')}
    />
  );
}

function RevelationStepRoute({ navigation }: ScreenProps) {
  return (
    <RevelationStep
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('Complete')}
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

function ReflectionStepRoute({ navigation }: ScreenProps) {
  return (
    <ReflectionStep
      onBack={() => navigation.goBack()}
      onSave={() => navigation.navigate('Player')}
      onNext={() => navigation.navigate('Complete')}
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

function PlayerRoute({ navigation }: ScreenProps) {
  return (
    <PlayerScreen
      onBack={() => navigation.navigate('Home')}
      onAddMore={() => navigation.navigate('Enrich')}
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
      onOpenMoment={() => navigation.navigate('Player')}
      onRecord={() => navigation.navigate('Recording')}
      onImport={() => navigation.navigate('Import')}
    />
  );
}

function ImportRoute({ navigation }: ScreenProps) {
  return (
    <ImportScreen
      onBack={() => navigation.navigate('Home')}
      onChooseFiles={() => navigation.navigate('ImportDetails')}
      onVoiceMemos={() => navigation.navigate('ImportDetails')}
      onRecord={() => navigation.navigate('Recording')}
      onCollections={() => navigation.navigate('Collections')}
    />
  );
}

function ImportDetailsRoute({ navigation }: ScreenProps) {
  return (
    <ImportDetailsScreen
      onBack={() => navigation.goBack()}
      onImport={() => navigation.navigate('Saving')}
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
