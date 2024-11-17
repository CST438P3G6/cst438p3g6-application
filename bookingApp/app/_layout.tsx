import AsyncStorage from '@react-native-async-storage/async-storage';
import {SplashScreen, Slot} from 'expo-router';
import * as React from 'react';
import {Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserContextProvider} from '@/context/UserContext';

export {ErrorBoundary} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <UserContextProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Slot />
      </GestureHandlerRootView>
    </UserContextProvider>
  );
}
