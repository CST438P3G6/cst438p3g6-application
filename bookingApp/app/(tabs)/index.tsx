import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import config from '../../tamagui.config';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import LoginPage from './LoginPage';
import Account from '../../components/Account';
import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <loginPage />
      )}
    </TamaguiProvider>
  );
}