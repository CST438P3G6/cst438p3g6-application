import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Theme, ThemeProvider} from '@react-navigation/native';
import {SplashScreen, Slot} from 'expo-router';
import * as React from 'react';
import {Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {UserContextProvider} from '@/context/UserContext';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {ErrorBoundary} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {setColorScheme, isDarkColorScheme} = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    const initializeTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        if (Platform.OS === 'web') {
          document.documentElement.classList.add('bg-background');
        }
        const colorTheme = theme === 'dark' ? 'dark' : 'light';
        setColorScheme(colorTheme);

        if (!theme) {
          await AsyncStorage.setItem('theme', colorTheme);
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
      } finally {
        await SplashScreen.hideAsync();
        setIsColorSchemeLoaded(true);
      }
    };

    initializeTheme();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    // this provides the theme to all pages in the app throught slot
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <UserContextProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <Slot />
        </GestureHandlerRootView>
      </UserContextProvider>
    </ThemeProvider>
  );
}
