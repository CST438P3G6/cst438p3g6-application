import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import Auth from '../../components/Auth';
import Account from '../../components/Account';
import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        if (Platform.OS === 'web') {
          console.log('web');
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
        } else {
          console.log('not web');
          const storedSession = await AsyncStorage.getItem('supabase.auth.token');
          if (storedSession) {
            const parsedSession = JSON.parse(storedSession);
            setSession(parsedSession);
          } else {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
          }
        }
      } catch (error) {
        console.error('Error retrieving session:', error);
      }
    };

    // Initial session retrieval
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (Platform.OS !== 'web') {
        if (session) {
          AsyncStorage.setItem('supabase.auth.token', JSON.stringify(session));
        } else {
          AsyncStorage.removeItem('supabase.auth.token');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  );
}
