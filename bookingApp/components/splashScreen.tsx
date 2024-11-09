import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useRouter} from 'expo-router';
import {supabase} from '@/utils/supabase';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // I think we can call the user object from asycn storage and not have this api call here.
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        router.replace('/(tabs)/(client)/home');
      } else {
        router.replace('/(auth)/loginPage');
      }
    };

    checkUser();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default SplashScreen;
