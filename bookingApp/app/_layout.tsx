import AsyncStorage from '@react-native-async-storage/async-storage';
import {SplashScreen, Slot} from 'expo-router';
import * as React from 'react';
import {Platform, View, Text, AppState, ActivityIndicator} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserContextProvider} from '@/context/UserContext';

export {ErrorBoundary} from 'expo-router';

try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  console.warn('SplashScreen.preventAutoHideAsync() failed:', e);
}

export default function RootLayout() {
  const [initialized, setInitialized] = React.useState(false);
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
    });

    const init = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await AsyncStorage.getItem('firstLaunch');
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setInitialized(true);
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('SplashScreen.hideAsync() failed:', e);
        }
      }
    };

    init();

    return () => {
      subscription.remove();
    };
  }, []);

  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <UserContextProvider>
        <Slot />
      </UserContextProvider>
    </GestureHandlerRootView>
  );
}

export function ErrorBoundary(props: {error: Error}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>An error occurred: {props.error.message}</Text>
    </View>
  );
}
