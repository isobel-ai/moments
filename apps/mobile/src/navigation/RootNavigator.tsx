import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../features/auth/AuthProvider';
import { HomeScreen } from '../screens/HomeScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { UploadFileScreen } from '../screens/UploadFileScreen';
import { MomentDetailScreen } from '../screens/MomentDetailScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { AddScriptureScreen } from '../screens/AddScriptureScreen';
import { BibleTestScreen } from '../screens/BibleTestScreen';

export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  UploadFile: undefined;
  MomentDetail: { momentId: string };
  AddScripture: { momentId: string };
  BibleTest: undefined;
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0E0D0B' },
      }}
    >
      {session ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="UploadFile" component={UploadFileScreen} />
          <Stack.Screen name="MomentDetail" component={MomentDetailScreen} />
          <Stack.Screen name="AddScripture" component={AddScriptureScreen} />
          <Stack.Screen name="BibleTest" component={BibleTestScreen} />
        </>
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
}
