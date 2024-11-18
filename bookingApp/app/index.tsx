import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '@/context/UserContext';
import {useRouter} from 'expo-router';

export default function Index() {
  const {loading} = useUser();
  const router = useRouter();

  // Let UserContext handle routing after initial load
  React.useEffect(() => {
    if (!loading) {
      // UserContext will handle actual redirect logic
      router.replace('/(tabs)/index');
    }
  }, [loading]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    </SafeAreaView>
  );
}
