import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '@/context/UserContext';
import {useRouter} from 'expo-router';

export default function Index() {
  const {loading} = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      router.replace('/(tabs)/home');
    }
  }, [loading]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </SafeAreaView>
  );
}
